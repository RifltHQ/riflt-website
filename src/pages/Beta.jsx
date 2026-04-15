import { useState } from 'react';

const WATERS = ['Percy Priest', 'Old Hickory', 'Center Hill', 'Harpeth River', 'Caney Fork', 'Cumberland River', 'Stones River', 'Other'];

export default function Beta() {
  const [name, setName] = useState('');
  const [homeWater, setHomeWater] = useState('');
  const [source, setSource] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In production: POST to Supabase or API
    console.log('Beta application:', { name, homeWater, source });
    setSubmitted(true);
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
        <p className="text-muted text-lg max-w-2xl mx-auto">
          This is not a public launch. This is a laboratory. We need 15 serious anglers on Tennessee water bodies to validate the BiteScore engine.
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
                { icon: '🔒', label: 'Spot-Lock from Day One', desc: 'GPS privacy architecture active from your first session.' },
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
                { icon: '✅', label: 'Honest Score Feedback', desc: 'Did the BiteScore match reality? Spot On, Close, or Off.' },
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
          <p className="text-muted text-sm text-center mb-8">The BiteScore engine is live. Some features are still being built. Your job is to tell us if the score feels right on the water.</p>

          {submitted ? (
            <div className="bg-green/10 border border-green/30 rounded-xl p-8 text-center">
              <p className="text-4xl mb-4">🎣</p>
              <p className="text-green text-xl font-bold mb-2">Application received.</p>
              <p className="text-muted text-sm">We'll be in touch within 48 hours.</p>
              <a href="https://riflt-mvp.vercel.app" target="_blank" rel="noopener noreferrer"
                className="inline-block mt-6 bg-green text-white font-semibold px-6 py-3 rounded-lg no-underline">
                Try the App Now &rarr;
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-muted mb-1">Name</label>
                <input type="text" required value={name} onChange={e => setName(e.target.value)}
                  className="w-full bg-navy-dark border border-border rounded-lg px-4 py-3 text-white focus:border-accent focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm text-muted mb-1">Home Water</label>
                <select required value={homeWater} onChange={e => setHomeWater(e.target.value)}
                  className="w-full bg-navy-dark border border-border rounded-lg px-4 py-3 text-white focus:border-accent focus:outline-none appearance-none">
                  <option value="">Select your primary water body</option>
                  {WATERS.map(w => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-muted mb-1">How did you hear about RIFLT?</label>
                <input type="text" value={source} onChange={e => setSource(e.target.value)}
                  className="w-full bg-navy-dark border border-border rounded-lg px-4 py-3 text-white focus:border-accent focus:outline-none" />
              </div>
              <button type="submit"
                className="w-full bg-green hover:bg-green/90 text-white font-bold py-4 rounded-xl text-lg transition-colors cursor-pointer border-none">
                Apply for Beta Access
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
