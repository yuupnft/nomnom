export default function NomnomCares() {
  return (
    <section id="cares" className="py-16 sm:py-20 px-4 bg-nomnom-cream">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="section-heading mb-6">NOMNOM CARES</h2>

        <div className="flex justify-center mb-6">
          <img
            src="/landing.png"
            alt="Nomnom"
            className="w-28 sm:w-36 h-auto drop-shadow-lg animate-bounce-slow"
          />
        </div>

        <p className="font-gaegu text-xl sm:text-2xl text-nomnom-ink leading-relaxed mb-3">
          While Nomnom wants to eat all the tings,
        </p>
        <p className="font-gaegu text-xl sm:text-2xl text-nomnom-ink leading-relaxed mb-8">
          he believes every animal deserves food too.
        </p>

        <div className="card-kawaii max-w-sm mx-auto">
          <p className="font-gaegu text-base text-nomnom-ink/60 mb-1">featured this month</p>
          <p className="font-bowlby text-xl text-nomnom-ink mb-3">[ coming soon ]</p>
          <div className="bg-nomnom-mint rounded-xl px-4 py-2 inline-block">
            <p className="font-gaegu text-sm text-nomnom-ink/70">raised this month</p>
            <p className="font-bowlby text-2xl text-nomnom-ink">$0</p>
          </div>
        </div>
      </div>
    </section>
  );
}
