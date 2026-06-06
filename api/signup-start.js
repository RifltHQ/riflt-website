/**
 * RIFLT API Route: POST /api/signup-start
 * F4 / PR-S4 — invoked by the /signup form's submit handler.
 *
 * SECURITY INVARIANT (Captain-locked, the linchpin of closed beta):
 *   No code path in either repo may fire `create_user: true` against
 *   Supabase Auth without a server-verified valid promo. This route is
 *   THE ONLY route in either repo that calls /auth/v1/otp with
 *   create_user:true. All other auth-OTP calls (app.riflt.com auth screen)
 *   must use create_user:false.
 *
 * Flow:
 *   1. Re-verify the promo is STILL active (race-window: a code that was
 *      active when /signup page loaded /api/check-promo may have been
 *      redeemed by someone else in the seconds it took the user to fill
 *      the form). Same atomic .eq('status','active') filter as check-promo.
 *   2. If invalid → 403, generic message (do NOT leak the reason).
 *   3. Look up the email in auth.users. If a row already exists (a user
 *      who created their account before /api/signup-start existed, OR a
 *      user re-doing signup against an existing email), patch their
 *      user_metadata to include the new riflt_signup payload. This is
 *      NECESSARY because /auth/v1/otp with create_user:true silently
 *      ignores the `data` field for an existing email — Supabase Auth
 *      treats the call as "send magic-link to existing user" and does
 *      NOT update user_metadata. Without this patch step, useAppAuth's
 *      finalizeFromMetadata short-circuits at no-metadata and the gate
 *      strands the user on AuthScreen (the post-merge production login
 *      loop reported June 6 2026).
 *   4. Fire /auth/v1/otp with create_user:true, embedding the signup
 *      form fields + promoCode in `data.riflt_signup`. For new emails
 *      this sets user_metadata; for existing emails the step-3 patch
 *      already covered it.
 *   5. Promo is NOT redeemed here. Redemption happens inside
 *      /api/signup-finalize (S2, riflt-mvp) which fires AFTER the user
 *      authenticates via the magic link. This means a user can request a
 *      magic-link with a valid code but, if they never click the link,
 *      the code stays available for someone else.
 *
 * Returns 200 { ok: true, email } on success. Never returns the OTP itself
 * (Supabase sends the email; the user receives the magic-link directly).
 */

import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, supabaseAdmin } from './_supabase-admin.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    email,
    firstName,
    lastName,
    homeWater,
    promoCode,
    emailConsent,
    smsConsent,
  } = req.body || {};

  // ── Validate required form fields ────────────────────────────────────────
  if (!email || !firstName || !lastName || !homeWater || !promoCode) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (typeof email !== 'string' || !email.includes('@') || email.length > 320) {
    return res.status(400).json({ error: 'Invalid email' });
  }
  if (typeof firstName !== 'string' || firstName.length > 100
      || typeof lastName !== 'string' || lastName.length > 100
      || typeof homeWater !== 'string' || homeWater.length > 100) {
    return res.status(400).json({ error: 'Invalid form data' });
  }

  const trimmedPromo = typeof promoCode === 'string' ? promoCode.trim() : '';
  if (!trimmedPromo || trimmedPromo.length > 64 || !/^[A-Za-z0-9_\-]+$/.test(trimmedPromo)) {
    return res.status(400).json({ error: 'Invalid promo' });
  }

  try {
    // ── STEP 1: Re-verify promo is STILL active ─────────────────────────────
    // We don't redeem yet (that's signup-finalize's job after the user
    // authenticates). We just check active-ness one more time at submit
    // to fail fast on race.
    const { data: promoCheck, error: promoErr } = await supabaseAdmin
      .from('promo_codes')
      .select('code')
      .eq('code', trimmedPromo)
      .eq('status', 'active')
      .limit(1);

    if (promoErr) {
      console.error('[signup-start] promo lookup error:', promoErr.message);
      return res.status(500).json({ error: 'Lookup failed' });
    }

    if (!Array.isArray(promoCheck) || promoCheck.length !== 1) {
      // Same generic response as check-promo. Don't leak whether the code
      // was never valid vs was redeemed in the interim.
      return res.status(403).json({ error: 'Invite required' });
    }

    // Compose the signup payload once — reused by both the existing-user
    // metadata patch (step 2) and the OTP fire (step 3).
    const rifltSignup = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      homeWater: homeWater.trim(),
      promoCode: trimmedPromo,
      emailConsent: emailConsent === true,
      smsConsent: smsConsent === true,
    };
    const normalizedEmail = email.trim().toLowerCase();

    // ── STEP 2: Patch existing-user metadata (production login-loop fix) ─────
    // Find any auth.users row already matching this email. Supabase's
    // admin API doesn't expose a getUserByEmail filter (the ?email= query
    // param is ignored at the gateway), so we list and scan client-side.
    // At beta scale (<500 users) this is well below the perPage:1000 cap
    // — when prod surpasses ~500 active users this should be replaced by
    // either an SQL helper function (SECURITY DEFINER returning the id)
    // or supabase-js's filter syntax if/when it lands.
    try {
      let existingUserId = null;
      let existingMetadata = null;
      let foundOnPage = null;
      const PER_PAGE = 200;
      // Hard cap iterations at 10 pages (2000 users) to bound the work.
      for (let page = 1; page <= 10; page++) {
        const { data: listData, error: listErr } = await supabaseAdmin.auth.admin.listUsers({
          page, perPage: PER_PAGE,
        });
        if (listErr) {
          console.error('[signup-start] listUsers error on page', page, ':', listErr.message);
          break;
        }
        const hit = listData?.users?.find(u => u.email === normalizedEmail);
        if (hit) {
          existingUserId = hit.id;
          existingMetadata = hit.user_metadata || {};
          foundOnPage = page;
          break;
        }
        if (!listData?.users || listData.users.length < PER_PAGE) break; // last page
      }

      if (existingUserId) {
        // Merge — never blow away other keys (email_verified, sub, etc.)
        // that Supabase Auth manages itself.
        const mergedMetadata = { ...existingMetadata, riflt_signup: rifltSignup };
        const { error: patchErr } = await supabaseAdmin.auth.admin.updateUserById(
          existingUserId,
          { user_metadata: mergedMetadata },
        );
        if (patchErr) {
          // Hard fail — if we can't patch metadata, the magic-link will land
          // the user in the same login loop this fix exists to prevent. Better
          // to surface a server error than silently break the signup.
          console.error('[signup-start] metadata patch failed for existing user (page',
            foundOnPage, '):', patchErr.message);
          return res.status(500).json({ error: 'Signup initiate failed' });
        }
      }
      // If user doesn't exist: skip the patch. The /auth/v1/otp call below
      // with create_user:true + data.riflt_signup will create the user
      // WITH the metadata in one atomic call.
    } catch (lookupErr) {
      console.error('[signup-start] existing-user lookup threw:', lookupErr.message);
      // Don't block signup on a lookup transient — proceed to OTP fire. If
      // the user already exists and we missed them, useAppAuth will fall
      // back to the no-metadata short-circuit (the original bug) for THIS
      // attempt only; a retry will hit a warm path. Worst case is the
      // pre-fix behavior, not a worse outcome.
    }

    // ── STEP 3: Trigger magic-link send with create_user:true ────────────────
    // For new users: this call creates auth.users with `data` as user_metadata.
    // For existing users: step 2 above already patched user_metadata, so the
    //   `data` field here is functionally redundant for them but harmless
    //   (Supabase ignores it on the existing-user path). We send it anyway
    //   so the new-user case stays atomic.
    const otpRes = await fetch(`${SUPABASE_URL}/auth/v1/otp`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: normalizedEmail,
        create_user: true,           // ← the gated branch; only this route should fire it
        data: { riflt_signup: rifltSignup },
      }),
    });

    if (!otpRes.ok) {
      const body = await otpRes.json().catch(() => ({}));
      console.error('[signup-start] /auth/v1/otp failed:', otpRes.status, body);
      return res.status(500).json({ error: 'Signup initiate failed' });
    }

    return res.status(200).json({ ok: true, email });
  } catch (err) {
    console.error('[signup-start] unhandled:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
