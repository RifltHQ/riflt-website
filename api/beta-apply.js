/**
 * RIFLT API Route: POST /api/beta-apply
 * F4 / PR-S4 — invoked by the /beta apply-for-invite form submit.
 *
 * Two effects per submission, in order:
 *   1. Write the application to public.beta_applications (canonical record;
 *      status starts at 'new' for Peggy's followup workflow).
 *   2. Fire a notification email to support@riflt.com via the same Google
 *      Workspace SMTP relay used for magic-link emails. Email contains
 *      the application fields so Brian/Peggy can decide whether to send
 *      a promo code without logging into Supabase.
 *
 * The notification email is best-effort: if it fails, the application row
 * is still persisted (founder can review via SQL queue in docs/founder-ops.md).
 * Surfacing every email error to the user would degrade UX without changing
 * the source of truth.
 *
 * REQUIRES env vars (set in riflt-website Vercel project):
 *   - SUPABASE_URL                  (read by _supabase-admin.js)
 *   - SUPABASE_SERVICE_ROLE_KEY     (read by _supabase-admin.js)
 *   - GMAIL_APP_PASSWORD            (NEW — Google Workspace app password
 *                                    for support@riflt.com SMTP send. SAME
 *                                    value Captain pasted into Supabase
 *                                    dashboard for magic-link SMTP, but
 *                                    must be set here separately as a
 *                                    Vercel env var since nodemailer
 *                                    needs runtime access)
 *
 * Captain prereq: add GMAIL_APP_PASSWORD to riflt-website Vercel project
 * env (Production + Preview). Same value as the Supabase Auth SMTP password.
 */

import nodemailer from 'nodemailer';
import { supabaseAdmin, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from './_supabase-admin.js';

const SUPPORT_EMAIL = 'support@riflt.com';
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD || '';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { firstName, lastName, email, homeWater, howHeard } = req.body || {};

  // ── Validation ───────────────────────────────────────────────────────────
  if (!firstName || !lastName || !email || !homeWater) {
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
  const sanitizedHowHeard = typeof howHeard === 'string' && howHeard.length <= 500
    ? howHeard.trim() || null
    : null;

  try {
    // ── STEP 1: Persist application row (source of truth) ────────────────────
    // DIAGNOSTIC INSTRUMENTATION (Captain debug, June 4 2026):
    //   1. Log the EXACT URL the route is about to hit (redacted; no key).
    //   2. Wrap supabase-js call; if it errors, log the FULL error object
    //      (code/details/hint/message, not just .message).
    //   3. Fall through to a raw fetch() against /rest/v1/beta_applications
    //      using the same env vars, so we can see whether the supabase-js
    //      wrapper or PostgREST itself is the source of "Invalid path".
    //   4. Return the raw REST status + body in the response payload so
    //      Captain can read it directly without scraping Vercel logs.
    //   Remove this instrumentation after the root cause is fixed.

    const insertPayload = {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim().toLowerCase(),
      home_water: homeWater.trim(),
      how_heard: sanitizedHowHeard,
    };

    console.log('[beta-apply] SUPABASE_URL present:', !!SUPABASE_URL, 'length:', SUPABASE_URL.length);
    console.log('[beta-apply] SERVICE_ROLE_KEY present:', !!SUPABASE_SERVICE_ROLE_KEY, 'length:', SUPABASE_SERVICE_ROLE_KEY.length);
    console.log('[beta-apply] target URL: ' + SUPABASE_URL + '/rest/v1/beta_applications');
    console.log('[beta-apply] payload keys: ' + Object.keys(insertPayload).join(','));

    // ── Attempt A: supabase-js client (the original failing path) ───────────
    const supaResult = await supabaseAdmin
      .from('beta_applications')
      .insert(insertPayload)
      .select('id,created_at')
      .single();

    let row = supaResult.data;
    const supaErr = supaResult.error;

    if (supaErr) {
      console.error('[beta-apply] supabase-js error FULL OBJECT:', JSON.stringify({
        message: supaErr.message,
        code: supaErr.code,
        details: supaErr.details,
        hint: supaErr.hint,
        status: supaErr.status,
        statusCode: supaErr.statusCode,
      }, null, 2));

      // ── Attempt B: direct REST POST (skip supabase-js wrapper entirely) ──
      // If this succeeds, the bug is in supabase-js. If it fails the same way,
      // the bug is at PostgREST and we'll have the raw HTTP response to diagnose.
      const rawUrl = SUPABASE_URL + '/rest/v1/beta_applications';
      console.log('[beta-apply] FALLBACK raw POST to:', rawUrl);
      try {
        const rawRes = await fetch(rawUrl, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_SERVICE_ROLE_KEY,
            'Authorization': 'Bearer ' + SUPABASE_SERVICE_ROLE_KEY,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation',
          },
          body: JSON.stringify(insertPayload),
        });
        const rawText = await rawRes.text();
        console.log('[beta-apply] raw REST status:', rawRes.status);
        console.log('[beta-apply] raw REST body:', rawText.slice(0, 500));

        if (rawRes.ok) {
          // The raw fetch worked! supabase-js is the bug. Salvage the response.
          try {
            const parsed = JSON.parse(rawText);
            row = Array.isArray(parsed) ? parsed[0] : parsed;
            console.log('[beta-apply] recovered via raw REST, row id:', row?.id);
          } catch (parseErr) {
            console.error('[beta-apply] raw REST returned 2xx but body did not parse:', parseErr.message);
            return res.status(500).json({
              error: 'Apply failed',
              diagnostic: {
                supabase_js_error: { message: supaErr.message, code: supaErr.code, details: supaErr.details, hint: supaErr.hint },
                raw_rest_status: rawRes.status,
                raw_rest_body: rawText.slice(0, 500),
              },
            });
          }
        } else {
          // Both paths failed. Return ALL diagnostic info so Captain can read it.
          return res.status(500).json({
            error: 'Apply failed',
            diagnostic: {
              supabase_js_error: { message: supaErr.message, code: supaErr.code, details: supaErr.details, hint: supaErr.hint },
              raw_rest_status: rawRes.status,
              raw_rest_body: rawText.slice(0, 500),
              url: rawUrl,
            },
          });
        }
      } catch (rawErr) {
        console.error('[beta-apply] raw REST threw:', rawErr.message);
        return res.status(500).json({
          error: 'Apply failed',
          diagnostic: {
            supabase_js_error: { message: supaErr.message, code: supaErr.code, details: supaErr.details, hint: supaErr.hint },
            raw_rest_threw: rawErr.message,
          },
        });
      }
    } else {
      console.log('[beta-apply] supabase-js OK, row id:', row?.id);
    }

    // ── STEP 2: Fire notification email (best-effort, non-blocking on row) ───
    if (GMAIL_APP_PASSWORD) {
      try {
        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,                       // STARTTLS, matches Supabase config
          auth: { user: SUPPORT_EMAIL, pass: GMAIL_APP_PASSWORD },
        });

        await transporter.sendMail({
          from: `"RIFLT Apply Notifier" <${SUPPORT_EMAIL}>`,
          to: SUPPORT_EMAIL,
          replyTo: email.trim(),               // hitting Reply pings the applicant directly
          subject: `New beta application — ${firstName} ${lastName} (${homeWater})`,
          text: [
            `New beta application received:`,
            ``,
            `Name:        ${firstName} ${lastName}`,
            `Email:       ${email}`,
            `Home water:  ${homeWater}`,
            `How heard:   ${sanitizedHowHeard || '(not provided)'}`,
            ``,
            `Application id: ${row.id}`,
            `Submitted:      ${row.created_at}`,
            ``,
            `--`,
            `Review in Supabase SQL Editor:`,
            `  SELECT * FROM beta_applications WHERE id = '${row.id}';`,
            ``,
            `Approve (send promo code) → update status to 'invited':`,
            `  UPDATE beta_applications SET status = 'invited', invited_at = now() WHERE id = '${row.id}';`,
          ].join('\n'),
        });
      } catch (mailErr) {
        // Log but don't fail the request — the row is persisted, founder can
        // sweep the queue from SQL if email infra is degraded.
        console.error('[beta-apply] notification email failed:', mailErr.message);
      }
    } else {
      console.warn('[beta-apply] GMAIL_APP_PASSWORD not set; skipping notification email');
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[beta-apply] unhandled:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
