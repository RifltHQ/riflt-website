export default function Science() {
  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="py-24 px-6 text-center">
        <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-4">How It Works</p>
        <h1 className="text-3xl md:text-5xl font-black mb-6">The Science Behind<br /><span className="text-green">the BiteScore&trade;</span></h1>
        <p className="text-muted text-lg max-w-2xl mx-auto">Four data streams. One number. Updated every time you open the app.</p>
      </section>

      {/* Four Signals */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">These are the signals we read</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { label: 'Thermal Direction', color: '#2E75B6', desc: 'Water temperature relative to the species\u2019 ideal feeding range \u2014 and whether it\u2019s rising or falling. The same temperature in April and October means completely different things to the fish.' },
              { label: 'Barometric Velocity', color: '#1D9E75', desc: 'How fast is pressure changing, and which direction? A dropping barometer triggers aggressive pre-storm feeding. A rapid rise after a front shuts fish down, especially in shallow water.' },
              { label: 'Solunar Proximity', color: '#D4A017', desc: 'Moon phase mapped to feeding intensity. New moon and full moon windows produce peak activity. Quarter moons reduce it. The relationship is predictable and measurable.' },
              { label: 'USGS Streamflow', color: '#3D8FD4', desc: 'Real-time gauge height and water flow for rivers. High muddy water pushes fish to edges. Low clear water concentrates them on structure. Data direct from federal gauges, updated continuously.' },
            ].map((p, i) => (
              <div key={i} className="bg-navy/60 border border-border rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                  <p className="text-xs font-semibold tracking-widest uppercase text-muted">Signal {i + 1}</p>
                </div>
                <h3 className="text-xl font-bold mb-3">{p.label}</h3>
                <p className="text-muted text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it comes together */}
      <section className="py-20 px-6 bg-navy">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">How It Comes Together</h2>
          <p className="text-muted text-lg leading-relaxed mb-6">
            RIFLT&trade; reads all four signals simultaneously and weights them based on the type of water you're fishing. A shallow pond reacts to pressure changes fast. A deep reservoir holds temperature longer. A river's flow rate changes everything.
          </p>
          <p className="text-muted text-lg leading-relaxed">
            The BiteScore&trade; accounts for these differences automatically. You pick the species. RIFLT&trade; does the rest.
          </p>
          <p className="text-muted/60 text-xs mt-8">Patent Pending RIFLT-PPA-001</p>
        </div>
      </section>

      {/* The 66 Degree Example */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">The 66&deg;F Problem</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-navy/60 border border-green/30 rounded-2xl p-8">
              <p className="text-green text-xs font-semibold tracking-widest uppercase mb-3">April &mdash; Rising</p>
              <p className="text-4xl font-black mb-2">66&deg;F</p>
              <p className="text-green font-semibold mb-4">Spawn Phase</p>
              <p className="text-muted text-sm leading-relaxed">
                Water warming through 66&deg;F in spring. Bass are on beds, highly territorial. Sight-fish with Ned rig at 1&ndash;6ft. Peak opportunity.
              </p>
            </div>
            <div className="bg-navy/60 border border-amber/30 rounded-2xl p-8">
              <p className="text-amber text-xs font-semibold tracking-widest uppercase mb-3">October &mdash; Falling</p>
              <p className="text-4xl font-black mb-2">66&deg;F</p>
              <p className="text-amber font-semibold mb-4">Fall Transition</p>
              <p className="text-muted text-sm leading-relaxed">
                Water cooling through 66&deg;F in fall. Bass following shad migration. Reaction baits at 4&ndash;15ft. Completely different pattern.
              </p>
            </div>
          </div>
          <p className="text-center text-muted mt-8 text-sm">Same temperature. Opposite biology. Calendar apps miss this entirely.</p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center">
        <a href="https://riflt-mvp.vercel.app" target="_blank" rel="noopener noreferrer"
          className="inline-block bg-green hover:bg-green/90 text-white text-lg font-bold px-8 py-4 rounded-xl no-underline transition-all">
          See Your BiteScore&trade; &rarr;
        </a>
      </section>
    </div>
  );
}
