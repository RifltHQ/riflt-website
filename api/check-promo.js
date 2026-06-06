/**
 * RIFLT API Route: GET /api/check-promo?code=XXX
 * F4 / PR-S4 — called from /signup page on load to gate-render the form.
 *
 * SECURITY CONTRACT — this endpoint MUST:
 *   1. Return ONLY { valid: boolean }. Never leak:
 *      - the promo's assigned_to (who Peggy gave it to)
 *      - the source attribution tag
 *      - whether the code "doesn't exist" vs "exists but already redeemed"
 *        vs "exists but revoked" — all of those collapse to valid:false.
 *      Any of those would leak intel a malicious actor could mine
 *      (enumerate codes, map sources, identify who's been invited).
 *   2. Service-role only — the promo_codes table is RLS-locked with zero
 *      client policies. This route bypasses RLS via supabaseAdmin.
 *   3. Read-only — never redeems, never mutates. Redemption is atomic
 *      inside /api/signup-finalize (S2) on the riflt-mvp side, triggered
 *      only after the user authenticates via the magic link.
 *   4. Idempotent — multiple calls with the same code return the same answer
 *      until the code state changes.
 */

import { supabaseAdmin } from './_supabase-admin.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const code = typeof req.query?.code === 'string' ? req.query.code.trim() : '';

  // Empty / missing code — collapse to invalid without even hitting the DB.
  // This is the same response as a non-existent code, so no enumeration
  // signal differentiates the two cases.
  if (!code) {
    return res.status(200).json({ valid: false });
  }

  // Promo codes are short alphanumeric tokens with hyphens (e.g. BETA-MIKE-001).
  // Reject anything wildly out of shape early — same response, just cheaper.
  if (code.length > 64 || !/^[A-Za-z0-9_\-]+$/.test(code)) {
    return res.status(200).json({ valid: false });
  }

  try {
    // Check: exists AND status='active'. We do NOT select assigned_to or source.
    // Anything other than "exists + active" collapses to valid:false.
    const { data, error } = await supabaseAdmin
      .from('promo_codes')
      .select('code')
      .eq('code', code)
      .eq('status', 'active')
      .limit(1);

    if (error) {
      // Don't leak DB error details to the client. Log internally for ops debug.
      console.error('[check-promo] supabase query error:', error.message);
      return res.status(200).json({ valid: false });
    }

    const valid = Array.isArray(data) && data.length === 1;
    return res.status(200).json({ valid });
  } catch (err) {
    console.error('[check-promo] unhandled:', err);
    // Even on unhandled errors, collapse to invalid. Never leak shape.
    return res.status(200).json({ valid: false });
  }
}
