export default function About() {
  return (
    <div className="pt-24">
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-4 text-center">About</p>
          <h1 className="text-3xl md:text-4xl font-black text-center mb-16">
            Why I Built a Lab<br />
            <span className="text-green">Instead of a Social Network</span>
          </h1>

          <div className="space-y-6 text-muted text-lg leading-relaxed">
            <p>
              There's a feeling every angler knows. The line drops, the water goes quiet, and then &mdash; that yank. That unmistakable pull that means everything you read about the water was right. You weren't guessing. You knew.
            </p>

            <p>
              I built RIFLT&trade; to chase that feeling more often. Not for pros. Not for tournament fishermen. For anyone who's ever driven 45 minutes to a lake, fished for three hours, and driven home wondering what they missed. I was that angler. And I was tired of guessing.
            </p>

            <p>
              On April 12, 2026, I went to Percy Priest Reservoir with a thermometer, three rods, and a prototype app. The app said: <strong className="text-white">Bite is Slow</strong>. Thirty other bank anglers were there, and despite the beautiful morning, almost nothing was being caught. I heard the familiar whispers of &ldquo;nothing's biting&rdquo; as I walked the bank. I caught one fish on my third cast. Then spent two hours watching the algorithm prove itself right in real time. That wasn't luck. That's what happens when the physics are correct.
            </p>

            <p>
              Three weeks later I went back. Same lake, different season. The app said <strong className="text-white">Bite is Fair</strong> &mdash; conditions mixed, low activity. I fished for an hour with five different rigs. Zero bites. About twenty other bank anglers were there. A boat worked the shoreline a hundred feet out. Nobody caught anything.
            </p>

            <p>
              Standing there with a thermometer in one hand and a Ned rig I had to Google how to tie, I realized something: the app was right again. But it needed to do more than tell me the score. It needed to tell me what to do with it. That's when the <strong className="text-white">Contextual Intelligence</strong> features were born &mdash; rig explainers, conditions context, plain-language guidance for anglers who, like me, are still learning while they fish.
            </p>

            <p>
              Two field tests. Two seasons. Same lake. Same result. That's not luck. That's what happens when the physics are correct.
            </p>

            <p>
              I didn't build RIFLT&trade; to be a &ldquo;pro-only&rdquo; club. I built it for anyone who loves to fish &mdash; or anyone who is tired of the frustration and wants to learn. Whether you're a seasoned tournament pro or someone picking up a rod for the first time, RIFLT&trade; gives you the <strong className="text-white">2-degree advantage</strong>. The barometric drop, the thermal shift, the hidden brush pile &mdash; the details that separate a great day from a blank.
            </p>

            <p className="text-white font-semibold text-xl">
              Welcome to the Private Vault. Welcome to RIFLT&trade;.
            </p>
          </div>

          <div className="mt-16 pt-8 border-t border-border text-center">
            <p className="text-white font-bold text-lg mb-1">The Founder</p>
            <p className="text-muted text-sm">Inventor &amp; Builder</p>
            <p className="text-muted/60 text-xs mt-4">Patent Pending RIFLT-PPA-001</p>
          </div>
        </div>
      </section>
    </div>
  );
}
