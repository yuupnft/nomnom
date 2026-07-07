import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const STICKER_CITIES = [
  { city: 'Atlanta', count: 13 },
  { city: 'Chicago', count: 7 },
  { city: 'Dallas', count: 5 },
];

export default function StickerSection() {
  const router = useRouter();
  const [foundCity, setFoundCity] = useState(null);

  useEffect(() => {
    const { sticker } = router.query;
    if (sticker) {
      setFoundCity(String(sticker).charAt(0).toUpperCase() + String(sticker).slice(1));
    }
  }, [router.query]);

  return (
    <section id="stickers" className="py-16 sm:py-20 px-4 bg-nomnom-cream">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="section-heading mb-2">FIND NOMNOM STICKERS</h2>
        <p className="font-gaegu text-lg text-nomnom-ink/60 mb-10">
          nomnom is hiding out there. keep your eyes open.
        </p>

        {foundCity ? (
          <div className="card-kawaii bg-nomnom-yellow mb-10 py-8">
            <p className="font-bowlby text-2xl sm:text-3xl text-nomnom-ink mb-2">
              YOU FOUND A NOMNOM STICKER!
            </p>
            <p className="font-gaegu text-xl text-nomnom-ink/70 mb-4">
              spotted in {foundCity} 📍
            </p>
            <img src="/landing.png" alt="Nomnom" className="w-24 h-auto mx-auto animate-bounce-slow" />
          </div>
        ) : (
          <div className="card-kawaii mb-10 py-8">
            <p className="font-gaegu text-xl text-nomnom-ink mb-2">
              🔍 scan a sticker to unlock something special
            </p>
            <p className="font-gaegu text-base text-nomnom-ink/60">
              exclusive art, secret animations, collectible badges
            </p>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-4">
          {STICKER_CITIES.map(({ city, count }) => (
            <div key={city} className="bg-nomnom-white rounded-2xl border-2 border-nomnom-brown/20 px-6 py-4 text-center shadow-sm">
              <p className="font-bowlby text-2xl text-nomnom-ink">{count}</p>
              <p className="font-gaegu text-sm text-nomnom-ink/60">{city}</p>
            </div>
          ))}
        </div>
        <p className="font-gaegu text-sm text-nomnom-ink/40 mt-4">stickers found so far</p>
      </div>
    </section>
  );
}
