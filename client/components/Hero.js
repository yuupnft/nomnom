import { useState, useEffect } from 'react';

// Each entry is a fully-drawn "nomnom eating ___" image, cycled in the hero.
// Add new files to client/public/nomnom-eating/ and list them here.
const NOMNOM_EATING_IMAGES = [
  { src: '/nomnom-eating/banana.png', alt: 'Nomnom eating a banana' },
  { src: '/nomnom-eating/chip.png', alt: 'Nomnom eating a chip' },
  { src: '/nomnom-eating/crayon.png', alt: 'Nomnom eating a crayon' },
  { src: '/nomnom-eating/dice.png', alt: 'Nomnom eating dice' },
  { src: '/nomnom-eating/eraser.png', alt: 'Nomnom eating an eraser' },
  { src: '/nomnom-eating/heart.png', alt: 'Nomnom eating a heart' },
  { src: '/nomnom-eating/hello-kitty.png', alt: 'Nomnom eating Hello Kitty' },
  { src: '/nomnom-eating/keyblade.png', alt: 'Nomnom eating a keyblade' },
  { src: '/nomnom-eating/kfc.png', alt: 'Nomnom eating KFC' },
  { src: '/nomnom-eating/ocarina.png', alt: 'Nomnom eating an ocarina' },
  { src: '/nomnom-eating/pizza-rolls.png', alt: 'Nomnom eating pizza rolls' },
  { src: '/nomnom-eating/pokeball.png', alt: 'Nomnom eating a pokeball' },
  { src: '/nomnom-eating/popcorn.png', alt: 'Nomnom eating popcorn' },
  { src: '/nomnom-eating/question-box.png', alt: 'Nomnom eating a question box' },
  { src: '/nomnom-eating/recycle.png', alt: 'Nomnom eating a recycle symbol' },
  { src: '/nomnom-eating/tongue.png', alt: 'Nomnom eating a tongue' },
];

const FLIP_INTERVAL_MS = 3500;
const FADE_MS = 400;

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setIndex((i) => (i + 1) % NOMNOM_EATING_IMAGES.length);
        setFading(false);
      }, FADE_MS);
    }, FLIP_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  const current = NOMNOM_EATING_IMAGES[index];

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-nomnom-white pt-20 pb-16 px-4">
      <div className="text-center flex flex-col items-center gap-2">
        <h1 className="font-bowlby text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-nomnom-ink tracking-tight">
          NOMNOM
        </h1>

        <p className="font-gaegu text-xl sm:text-2xl md:text-3xl text-nomnom-ink/60 font-bold tracking-widest uppercase">
          eat all the tings
        </p>

        <div className="my-8 md:my-10 relative">
          <div className="animate-bounce-slow drop-shadow-xl">
            <img
              src={current.src}
              alt={current.alt}
              className={`w-44 sm:w-56 md:w-64 lg:w-72 h-auto transition-opacity duration-300 ${
                fading ? 'opacity-0' : 'opacity-100'
              }`}
            />
          </div>
        </div>

        <a
          href="#feed"
          className="btn-kawaii text-lg sm:text-xl px-8 py-3.5"
        >
          View Memes!
        </a>

        <p className="font-gaegu text-base text-nomnom-ink/40 mt-6 animate-bounce">
          ↓ scroll
        </p>
      </div>
    </section>
  );
}
