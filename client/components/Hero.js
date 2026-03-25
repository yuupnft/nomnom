import { useState } from 'react';

const CONTRACT_ADDRESS = '6ZrYhkwvoYE4QqzpdzJ7htEHwT2u2546EkTNJ7qepump';

const SPARKLES = [
  { top: '12%', left: '8%', size: 'text-3xl', delay: '0s' },
  { top: '20%', right: '10%', size: 'text-4xl', delay: '0.4s' },
  { top: '60%', left: '5%', size: 'text-2xl', delay: '0.8s' },
  { top: '75%', right: '8%', size: 'text-3xl', delay: '0.2s' },
  { top: '35%', left: '15%', size: 'text-xl', delay: '1s' },
  { top: '50%', right: '15%', size: 'text-2xl', delay: '0.6s' },
  { top: '85%', left: '20%', size: 'text-xl', delay: '1.2s' },
  { top: '10%', left: '45%', size: 'text-lg', delay: '0.3s' },
];

export default function Hero() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden
                        bg-gradient-to-b from-nomnom-orange via-nomnom-orange to-nomnom-blush
                        pt-20 pb-16 px-4">
      {/* Decorative sparkle stars */}
      {SPARKLES.map((s, i) => (
        <span
          key={i}
          className={`sparkle-star ${s.size}`}
          style={{
            top: s.top,
            left: s.left,
            right: s.right,
            animationDelay: s.delay,
          }}
        >
          ★
        </span>
      ))}

      {/* Floating nomnom character */}
      <div className="animate-bounce-slow mb-4 md:mb-6 drop-shadow-2xl">
        <img
          src="/landing.png"
          alt="Nomnom the Hungry Hamster"
          className="w-48 sm:w-60 md:w-72 lg:w-80 xl:w-96 h-auto"
        />
      </div>

      {/* Title */}
      <div className="text-center mb-3">
        <img
          src="/landing-title.png"
          alt="NOMNOM"
          className="w-64 sm:w-80 md:w-96 lg:w-[28rem] h-auto mx-auto drop-shadow-lg"
        />
      </div>

      {/* Tagline */}
      <p className="font-gaegu text-2xl sm:text-3xl md:text-4xl text-nomnom-brown font-bold text-center mb-2
                    drop-shadow-sm">
        he eats ALL the tings 🐹
      </p>
      <p className="font-itim text-lg sm:text-xl text-nomnom-brown/80 text-center mb-8">
        a very hungry hamster on the Solana blockchain ⚡
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-wrap gap-3 justify-center mb-8">
        <a
          href="https://jup.ag/swap/SOL-6ZrYhkwvoYE4QqzpdzJ7htEHwT2u2546EkTNJ7qepump"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-kawaii text-base sm:text-lg px-6 py-3"
        >
          Buy $NOMNOM ★
        </a>
        <a
          href="https://dexscreener.com/solana/6ZrYhkwvoYE4QqzpdzJ7htEHwT2u2546EkTNJ7qepump"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-kawaii-outline text-base sm:text-lg px-6 py-3"
        >
          View Chart 📈
        </a>
      </div>

      {/* Contract Address */}
      <div className="card-kawaii max-w-full sm:max-w-lg md:max-w-xl w-full mx-4 text-center mb-16">
        <p className="font-gaegu text-sm text-nomnom-brown/70 mb-1 uppercase tracking-wider">
          Contract Address
        </p>
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <code className="font-mono text-xs sm:text-sm text-nomnom-brown break-all">
            {CONTRACT_ADDRESS}
          </code>
          <button
            onClick={handleCopy}
            className={`flex-shrink-0 px-3 py-1.5 rounded-xl font-gaegu font-bold text-sm border-2 border-nomnom-brown
                        transition-all duration-200 border-b-4
                        ${copied
                          ? 'bg-nomnom-mint text-nomnom-brown border-b-2 translate-y-0.5'
                          : 'bg-nomnom-yellow text-nomnom-brown hover:bg-nomnom-pink hover:text-white hover:-translate-y-0.5'
                        }`}
          >
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-1 animate-bounce">
        <span className="font-gaegu text-sm text-nomnom-brown/60">scroll for more nom</span>
        <svg className="w-5 h-5 text-nomnom-brown/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
