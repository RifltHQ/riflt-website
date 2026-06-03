/**
 * Supabase Admin Client — SERVICE ROLE (server-side only, riflt-website)
 *
 * Sibling to riflt-mvp's src/services/supabaseAdmin.js but lives in the
 * website project so /api/check-promo, /api/signup-start, and /api/beta-apply
 * can access promo_codes + beta_applications via service-role bypass.
 *
 * The leading underscore in the filename (`_supabase-admin.js`) tells Vercel
 * to treat this as a helper module, NOT a route. Vercel auto-deploys
 * `api/*.js` files (without underscore prefix) as serverless functions.
 *
 * NEVER import this from client-side code (it ships the service-role key).
 * NEVER add this file to a Vite import chain that ends up in the bundle.
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  // Cold-start diagnostic — surfaces in Vercel function logs if env is misconfigured.
  console.error('[supabaseAdmin] missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars');
}

export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Re-export the URL for routes that need to construct REST endpoints directly
// (e.g., signup-start calling /auth/v1/otp).
export { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY };
