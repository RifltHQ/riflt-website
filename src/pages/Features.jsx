const FEATURES = [
  {
    icon: '📊',
    title: 'BiteScore Gauge',
    desc: '0–100 score generated instantly on app open. Combines barometric velocity, thermal trend, and lunar phase — weighted by water body type. No input required beyond species selection.',
  },
  {
    icon: '🎣',
    title: 'Top 3 Baits by Structure',
    desc: 'Tap Wood, Rock, Dock, or Bank and get three lure recommendations matched to your phase and cover type. Updates instantly — no refetch needed.',
  },
  {
    icon: '📅',
    title: 'Best Days This Week',
    desc: 'Five-day qualitative planning strip. Favorable, Mixed, or Tough — never a numeric score for future dates. Check the live score day-of for the real number.',
  },
  {
    icon: '🔒',
    title: 'Spot-Lock Privacy',
    desc: 'GPS blurred to 1–2 mile radius before any data leaves your device. Your exact coordinates are never stored in any public table or shared card. Your spots stay yours.',
  },
  {
    icon: '📍',
    title: 'TWRA Access Layer',
    desc: 'Bank access, boat ramps, parking locations, and managing agency data for every state-managed water body. Sourced from TWRA, TVA, and USACE.',
  },
  {
    icon: '📱',
    title: '3-Tap Catch Log',
    desc: 'Species → Score Match → Submit. Under 10 seconds. Logs conditions, phase, pressure, and water temp alongside your catch for algorithm calibration.',
  },
];

export default function Features() {
  return (
    <div className="pt-24">
      <section className="py-24 px-6 text-center">
        <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-4">Features</p>
        <h1 className="text-4xl md:text-6xl font-black mb-6">Built for the Water,<br /><span className="text-green">Not the Feed</span></h1>
        <p className="text-muted text-lg max-w-2xl mx-auto">Every feature exists because it makes you catch more fish. Nothing exists because it drives engagement.</p>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {FEATURES.map((f, i) => (
            <div key={i} className="bg-navy/60 border border-border rounded-2xl p-8 hover:border-accent/40 transition-colors">
              <p className="text-4xl mb-4">{f.icon}</p>
              <h3 className="text-xl font-bold mb-3">{f.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Score Card Preview */}
      <section className="py-20 px-6 bg-navy">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">What You See on App Open</h2>
          <div className="bg-navy-dark border border-border rounded-xl overflow-hidden">
            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-bold text-lg">Percy Priest Reservoir</p>
                  <p className="text-muted text-xs">11.3mi &middot; reservoir</p>
                </div>
                <div className="bg-[#BA7517] rounded-lg px-3 py-2 text-center min-w-[56px]">
                  <p className="text-2xl font-black">69</p>
                  <p className="text-[10px] text-white/80">Bite is Fair</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-accent/20 text-accent text-xs font-semibold px-2 py-0.5 rounded">Spawn</span>
                <span className="text-muted text-xs">🌤️ Afternoon &middot; MEDIUM</span>
              </div>
              <p className="text-muted text-xs mb-3">Depth 1–6ft &middot; Sight fishing, finesse, Ned rig</p>
              <div className="flex gap-1.5 mb-3">
                {['Bank', 'Wood', 'Rock', 'Weeds', 'Open', 'Points', 'Dock'].map((s, i) => (
                  <span key={s} className={`text-[10px] px-2 py-1 rounded-full border ${i === 0 ? 'border-green text-green' : 'border-border text-muted/60'}`}>{s}</span>
                ))}
              </div>
              <div className="bg-navy-light/50 rounded-lg p-3">
                <p className="text-sm font-semibold">🎣 Wacky-rig Senko</p>
                <p className="text-muted text-xs italic">Sight fish to beds, cast past and drag slowly</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 text-center">
        <a href="https://riflt-mvp.vercel.app" target="_blank" rel="noopener noreferrer"
          className="inline-block bg-green hover:bg-green/90 text-white text-lg font-bold px-8 py-4 rounded-xl no-underline transition-all">
          Try It Now &rarr;
        </a>
      </section>
    </div>
  );
}
