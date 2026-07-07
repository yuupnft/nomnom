export default function WhoIsNomnom() {
  return (
    <section className="py-16 sm:py-20 px-4 bg-nomnom-cream">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
          <div className="flex-shrink-0">
            <img
              src="/eiffel.png"
              alt="Nomnom eating the Eiffel Tower"
              className="w-44 sm:w-56 md:w-64 h-auto drop-shadow-xl animate-bounce-slow"
            />
          </div>

          <div className="text-center md:text-left">
            <h2 className="section-heading mb-6">WHO IS NOMNOM?</h2>
            <p className="font-gaegu text-xl sm:text-2xl text-nomnom-ink leading-relaxed mb-4">
              Nomnom is a hamster with a simple dream:
            </p>
            <p className="font-bowlby text-2xl sm:text-3xl text-nomnom-red mb-6">
              Eat all the tings.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
