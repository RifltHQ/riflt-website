export default function About() {
  return (
    <div className="pt-24">
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-4 text-center">About</p>
          <h1 className="text-4xl md:text-5xl font-black text-center mb-16">
            Why I Built a Lab<br />
            <span className="text-green">Instead of a Social Network</span>
          </h1>

          <div className="space-y-6 text-muted text-lg leading-relaxed">
            <p>
              For years, I watched the digital fishing world turn into a popularity contest. Every app I opened felt like a mall &mdash; crowded, noisy, and constantly trying to sell me something. More importantly, they were often wrong. I'd see a Post-Spawn alert while the water was still 60 degrees, or find honey holes geolocated in parking lots. I didn't want another social network. I wanted a tool that worked as hard as I do.
            </p>

            <p>
              On April 12, 2026, I went to Percy Priest Reservoir with a thermometer, three rods, and a prototype app. The app said: <strong className="text-white">Bite is Slow</strong>. Thirty other bank anglers were there, and despite the beautiful morning, almost nothing was being caught. I heard the familiar whispers of &ldquo;nothing's biting&rdquo; as I walked the bank. I caught one fish on my third cast. Then spent two hours watching the algorithm prove itself right in real time. That wasn't luck. That's what happens when the physics are correct.
            </p>

            <p>
              I didn't build RIFLT to be a &ldquo;pro-only&rdquo; club. I built it for anyone who loves to fish &mdash; or anyone who is tired of the frustration and wants to learn. Whether you're a seasoned tournament pro or someone picking up a rod for the first time, RIFLT gives you the <strong className="text-white">2-degree advantage</strong>. The barometric drop, the thermal shift, the hidden brush pile &mdash; the details that separate a great day from a blank.
            </p>

            <p className="text-white font-semibold text-xl">
              Welcome to the Private Vault. Welcome to RIFLT.
            </p>
          </div>

          <div className="mt-16 pt-8 border-t border-border text-center">
            <p className="text-white font-bold text-lg mb-1">Brian Atwood</p>
            <p className="text-muted text-sm">Founder &amp; Inventor</p>
            <p className="text-muted/60 text-xs mt-4">Patent Pending RIFLT-PPA-001</p>
          </div>
        </div>
      </section>
    </div>
  );
}
