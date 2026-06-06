/**
 * Signup — F4 / PR-S4 promo-gated signup page at riflt.com/signup.
 *
 * Only reachable via riflt.com/#/signup?promo=BETA-XXX-001 (invitation
 * links Peggy sends). Never linked from nav. Indexed: NO (noindex meta
 * set on mount + removed on unmount).
 *
 * FLOW
 *   1. On mount, read ?promo=XXX from URL → fetch /api/check-promo
 *      a. valid:true   → render form
 *      b. valid:false  → render invite-only message (links to /beta)
 *      c. no promo at all → invite-only message (same)
 *      d. network error → invite-only message + retry path
 *   2. User fills form (first name, last name, email, home water,
 *      email consent, SMS consent), submits.
 *   3. Form POSTs to /api/signup-start → server re-verifies promo +
 *      fires /auth/v1/otp with create_user:true + signup data in
 *      user_metadata. Returns 200 / 403.
 *   4. On success: "check your email" interstitial with resend control
 *      and clear next-step guidance.
 *
 * SECURITY INVARIANT (Captain-locked):
 *   The submit handler MUST call /api/signup-start (which re-verifies
 *   the promo). Do NOT call /auth/v1/otp directly from the client here
 *   — the closed-beta gate depends on server-side promo verification
 *   before create_user:true ever fires.
 *
 * COPY: all [REVIEW] markers below need Peggy/Brian approval before merge.
 */

import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { HOME_WATERS } from '../data/home-waters';

// [REVIEW] — all user-facing strings
const COPY = {
  // Form headline
  headline: 'You\'re in. Almost.',
  subhead: 'Beta is invite-only. Your code unlocks a founding-member account.',

  // Pre-submit explainer (sets expectation about magic-link)
  emailHint: 'We\'ll email you a one-tap sign-in link.',

  // Field labels
  promoCodeLabel: 'Your invite code',
  firstNameLabel: 'First name',
  lastNameLabel: 'Last name',
  emailLabel: 'Email',
  homeWaterLabel: 'Home water',
  homeWaterPlaceholder: 'Pick the water you fish most',
  emailConsentLabel: 'Email me beta updates and tips (optional)',
  smsConsentLabel: 'Text me beta updates (optional)',

  submitButton: 'Send my sign-in link',
  submitButtonSending: 'Sending…',

  // "Check your email" interstitial
  sentHeadline: 'Check your email',
  sentBodyTemplate: (email) => `We sent a one-tap sign-in link to ${email}. Tap the link to enter RIFLT.`,
  sentHint: 'If you don\'t see it within a minute, check your spam folder.',
  resendButton: 'Resend link',
  resendButtonSending: 'Resending…',
  resendCooldownTemplate: (sec) => `Resend in ${sec}s`,

  // Invite-only path (no valid promo)
  inviteOnlyHeadline: 'RIFLT beta is invite-only.',
  inviteOnlyBody: 'Invited and having trouble? Email support@riflt.com — we\'ll get you in.',
  inviteOnlyApplyPrefix: 'Want to join? ',
  inviteOnlyApplyLinkText: 'Apply here →',
  inviteOnlySupportHref: 'mailto:support@riflt.com',

  // Generic errors
  genericError: 'Something went wrong. Try again in a moment.',
};

const RESEND_COOLDOWN_SECONDS = 60;

export default function Signup() {
  const [searchParams] = useSearchParams();
  const promoFromUrl = (searchParams.get('promo') || '').trim();

  const [promoState, setPromoState] = useState('checking'); // checking | valid | invalid
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [homeWater, setHomeWater] = useState('');
  const [emailConsent, setEmailConsent] = useState(false);
  const [smsConsent, setSmsConsent] = useState(false);
  const [step, setStep] = useState('idle'); // idle | submitting | sent | error
  const [errorMessage, setErrorMessage] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // ── 1. Set noindex meta on this page (per spec: never indexed) ──────────
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => { document.head.removeChild(meta); };
  }, []);

  // ── 2. On mount, check the promo code ───────────────────────────────────
  useEffect(() => {
    if (!promoFromUrl) {
      setPromoState('invalid');
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/check-promo?code=${encodeURIComponent(promoFromUrl)}`);
        const body = await res.json().catch(() => ({}));
        if (cancelled) return;
        setPromoState(body?.valid === true ? 'valid' : 'invalid');
      } catch {
        if (!cancelled) setPromoState('invalid');
      }
    })();
    return () => { cancelled = true; };
  }, [promoFromUrl]);

  const startCooldown = () => {
    setResendCooldown(RESEND_COOLDOWN_SECONDS);
    const tick = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) { clearInterval(tick); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    if (step === 'submitting') return;

    const trimmedEmail = email.trim().toLowerCase();
    if (!firstName.trim() || !lastName.trim() || !trimmedEmail.includes('@') || !homeWater) {
      setErrorMessage('Please fill in every required field.');
      setStep('error');
      return;
    }

    setStep('submitting');
    setErrorMessage('');

    try {
      const res = await fetch('/api/signup-start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: trimmedEmail,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          homeWater,
          promoCode: promoFromUrl,
          emailConsent,
          smsConsent,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        // 403 = promo invalid (race: another user redeemed between page-load
        // check-promo and submit). Surface as "invite-only" — same generic
        // message we'd show for no-promo or invalid-promo on page load.
        if (res.status === 403) {
          setPromoState('invalid');
          return;
        }
        setErrorMessage(body?.error || COPY.genericError);
        setStep('error');
        return;
      }
      setStep('sent');
      startCooldown();
    } catch (err) {
      console.error('[signup] threw:', err);
      setErrorMessage(COPY.genericError);
      setStep('error');
    }
  };

  const handleResend = () => {
    if (resendCooldown > 0 || step === 'submitting') return;
    handleSubmit();
  };

  // ── Render: checking promo on first load ─────────────────────────────────
  if (promoState === 'checking') {
    return (
      <div className="pt-24 min-h-screen">
        <section className="py-20 px-6">
          <div className="max-w-md mx-auto text-center">
            <p className="text-muted text-sm">Loading…</p>
          </div>
        </section>
      </div>
    );
  }

  // ── Render: invite-only (no promo OR invalid promo) ──────────────────────
  if (promoState === 'invalid') {
    return (
      <div className="pt-24 min-h-screen">
        <section className="py-20 px-6">
          <div className="max-w-md mx-auto text-center">
            <div className="inline-block bg-green/10 border border-green/30 rounded-full px-4 py-1 mb-6">
              <p className="text-green text-xs font-semibold tracking-widest uppercase">Closed Beta</p>
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-4">{COPY.inviteOnlyHeadline}</h1>
            <p className="text-muted text-base mb-3">{COPY.inviteOnlyBody}</p>
            <p className="text-muted text-base">
              {COPY.inviteOnlyApplyPrefix}
              <Link to="/beta" className="text-green underline">
                {COPY.inviteOnlyApplyLinkText}
              </Link>
            </p>
          </div>
        </section>
      </div>
    );
  }

  // ── Render: "check your email" interstitial ──────────────────────────────
  if (step === 'sent') {
    return (
      <div className="pt-24 min-h-screen">
        <section className="py-20 px-6">
          <div className="max-w-md mx-auto">
            <div className="bg-green/10 border border-green/30 rounded-xl p-8 text-center">
              <p className="text-4xl mb-4">📬</p>
              <h2 className="text-green text-2xl font-bold mb-2">{COPY.sentHeadline}</h2>
              <p className="text-muted text-base mb-2">{COPY.sentBodyTemplate(email.trim().toLowerCase())}</p>
              <p className="text-muted text-sm mb-6">{COPY.sentHint}</p>
              <button
                onClick={handleResend}
                disabled={resendCooldown > 0 || step === 'submitting'}
                className="w-full bg-green hover:bg-green/90 disabled:opacity-60 text-white font-bold py-3 rounded-lg transition-colors cursor-pointer border-none">
                {resendCooldown > 0
                  ? COPY.resendCooldownTemplate(resendCooldown)
                  : step === 'submitting'
                    ? COPY.resendButtonSending
                    : COPY.resendButton}
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ── Render: signup form (promoState === 'valid') ─────────────────────────
  const isSubmitting = step === 'submitting';
  return (
    <div className="pt-24 min-h-screen">
      <section className="py-16 px-6">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="inline-block bg-green/10 border border-green/30 rounded-full px-4 py-1 mb-6">
              <p className="text-green text-xs font-semibold tracking-widest uppercase">Founding Member</p>
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-3">{COPY.headline}</h1>
            <p className="text-muted text-base">{COPY.subhead}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Promo code — non-editable display per brief */}
            <div>
              <label className="block text-sm text-muted mb-1">{COPY.promoCodeLabel}</label>
              <div className="bg-navy-dark border border-border rounded-lg px-4 py-3 text-green font-mono text-sm">
                {promoFromUrl}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-muted mb-1">{COPY.firstNameLabel}</label>
                <input
                  type="text" required value={firstName} onChange={e => setFirstName(e.target.value)}
                  disabled={isSubmitting} autoComplete="given-name"
                  className="w-full bg-navy-dark border border-border rounded-lg px-4 py-3 text-white focus:border-accent focus:outline-none disabled:opacity-60"
                />
              </div>
              <div>
                <label className="block text-sm text-muted mb-1">{COPY.lastNameLabel}</label>
                <input
                  type="text" required value={lastName} onChange={e => setLastName(e.target.value)}
                  disabled={isSubmitting} autoComplete="family-name"
                  className="w-full bg-navy-dark border border-border rounded-lg px-4 py-3 text-white focus:border-accent focus:outline-none disabled:opacity-60"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-muted mb-1">{COPY.emailLabel}</label>
              <input
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                disabled={isSubmitting} autoComplete="email" autoCapitalize="none"
                className="w-full bg-navy-dark border border-border rounded-lg px-4 py-3 text-white focus:border-accent focus:outline-none disabled:opacity-60"
              />
              <p className="text-muted/70 text-xs mt-1">{COPY.emailHint}</p>
            </div>

            <div>
              <label className="block text-sm text-muted mb-1">{COPY.homeWaterLabel}</label>
              <select
                required value={homeWater} onChange={e => setHomeWater(e.target.value)}
                disabled={isSubmitting}
                className="w-full bg-navy-dark border border-border rounded-lg px-4 py-3 text-white focus:border-accent focus:outline-none appearance-none disabled:opacity-60">
                <option value="">{COPY.homeWaterPlaceholder}</option>
                {HOME_WATERS.map(w => (
                  <option key={w.key} value={w.key}>{w.label}</option>
                ))}
              </select>
            </div>

            <label className="flex items-start gap-3 cursor-pointer pt-2">
              <input
                type="checkbox" checked={emailConsent} onChange={e => setEmailConsent(e.target.checked)}
                disabled={isSubmitting}
                className="mt-1 cursor-pointer disabled:opacity-60"
              />
              <span className="text-sm text-muted">{COPY.emailConsentLabel}</span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox" checked={smsConsent} onChange={e => setSmsConsent(e.target.checked)}
                disabled={isSubmitting}
                className="mt-1 cursor-pointer disabled:opacity-60"
              />
              <span className="text-sm text-muted">{COPY.smsConsentLabel}</span>
            </label>

            {step === 'error' && errorMessage ? (
              <p className="text-red-400 text-sm">{errorMessage}</p>
            ) : null}

            <button
              type="submit" disabled={isSubmitting}
              className="w-full bg-green hover:bg-green/90 disabled:opacity-60 text-white font-bold py-4 rounded-xl text-lg transition-colors cursor-pointer border-none">
              {isSubmitting ? COPY.submitButtonSending : COPY.submitButton}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

// Exported for gate / dev introspection — never imported into bundle from client surface
export { COPY as SIGNUP_COPY };
