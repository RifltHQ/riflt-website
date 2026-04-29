import { Link } from 'react-router-dom';

function ScoreGauge({ score, label, status, color }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-20 h-20 rounded-full flex flex-col items-center justify-center text-white" style={{ backgroundColor: color }}>
        <span className="text-2xl font-black leading-none">{score}</span>
        <span className="text-[9px] font-semibold tracking-wide mt-0.5 px-1 text-center leading-tight">{status}</span>
      </div>
      <p className="text-muted text-xs mt-2">{label}</p>
    </div>
  );
}

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-4">Fishing Intelligence Platform</p>
        <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6 tracking-tight">
          Stop Guessing.<br />
          <span className="text-green">Start Catching.</span>
        </h1>
        <p className="text-muted text-lg md:text-xl max-w-2xl mb-4 leading-relaxed">
          The first fishing intelligence platform built on thermal physics, not calendar guesses.
        </p>
        <p className="text-muted/80 text-base max-w-xl mb-8 leading-relaxed italic">
          That feeling when the line drops and goes tight &mdash; you should feel it more often. RIFLT&trade; tells you when the conditions are right before you make the drive.
        </p>

        {/* Illustrative score preview */}
        <div className="flex gap-6 mb-4">
          <ScoreGauge score={72} label="Percy Priest" status="Bite is Fair" color="#BA7517" />
          <ScoreGauge score={58} label="Harpeth River" status="Bite is Slow" color="#E24B4A" />
          <ScoreGauge score={84} label="Center Hill" status="ON" color="#1D9E75" />
        </div>
        <p className="text-muted/60 text-xs mb-10">Example scores &mdash; open the app for your live BiteScore&trade;</p>

        <a href="https://riflt-mvp.vercel.app" target="_blank" rel="noopener noreferrer"
          className="bg-green hover:bg-green/90 text-white text-lg font-bold px-8 py-4 rounded-xl no-underline transition-all shadow-lg shadow-green/20">
          Get Your BiteScore™ &rarr;
        </a>
      </section>

      {/* Three Pillars */}
      <section className="py-24 px-6 bg-navy">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-16">Three layers. One decision.</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '🌡️', title: 'Phase Intelligence', desc: 'Direction-aware thermal classifier. Same temperature, opposite biological states. We know the difference.' },
              { icon: '🔒', title: 'Private Vault', desc: 'GPS blurred to 1–2 mile radius. Your spots never leave your device. Spot-Lock™ is not optional.' },
              { icon: '📍', title: 'Local Edge', desc: 'USGS streamflow, TWRA access data, and 19 calibrated Tennessee water bodies. Built for where you actually fish.' },
            ].map((p, i) => (
              <div key={i} className="bg-navy-light/50 border border-border rounded-2xl p-8 text-center">
                <p className="text-4xl mb-4">{p.icon}</p>
                <h3 className="text-xl font-bold mb-3">{p.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-16">What You Get</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-navy-dark border border-border rounded-2xl p-8">
              <p className="text-3xl mb-4">📅</p>
              <h3 className="text-lg font-bold mb-3">Best Days This Week</h3>
              <p className="text-muted text-sm leading-relaxed">A 5-day planning strip. Favorable, Mixed, or Tough. Know which mornings are worth blocking on your calendar.</p>
            </div>
            <div className="bg-navy-dark border border-border rounded-2xl p-8">
              <p className="text-3xl mb-4">🎣</p>
              <h3 className="text-lg font-bold mb-3">Top 3 Baits by Structure</h3>
              <p className="text-muted text-sm leading-relaxed">Wood, Rock, Weeds, Open Water. The right lure for the right cover, driven by the algorithm.</p>
            </div>
            <div className="bg-navy-dark border border-border rounded-2xl p-8">
              <p className="text-3xl mb-4">📱</p>
              <h3 className="text-lg font-bold mb-3">Catch Log</h3>
              <p className="text-muted text-sm leading-relaxed">3 taps, under 10 seconds. Log your catch and help calibrate the algorithm for your home water.</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-24 px-6 bg-navy">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-4">The Problem</p>
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Every fishing app uses a calendar.<br />Fish don't read calendars.</h2>
          <p className="text-muted text-lg leading-relaxed mb-8">
            Traditional fishing apps tell you it's &ldquo;Post-Spawn&rdquo; because it's May. But the water hasn't caught up with the air yet. The fish are still staging in 4&ndash;12 feet on transitions. The calendar says one thing. The thermometer says another. RIFLT&trade; reads the thermometer.
          </p>
          <div className="bg-navy-light/30 border border-border rounded-xl p-6 inline-block">
            <p className="text-amber font-mono text-sm">Calendar App: "Post-Spawn &mdash; fish shallow flats"</p>
            <p className="text-green font-mono text-sm mt-2">RIFLT&trade;: "Pre-Spawn &mdash; 62&deg;F water, fish staging on transitions at 4&ndash;12ft"</p>
          </div>
        </div>
      </section>

      {/* Proof: Percy Priest */}
      <section className="py-24 px-6 bg-navy">
        <div className="max-w-4xl mx-auto">
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-4 text-center">Field Validation</p>
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">April 12, 2026. Percy Priest Reservoir.</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="bg-navy-dark border border-border rounded-xl p-6 space-y-4">
                <div className="flex justify-between text-sm"><span className="text-muted">Water temp</span><span className="font-mono">66&deg;F</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted">Air temp</span><span className="font-mono">78&deg;F</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted">Pressure</span><span className="font-mono">30.24 inHg (stable)</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted">Bank anglers</span><span className="font-mono">30+</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted">Catch rate</span><span className="font-mono text-red">Near zero</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted">RIFLT&trade; prediction</span><span className="font-mono text-green">Bite is Slow</span></div>
              </div>
            </div>
            <div className="text-center md:text-left">
              <p className="text-muted text-lg leading-relaxed">
                30 anglers. Beautiful morning. Near-zero catch rate. The algorithm called it: <strong className="text-white">Bite is Slow</strong>. Not because of a calendar &mdash; because the thermal trend and barometric velocity said so.
              </p>
              <p className="text-muted/60 text-sm mt-6">That wasn't luck. That's what happens when the physics are correct.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Ready to fish smarter?</h2>
        <Link to="/beta" className="inline-block bg-green hover:bg-green/90 text-white text-lg font-bold px-8 py-4 rounded-xl no-underline transition-all">
          Join the Beta &rarr;
        </Link>
      </section>
    </div>
  );
}
