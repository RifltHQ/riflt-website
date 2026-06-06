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
 *   3. If valid → fire /auth/v1/otp with create_user:true, embedding the
 *      signup form fields + promoCode in user_metadata.data so the
 *      authenticated app can read them post-magic-link.
 *   4. Promo is NOT redeemed here. Redemption happens inside
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

    // ── STEP 2: Trigger magic-link send with create_user:true ────────────────
    // Signup form data goes into user_metadata.data.riflt_signup. The
    // riflt-mvp app reads this on first authenticated load, calls
    // /api/signup-finalize, and the route atomically:
    //   - re-verifies promo is still active and atomically redeems
    //   - writes profile (first_name, last_name, country_region defaults to 'US',
    //     consents + timestamps, marketing_tags)
    //   - sets founding_member based on the promo's grants_founding_member
    //   - clears the metadata post-finalize
    const otpRes = await fetch(`${SUPABASE_URL}/auth/v1/otp`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        create_user: true,           // ← the gated branch; only this route should fire it
        data: {
          riflt_signup: {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            homeWater: homeWater.trim(),
            promoCode: trimmedPromo,
            emailConsent: emailConsent === true,
            smsConsent: smsConsent === true,
          },
        },
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
