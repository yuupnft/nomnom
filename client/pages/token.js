import { useState } from 'react';
import Link from 'next/link';

const CONTRACT_ADDRESS = '6ZrYhkwvoYE4QqzpdzJ7htEHwT2u2546EkTNJ7qepump';

export default function TokenPage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-nomnom-white flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full">
        <Link
          href="/"
          className="font-gaegu text-sm text-nomnom-ink/40 hover:text-nomnom-pink transition-colors mb-8 inline-block"
        >
          ← back to nomnom
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <img src="/logo-nav.png" alt="Nomnom" className="h-10 w-auto" />
          <h1 className="font-bowlby text-3xl sm:text-4xl text-nomnom-ink">THE $NOMNOM TOKEN</h1>
        </div>

        <p className="font-gaegu text-lg text-nomnom-ink/70 leading-relaxed mb-8">
          Nomnom started as a memecoin on the Solana blockchain. The coin exists,
          the community is real, and if you&apos;re into that sort of thing — here&apos;s where to find it.
        </p>

        <div className="card-kawaii mb-6">
          <p className="font-gaegu text-xs text-nomnom-ink/40 uppercase tracking-wider mb-2">Contract Address</p>
          <div className="flex items-center gap-2 flex-wrap">
            <code className="font-mono text-xs sm:text-sm text-nomnom-ink break-all flex-1">
              {CONTRACT_ADDRESS}
            </code>
            <button
              onClick={handleCopy}
              className={`flex-shrink-0 px-3 py-1.5 rounded-xl font-gaegu font-bold text-sm border-2 border-nomnom-brown/30
                          transition-all duration-200
                          ${copied
                            ? 'bg-nomnom-mint text-nomnom-ink'
                            : 'bg-nomnom-cream text-nomnom-ink hover:bg-nomnom-blush'
                          }`}
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-8">
          {[
            { label: 'DexScreener', href: `https://dexscreener.com/solana/${CONTRACT_ADDRESS}` },
            { label: 'CoinGecko', href: 'https://www.coingecko.com' },
            { label: 'Jupiter', href: `https://jup.ag/swap/SOL-${CONTRACT_ADDRESS}` },
            { label: 'Twitter / X', href: 'https://twitter.com/nomnom_solana' },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-kawaii-outline text-sm px-4 py-2.5 text-center"
            >
              {label}
            </a>
          ))}
        </div>

        <p className="font-gaegu text-xs text-nomnom-ink/30 text-center leading-relaxed">
          $NOMNOM is a meme coin. Not financial advice. Do your own research.
          Nomnom is primarily here to eat things, not to make you rich.
        </p>
      </div>
    </div>
  );
}
