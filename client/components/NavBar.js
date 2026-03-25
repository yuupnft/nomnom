import { useState, useEffect } from 'react';
import Image from 'next/image';

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Memes', href: '/memes' },
  { label: 'Tokenomics', href: '#tokenomics' },
  { label: 'Buy', href: '#buy' },
  { label: 'Community', href: '#community' },
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
          ? 'bg-nomnom-orange/90 backdrop-blur-md shadow-kawaii border-b-2 border-nomnom-brown'
          : 'bg-nomnom-orange/70 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="#" className="flex-shrink-0 hover:scale-105 transition-transform duration-200">
            <img
              src="/logo-nav.png"
              alt="Nomnom Logo"
              className="h-10 md:h-14 w-auto drop-shadow-md"
            />
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-gaegu text-lg font-bold text-nomnom-brown px-3 py-1.5 rounded-xl
                           hover:bg-nomnom-pink hover:text-white transition-all duration-200
                           hover:-translate-y-0.5"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#buy"
              className="btn-kawaii ml-2 text-base px-4 py-2"
            >
              Buy $NOMNOM ★
            </a>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5
                       rounded-xl border-2 border-nomnom-brown bg-white shadow-kawaii
                       hover:bg-nomnom-blush transition-colors duration-200"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span
              className={`block w-5 h-0.5 bg-nomnom-brown rounded transition-all duration-300 ${
                menuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-nomnom-brown rounded transition-all duration-300 ${
                menuOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-nomnom-brown rounded transition-all duration-300 ${
                menuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-nomnom-cream border-t-2 border-nomnom-brown px-4 py-4 flex flex-col gap-2">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="font-gaegu text-xl font-bold text-nomnom-brown px-4 py-2.5
                         rounded-xl border-2 border-nomnom-brown bg-white shadow-kawaii
                         hover:bg-nomnom-blush transition-all duration-200 text-center"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#buy"
            onClick={() => setMenuOpen(false)}
            className="btn-kawaii text-center mt-1"
          >
            Buy $NOMNOM ★
          </a>
        </div>
      </div>
    </nav>
  );
}
