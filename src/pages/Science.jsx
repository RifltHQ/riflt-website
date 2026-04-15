export default function Science() {
  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="py-24 px-6 text-center">
        <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-4">How It Works</p>
        <h1 className="text-4xl md:text-6xl font-black mb-6">The Science Behind<br /><span className="text-green">the BiteScore</span></h1>
        <p className="text-muted text-lg max-w-2xl mx-auto">Four data streams. One number. Updated every time you open the app.</p>
      </section>

      {/* Four Pillars */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {[
            { label: 'Thermal Trend', value: 'T_score', color: '#2E75B6', desc: 'Water temperature vs species ideal. Not just the number — the direction. Rising 62°F and falling 62°F produce completely different fish behavior.' },
            { label: 'Barometric Velocity', value: 'P_score', color: '#1D9E75', desc: 'Rate and direction of pressure change over 3 hours. A 0.03 inHg drop triggers pre-storm feeding. A rapid rise shuts fish down in shallow water.' },
            { label: 'Solunar Proximity', value: 'L_score', color: '#D4A017', desc: 'Lunar phase mapped to feeding intensity. New moon and full moon peaks. Quarter moons = reduced activity. Cosine curve, not a calendar lookup.' },
            { label: 'USGS Streamflow', value: 'Flow', color: '#3D8FD4', desc: 'Real-time gauge height and discharge for rivers. Flood stage = −10 score. Low clear water = +3. Data direct from USGS, updated every 15 minutes.' },
          ].map((p, i) => (
            <div key={i} className="bg-navy/60 border border-border rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                <p className="text-xs font-semibold tracking-widest uppercase text-muted">{p.value}</p>
              </div>
              <h3 className="text-xl font-bold mb-3">{p.label}</h3>
              <p className="text-muted text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The Formula */}
      <section className="py-20 px-6 bg-navy">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">The Core Formula</h2>
          <div className="bg-navy-dark border border-border rounded-xl p-8 inline-block">
            <p className="font-mono text-xl md:text-2xl text-white">
              BS = (<span className="text-accent">Cw</span> &times; P) + (<span className="text-accent">Tw</span> &times; T) + (<span className="text-accent">Lw</span> &times; L)
            </p>
          </div>
          <p className="text-muted text-sm mt-6 max-w-xl mx-auto">
            Cw, Tw, and Lw are the Variable Water-Body Coefficients &mdash; the patent. A pond (Cw 0.75) weights pressure heavily because shallow water reacts fast. A reservoir (Cw 0.38) weights temperature more because thermal mass dominates.
          </p>
          <p className="text-muted/60 text-xs mt-4">Patent Pending RIFLT-PPA-001</p>
        </div>
      </section>

      {/* The 66 Degree Example */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">The 66&deg;F Problem</h2>
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

      {/* Score Breakdown Visual */}
      <section className="py-20 px-6 bg-navy">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Sample Score Breakdown</h2>
          <div className="bg-navy-dark border border-border rounded-xl p-6 space-y-3">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#BA7517]">
                <span className="text-3xl font-black">69</span>
              </div>
              <p className="text-sm text-[#BA7517] font-semibold mt-2">Bite is Fair</p>
            </div>
            {[
              { label: 'Pressure (P)', score: 65, weight: 'Cw 0.38', contrib: '24.7', color: '#2E75B6' },
              { label: 'Temperature (T)', score: 82, weight: 'Tw 0.52', contrib: '42.6', color: '#1D9E75' },
              { label: 'Lunar (L)', score: 16, weight: 'Lw 0.10', contrib: '1.6', color: '#D4A017' },
            ].map((r, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-muted w-32">{r.label}</span>
                <span className="font-mono font-bold w-8 text-right">{r.score}</span>
                <span className="text-muted/60 text-xs w-16 text-center">&times; {r.weight}</span>
                <span className="text-muted w-12 text-right">= {r.contrib}</span>
              </div>
            ))}
            <div className="border-t border-border pt-3 mt-3">
              <p className="text-muted/60 text-xs">Percy Priest Reservoir &middot; Spawn &middot; Seasonal Estimate &minus;12&deg;F</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
