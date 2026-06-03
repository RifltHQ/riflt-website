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
import { supabaseAdmin } from './_supabase-admin.js';

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
    const { data: row, error: insertErr } = await supabaseAdmin
      .from('beta_applications')
      .insert({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim().toLowerCase(),
        home_water: homeWater.trim(),
        how_heard: sanitizedHowHeard,
      })
      .select('id, created_at')
      .single();

    if (insertErr) {
      console.error('[beta-apply] insert failed:', insertErr.message);
      return res.status(500).json({ error: 'Apply failed' });
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
