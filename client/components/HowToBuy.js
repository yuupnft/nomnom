const WalletIcon = () => (
  <svg className="w-6 h-6 flex-shrink-0 text-nomnom-pink" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/>
    <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
    <circle cx="17" cy="14" r="1" fill="currentColor"/>
  </svg>
);

const CoinIcon = () => (
  <svg className="w-6 h-6 flex-shrink-0 text-nomnom-deep-orange" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 8v8M9 10h4.5a1.5 1.5 0 010 3H9m0 0h4.5a1.5 1.5 0 010 3H9"/>
  </svg>
);

const SwapIcon = () => (
  <svg className="w-6 h-6 flex-shrink-0 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 16V4m0 0L3 8m4-4l4 4"/>
    <path d="M17 8v12m0 0l4-4m-4 4l-4-4"/>
  </svg>
);

const StarIcon = () => (
  <svg className="w-6 h-6 flex-shrink-0 text-nomnom-yellow" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth={1}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

const STEPS = [
  {
    num: '01',
    Icon: WalletIcon,
    title: 'Get a Wallet',
    desc: 'Download Phantom or Solflare — the best Solana wallets. Available on iOS, Android, and as a browser extension.',
    color: 'bg-nomnom-blush',
    border: 'border-nomnom-pink',
    shadow: 'shadow-kawaii-pink',
  },
  {
    num: '02',
    Icon: CoinIcon,
    title: 'Get Some SOL',
    desc: 'Buy SOL from any major exchange (Coinbase, Binance, Kraken) and send it to your wallet.',
    color: 'bg-nomnom-yellow/30',
    border: 'border-nomnom-yellow',
    shadow: 'shadow-kawaii',
  },
  {
    num: '03',
    Icon: SwapIcon,
    title: 'Swap for $NOMNOM',
    desc: 'Use Jupiter or Moonshot to swap your SOL for $NOMNOM. Paste the contract address below.',
    color: 'bg-nomnom-mint/40',
    border: 'border-nomnom-brown',
    shadow: 'shadow-kawaii',
  },
  {
    num: '04',
    Icon: StarIcon,
    title: 'HOLD & Nom!',
    desc: 'Welcome to the nomnom family! Join the community and help nomnom eat ALL the tings!',
    color: 'bg-nomnom-blush',
    border: 'border-nomnom-pink',
    shadow: 'shadow-kawaii-pink',
  },
];

const EXCHANGES = [
  {
    name: 'Jupiter',
    icon: '/jupiter.svg',
    href: 'https://jup.ag/swap/SOL-6ZrYhkwvoYE4QqzpdzJ7htEHwT2u2546EkTNJ7qepump',
    desc: 'Best rates on Solana',
    badge: '⭐ Recommended',
    badgeColor: 'bg-nomnom-yellow text-nomnom-brown',
  },
  {
    name: 'Moonshot',
    icon: '/moonshot.png',
    href: 'https://moonshot.money',
    desc: 'Easy one-click buy',
    badge: null,
    badgeColor: '',
  }
];

const SPARKLES = [
  { top: '5%', left: '4%', size: 'text-3xl', delay: '0.2s' },
  { top: '15%', right: '5%', size: 'text-2xl', delay: '0.7s' },
  { bottom: '8%', right: '6%', size: 'text-3xl', delay: '0.4s' },
];

export default function HowToBuy() {
  return (
    <section
      id="buy"
      className="relative py-16 sm:py-20 px-4 overflow-hidden bg-nomnom-cream"
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
        <div className="text-center mb-10">
          <h2 className="section-heading">how to buy $NOMNOM</h2>
          <p className="font-gaegu text-xl text-nomnom-brown/70 mt-1">
            4 easy steps to join the nom family
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
          {STEPS.map((step) => (
            <div
              key={step.num}
              className={`rounded-3xl border-2 ${step.border} ${step.shadow} ${step.color} p-6
                          hover:-translate-y-1 transition-transform duration-200`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-nomnom-brown flex items-center
                                justify-center font-bowlby text-white text-sm">
                  {step.num}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <step.Icon />
                    <h3 className="font-gaegu font-bold text-xl text-nomnom-brown">
                      {step.title}
                    </h3>
                  </div>
                  <p className="font-rubik text-sm text-nomnom-brown/75 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Exchange Cards */}
        <div className="text-center mb-6">
          <p className="font-gaegu font-bold text-2xl text-nomnom-brown mb-6">
            buy $NOMNOM on ★
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {EXCHANGES.map((ex) => (
              <a
                key={ex.name}
                href={ex.href}
                target="_blank"
                rel="noopener noreferrer"
                className="card-kawaii flex flex-col items-center gap-3 w-36 sm:w-40
                           hover:-translate-y-1.5 hover:shadow-kawaii-lg transition-all duration-200
                           group"
              >
                <img
                  src={ex.icon}
                  alt={ex.name}
                  className="w-12 h-12 object-contain group-hover:scale-110 transition-transform duration-200"
                />
                <div>
                  <p className="font-gaegu font-bold text-lg text-nomnom-brown">{ex.name}</p>
                  <p className="font-rubik text-xs text-nomnom-brown/60">{ex.desc}</p>
                </div>
                {ex.badge && (
                  <span className={`text-xs font-gaegu font-bold px-2 py-0.5 rounded-full ${ex.badgeColor}`}>
                    {ex.badge}
                  </span>
                )}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
