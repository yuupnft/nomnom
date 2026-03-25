import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

import NavBar from '@/components/NavBar';
import Hero from '@/components/Hero';
import TwitterMentions from '@/components/TwitterMentions';
import RandomMeme from '@/components/RandomMeme';
import Tokenomics from '@/components/Tokenomics';
import HowToBuy from '@/components/HowToBuy';

const SERVER_URL = 'https://nomnom-1u79.onrender.com';

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.213 5.567zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
  </svg>
);

const RedditIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
  </svg>
);

const SOCIALS = [
  {
    name: 'Twitter / X',
    handle: '@nomnom_solana',
    Icon: XIcon,
    href: 'https://twitter.com/nomnom_solana',
    bg: 'bg-black',
    text: 'text-white',
    shadow: 'shadow-kawaii',
  },
  {
    name: 'Telegram',
    handle: 't.me/NomNom_on_Solana',
    Icon: TelegramIcon,
    href: 'https://t.me/NomNom_on_Solana',
    bg: 'bg-sky-500',
    text: 'text-white',
    shadow: 'shadow-kawaii',
  },
  {
    name: 'Instagram',
    handle: '@nomnom_hamu',
    Icon: InstagramIcon,
    href: 'https://www.instagram.com/nomnom_hamu',
    bg: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400',
    text: 'text-white',
    shadow: 'shadow-kawaii-pink',
  },
  {
    name: 'Reddit',
    handle: 'r/nomnom_solana',
    Icon: RedditIcon,
    href: 'https://www.reddit.com/r/nomnom_solana/',
    bg: 'bg-orange-500',
    text: 'text-white',
    shadow: 'shadow-kawaii',
  },
];

const ABOUT_SPARKLES = [
  { top: '8%', left: '2%', size: 'text-3xl', delay: '0s' },
  { top: '25%', right: '3%', size: 'text-2xl', delay: '0.5s' },
  { bottom: '12%', left: '4%', size: 'text-xl', delay: '0.9s' },
  { bottom: '20%', right: '2%', size: 'text-3xl', delay: '0.3s' },
];

export default function Home() {
  const [totalSupply, setTotalSupply] = useState('~999,864,338');

  useEffect(() => {
    axios
      .get(`${SERVER_URL}/api/metadata/totalsupply`)
      .then((res) => {
        if (res.data) setTotalSupply(Number(res.data).toLocaleString());
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen">
      <NavBar />

      {/* 1. Hero */}
      <Hero />

      {/* 2. About */}
      <section
        id="about"
        className="relative py-16 sm:py-20 px-4 overflow-hidden bg-nomnom-blush border-y-2 border-nomnom-brown"
      >
        {ABOUT_SPARKLES.map((s, i) => (
          <span
            key={i}
            className={`sparkle-star ${s.size}`}
            style={{ top: s.top, left: s.left, right: s.right, bottom: s.bottom, animationDelay: s.delay }}
          >
            ★
          </span>
        ))}

        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Image */}
            <div className="flex-shrink-0">
              <img
                src="/eiffel.png"
                alt="Nomnom eating the Eiffel Tower"
                className="w-48 sm:w-60 md:w-72 h-auto drop-shadow-xl animate-bounce-slow"
              />
            </div>

            {/* Text */}
            <div className="text-center md:text-left">
              <h2 className="section-heading mb-4">
                about $NOMNOM ★
              </h2>
              <p className="font-gaegu text-xl text-nomnom-brown leading-relaxed mb-3">
                nomnom is a very hungry hamster living on the Solana blockchain.
              </p>
              <p className="font-gaegu text-xl text-nomnom-brown leading-relaxed mb-3">
                This hamster is SO hungry that <strong>any-ting</strong> is on the menu...
                the Eiffel Tower, your favourite snacks, entire market caps —
                nomnom eats <strong>ALL the tings!</strong>
              </p>
              <p className="font-gaegu text-xl text-nomnom-brown leading-relaxed mb-6">
                Born as a memecoin on Solana ⚡, nomnom&apos;s chaotic appetite has earned him
                a whole community of fans who just love watching him eat. nom 🐹
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <a href="#buy" className="btn-kawaii text-base px-5 py-2.5">
                  Buy $NOMNOM ★
                </a>
                <a
                  href="https://memedepot.com/d/nom-nom"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-kawaii-outline text-base px-5 py-2.5"
                >
                  View Memes! 🖼️
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Twitter Mentions Marquee */}
      <TwitterMentions />

      {/* 4. Random Meme Viewer */}
      <RandomMeme />

      {/* 5. Tokenomics */}
      <Tokenomics totalSupply={totalSupply} />

      {/* 6. How To Buy */}
      <HowToBuy />

      {/* 7. Community / Socials */}
      <section
        id="community"
        className="relative py-16 sm:py-20 px-4 overflow-hidden bg-nomnom-blush border-t-2 border-nomnom-brown"
      >
        <span className="sparkle-star text-3xl" style={{ top: '10%', left: '5%', animationDelay: '0s' }}>★</span>
        <span className="sparkle-star text-2xl" style={{ top: '20%', right: '6%', animationDelay: '0.6s' }}>★</span>
        <span className="sparkle-star text-xl" style={{ bottom: '15%', left: '8%', animationDelay: '0.3s' }}>★</span>

        <div className="max-w-4xl mx-auto text-center">
          <h2 className="section-heading mb-2">join the nom family ★</h2>
          <p className="font-gaegu text-xl text-nomnom-brown/70 mb-10">
            we eat together, we win together 🐹
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {SOCIALS.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${s.bg} ${s.text} ${s.shadow} rounded-3xl border-2 border-nomnom-brown
                             p-6 flex flex-col items-center gap-3
                             hover:-translate-y-2 hover:shadow-kawaii-lg transition-all duration-200
                             group`}
              >
                <div className="group-hover:scale-110 transition-transform duration-200">
                  <s.Icon />
                </div>
                <div>
                  <p className="font-gaegu font-bold text-xl">{s.name}</p>
                  <p className="font-rubik text-xs opacity-80">{s.handle}</p>
                </div>
              </a>
            ))}
          </div>

          {/* Meme Maker CTA */}
          <div className="card-kawaii max-w-lg mx-auto text-center">
            <p className="font-gaegu font-bold text-2xl text-nomnom-brown mb-2">
              make nomnom memes! 🎨
            </p>
            <p className="font-rubik text-sm text-nomnom-brown/70 mb-4">
              use our community meme maker to create your own nomnom moments
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/memes" className="btn-kawaii text-base px-5 py-2.5">
                Meme Maker ★
              </Link>
              <a
                href="https://memedepot.com/d/nom-nom"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-kawaii-outline text-base px-5 py-2.5"
              >
                View Gallery 🖼️
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-nomnom-brown text-white py-8 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="font-gaegu text-sm text-white/70 mb-2">
            Legal Disclaimer: $NOMNOM is a meme coin with no intrinsic value or expectation of financial return.
            $NOMNOM is for entertainment purposes only.
          </p>
          <p className="font-gaegu text-sm text-white/60">
            team@nomnomsol.com
          </p>
          <div className="mt-4 flex justify-center">
            <img
              src="/feet.png"
              alt="Nomnom feet"
              className="h-16 w-auto opacity-80"
            />
          </div>
          <p className="font-gaegu text-xs text-white/40 mt-2">
            nomnom eats ALL the tings 🐹 ★
          </p>
        </div>
      </footer>
    </div>
  );
}
