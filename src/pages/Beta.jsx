import { useState } from 'react';
import { HOME_WATERS } from '../data/home-waters';

// F4 / PR-S4: Beta apply form refactor.
//   - Name split into firstName + lastName (was single "Name" field)
//   - Email field added (required)
//   - Home water list moved to shared src/data/home-waters.js so /signup +
//     /beta share the same options (single source of truth)
//   - Submit now POSTs to /api/beta-apply (persists to beta_applications +
//     fires notification email to support@riflt.com). Was console.log only.
//
// All marketing copy ABOVE the form is unchanged from the existing Beta
// page (founder-approved). Only the form structure + submission flow are
// modified.

export default function Beta() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [homeWater, setHomeWater] = useState('');
  const [howHeard, setHowHeard] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setErrorMessage('');
    try {
      const res = await fetch('/api/beta-apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim().toLowerCase(),
          homeWater,
          howHeard: howHeard.trim() || null,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrorMessage(body?.error || 'Something went wrong. Try again in a moment.');
        setSubmitting(false);
        return;
      }
      setSubmitted(true);
    } catch (err) {
      console.error('[beta apply] threw:', err);
      setErrorMessage('Network error. Try again in a moment.');
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="py-24 px-6 text-center">
        <div className="inline-block bg-green/10 border border-green/30 rounded-full px-4 py-1 mb-6">
          <p className="text-green text-xs font-semibold tracking-widest uppercase">Limited Beta</p>
        </div>
        <h1 className="text-4xl md:text-6xl font-black mb-6">
          Join the 15.<br />
          <span className="text-green">Help Us Calibrate.</span>
        </h1>
        <p className="text-muted/80 text-sm italic max-w-2xl mx-auto mb-4">
          Works in your browser — no download needed. Uses your location to find nearby waters.
        </p>
        <p className="text-muted text-lg max-w-2xl mx-auto">
          This is not a public launch. This is a laboratory. We need 15 serious anglers on Tennessee water bodies to validate the BiteScore™ engine.
        </p>
      </section>

      {/* Two columns */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
          {/* What you get */}
          <div>
            <h2 className="text-2xl font-bold mb-6">What You Get</h2>
            <div className="space-y-4">
              {[
                { icon: '👑', label: 'Founding Member Pro+', desc: 'Free for life. No payment ever.' },
                { icon: '📍', label: 'TWRA Attractor Layer', desc: 'First access to structured access data for every TN water body.' },
                { icon: '🔒', label: 'Spot-Lock™ from Day One', desc: 'GPS privacy architecture active from your first session.' },
                { icon: '📞', label: 'Direct Line to Founder', desc: 'Text, email, or voice. You talk to the person who built it.' },
              ].map((p, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <p className="text-2xl">{p.icon}</p>
                  <div>
                    <p className="font-semibold">{p.label}</p>
                    <p className="text-muted text-sm">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What we need */}
          <div>
            <h2 className="text-2xl font-bold mb-6">What We Need</h2>
            <div className="space-y-4">
              {[
                { icon: '🌊', label: 'Anglers on TN Water', desc: 'Percy Priest, Old Hickory, Center Hill, Harpeth, Caney Fork.' },
                { icon: '✅', label: 'Honest Score Feedback', desc: 'Did the BiteScore™ match reality? Spot On, Close, or Off.' },
                { icon: '📱', label: '3-Tap Catch Logging', desc: 'Species, score match, submit. Under 10 seconds per catch.' },
              ].map((p, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <p className="text-2xl">{p.icon}</p>
                  <div>
                    <p className="font-semibold">{p.label}</p>
                    <p className="text-muted text-sm">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Application form */}
      <section className="py-20 px-6 bg-navy">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-center mb-2">Apply for Beta Access</h2>
          <p className="text-muted text-sm text-center mb-8">The BiteScore™ engine is live. Some features are still being built. Your job is to tell us if the score feels right on the water.</p>

          {submitted ? (
            /* [REVIEW] — application-received copy; "48 hours" is Peggy's window */
            <div className="bg-green/10 border border-green/30 rounded-xl p-8 text-center">
              <p className="text-4xl mb-4">🎣</p>
              <p className="text-green text-xl font-bold mb-2">Application received.</p>
              <p className="text-muted text-sm">We&apos;ll be in touch within 48 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name — split per PR-S4 brief: first + last */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted mb-1">First Name</label>
                  <input
                    type="text" required value={firstName} onChange={e => setFirstName(e.target.value)}
                    disabled={submitting} autoComplete="given-name"
                    className="w-full bg-navy-dark border border-border rounded-lg px-4 py-3 text-white focus:border-accent focus:outline-none disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted mb-1">Last Name</label>
                  <input
                    type="text" required value={lastName} onChange={e => setLastName(e.target.value)}
                    disabled={submitting} autoComplete="family-name"
                    className="w-full bg-navy-dark border border-border rounded-lg px-4 py-3 text-white focus:border-accent focus:outline-none disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Email — required (PR-S4 addition) */}
              <div>
                <label className="block text-sm text-muted mb-1">Email</label>
                <input
                  type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  disabled={submitting} autoComplete="email" autoCapitalize="none"
                  className="w-full bg-navy-dark border border-border rounded-lg px-4 py-3 text-white focus:border-accent focus:outline-none disabled:opacity-60"
                />
              </div>

              {/* Home water — shared HOME_WATERS list with /signup */}
              <div>
                <label className="block text-sm text-muted mb-1">Home Water</label>
                <select
                  required value={homeWater} onChange={e => setHomeWater(e.target.value)}
                  disabled={submitting}
                  className="w-full bg-navy-dark border border-border rounded-lg px-4 py-3 text-white focus:border-accent focus:outline-none appearance-none disabled:opacity-60">
                  <option value="">Select your primary water body</option>
                  {HOME_WATERS.map(w => <option key={w.key} value={w.key}>{w.label}</option>)}
                </select>
              </div>

              {/* How heard — kept as required per PR-S4 brief */}
              <div>
                <label className="block text-sm text-muted mb-1">How did you hear about RIFLT&trade;?</label>
                <input
                  type="text" required value={howHeard} onChange={e => setHowHeard(e.target.value)}
                  disabled={submitting}
                  className="w-full bg-navy-dark border border-border rounded-lg px-4 py-3 text-white focus:border-accent focus:outline-none disabled:opacity-60"
                />
              </div>

              {errorMessage ? (
                <p className="text-red-400 text-sm">{errorMessage}</p>
              ) : null}

              <button
                type="submit" disabled={submitting}
                className="w-full bg-green hover:bg-green/90 disabled:opacity-60 text-white font-bold py-4 rounded-xl text-lg transition-colors cursor-pointer border-none">
                {submitting ? 'Submitting…' : 'Apply for Beta Access'}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
