import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Coins } from 'lucide-react';

const NAV_LINKS = [
  // { label: 'Stickers', href: '#stickers' },
  // { label: 'Nom Cares', href: '#cares' },
];

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-nomnom-white/95 backdrop-blur-md shadow-sm border-b border-nomnom-brown/10'
          : 'bg-nomnom-white/80 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          <a href="#" className="flex-shrink-0 hover:scale-105 transition-transform duration-200">
            <img
              src="/logo-nav.png"
              alt="Nomnom"
              className="h-9 md:h-11 w-auto"
            />
          </a>

          <div className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-gaegu text-base font-bold text-nomnom-ink px-3 py-1.5 rounded-xl
                           hover:bg-nomnom-blush hover:text-nomnom-ink transition-all duration-200"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/token"
              aria-label="$nomnom token"
              className="p-2 rounded-xl text-nomnom-ink hover:bg-nomnom-blush transition-all duration-200"
            >
              <Coins size={20} strokeWidth={2.25} />
            </Link>
          </div>

          <button
            className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5
                       rounded-xl border border-nomnom-brown/20 bg-white
                       hover:bg-nomnom-cream transition-colors duration-200"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span className={`block w-4 h-0.5 bg-nomnom-ink rounded transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-4 h-0.5 bg-nomnom-ink rounded transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-4 h-0.5 bg-nomnom-ink rounded transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      <div className={`md:hidden transition-all duration-300 overflow-hidden ${menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-nomnom-white border-t border-nomnom-brown/10 px-4 py-4 flex flex-col gap-1.5">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="font-gaegu text-lg font-bold text-nomnom-ink px-4 py-2.5
                         rounded-xl bg-nomnom-cream hover:bg-nomnom-blush transition-all duration-200 text-center"
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/token"
            onClick={() => setMenuOpen(false)}
            className="font-gaegu text-lg font-bold text-nomnom-ink px-4 py-2.5
                       rounded-xl bg-nomnom-cream hover:bg-nomnom-blush transition-all duration-200
                       flex items-center justify-center gap-2"
          >
            <Coins size={20} strokeWidth={2.25} />
            $nomnom token
          </Link>
        </div>
      </div>
    </nav>
  );
}
