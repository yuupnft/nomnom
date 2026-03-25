import { useState } from 'react';

const CONTRACT_ADDRESS = '6ZrYhkwvoYE4QqzpdzJ7htEHwT2u2546EkTNJ7qepump';

const DEX_LINKS = [
  {
    name: 'Dexscreener',
    icon: '/dexscreener-circle.svg',
    href: 'https://dexscreener.com/solana/6ZrYhkwvoYE4QqzpdzJ7htEHwT2u2546EkTNJ7qepump',
    bg: 'bg-black',
    text: 'text-white',
  },
  {
    name: 'DexTools',
    icon: '/dextools.svg',
    href: 'https://www.dextools.io/app/en/solana/pair-explorer/6ZrYhkwvoYE4QqzpdzJ7htEHwT2u2546EkTNJ7qepump',
    bg: 'bg-nomnom-yellow',
    text: 'text-nomnom-brown',
  },
  {
    name: 'CoinGecko',
    icon: '/coingecko.svg',
    href: 'https://www.coingecko.com/en/coins/nomnom',
    bg: 'bg-nomnom-mint',
    text: 'text-nomnom-brown',
  },
  {
    name: 'CoinMarketCap',
    icon: '/cmc.svg',
    href: 'https://coinmarketcap.com/currencies/nomnom/',
    bg: 'bg-blue-100',
    text: 'text-nomnom-brown',
  },
];

// Inline SVG icons for stat cards
const TagIcon = () => (
  <svg className="w-8 h-8 mx-auto text-nomnom-pink" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
    <line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
);

const CoinsIcon = () => (
  <svg className="w-8 h-8 mx-auto text-nomnom-deep-orange" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="8" r="6"/>
    <path d="M18.09 10.37A6 6 0 1110.34 18"/>
    <path d="M7 6h1v4"/>
    <path d="M16.71 13.88l.7.71-2.82 2.82"/>
  </svg>
);

const CrownIcon = () => (
  <svg className="w-8 h-8 mx-auto text-nomnom-yellow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 20h20M5 20l2-10 5 5 5-5 2 10"/>
    <circle cx="5" cy="9" r="1" fill="currentColor"/>
    <circle cx="12" cy="4" r="1" fill="currentColor"/>
    <circle cx="19" cy="9" r="1" fill="currentColor"/>
  </svg>
);

const LockIcon = () => (
  <svg className="w-8 h-8 mx-auto text-nomnom-mint" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
);

const SPARKLES = [
  { top: '10%', left: '3%', size: 'text-2xl', delay: '0s' },
  { top: '20%', right: '4%', size: 'text-3xl', delay: '0.6s' },
  { bottom: '15%', left: '5%', size: 'text-xl', delay: '0.4s' },
  { bottom: '10%', right: '3%', size: 'text-2xl', delay: '0.8s' },
];

export default function Tokenomics({ totalSupply }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const stats = [
    { label: 'Ticker', value: '$NOMNOM', Icon: TagIcon },
    { label: 'Total Supply', value: totalSupply || '~999,864,338', Icon: CoinsIcon },
    { label: 'Max Supply', value: '1,000,000,000', Icon: CrownIcon },
    { label: 'Liquidity', value: 'Locked', Icon: LockIcon },
  ];

  return (
    <section
      id="tokenomics"
      className="relative py-16 sm:py-20 px-4 overflow-hidden bg-nomnom-orange"
    >
      {SPARKLES.map((s, i) => (
        <span
          key={i}
          className={`sparkle-star ${s.size}`}
          style={{ top: s.top, left: s.left, right: s.right, bottom: s.bottom, animationDelay: s.delay }}
        >
          ★
        </span>
      ))}

      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-4">
          <span className="inline-block bg-nomnom-pink text-white font-gaegu font-bold text-sm px-4 py-1
                           rounded-full border-2 border-nomnom-brown mb-3">
            ⚡ Born on Solana
          </span>
          <h2 className="section-heading">nomnom by the numbers</h2>
          <p className="font-gaegu text-lg text-nomnom-brown/70 mt-1">
            the hungry hamster&apos;s tokenomics
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="card-kawaii text-center hover:-translate-y-1 transition-transform duration-200"
            >
              <div className="mb-3"><stat.Icon /></div>
              <p className="font-gaegu font-bold text-xl text-nomnom-brown leading-tight">
                {stat.value}
              </p>
              <p className="font-rubik text-xs text-nomnom-brown/60 mt-1 uppercase tracking-wide">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Contract Address */}
        <div className="card-kawaii mb-8 text-center">
          <p className="font-gaegu font-bold text-lg text-nomnom-brown mb-2">
            Contract Address
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <code className="font-mono text-xs sm:text-sm text-nomnom-brown/80 break-all">
              {CONTRACT_ADDRESS}
            </code>
            <button
              onClick={handleCopy}
              className={`flex-shrink-0 px-4 py-1.5 rounded-xl font-gaegu font-bold text-sm
                          border-2 border-nomnom-brown border-b-4 transition-all duration-200
                          ${copied
                            ? 'bg-nomnom-mint border-b-2 translate-y-0.5'
                            : 'bg-nomnom-yellow hover:bg-nomnom-pink hover:text-white hover:-translate-y-0.5'
                          }`}
            >
              {copied ? '✓ Copied!' : 'Copy CA'}
            </button>
          </div>
        </div>

        {/* DEX Links */}
        <div className="text-center mb-6">
          <p className="font-gaegu font-bold text-xl text-nomnom-brown mb-4">
            track nomnom ★
          </p>
          {/* Listing icons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {[
              { href: 'https://coinmarketcap.com/currencies/nomnom/', src: '/cmc.svg', alt: 'CoinMarketCap' },
              { href: 'https://www.coingecko.com/en/coins/nomnom', src: '/coingecko.svg', alt: 'CoinGecko' },
              { href: 'https://dexscreener.com/solana/6ZrYhkwvoYE4QqzpdzJ7htEHwT2u2546EkTNJ7qepump', src: '/dexscreener-circle.svg', alt: 'Dexscreener' },
              { href: 'https://www.dextools.io/app/en/solana/pair-explorer/Fhmjp6SMtmD8GXkq8tw6aZjBk3sDpKtKKSH6RToLAX3m', src: '/dextools.svg', alt: 'DexTools' },
            ].map((link) => (
              <a
                key={link.alt}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="card-kawaii p-3 flex items-center justify-center
                           hover:-translate-y-1 hover:shadow-kawaii-lg transition-all duration-200"
              >
                <img src={link.src} alt={link.alt} className="h-12 w-12 object-contain" />
              </a>
            ))}
          </div>
        </div>

        {/* Solana badge */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-400 to-nomnom-pink
                          text-white font-gaegu font-bold px-6 py-3 rounded-2xl border-2 border-nomnom-brown
                          border-b-4 shadow-kawaii">
            <span className="text-xl">⚡</span>
            <span>proudly living on the Solana blockchain</span>
            <span className="text-xl">⚡</span>
          </div>
        </div>
      </div>
    </section>
  );
}
