import { useState } from 'react';
import Link from 'next/link';

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://nomnom-1u79.onrender.com';

const LOADING_MESSAGES = [
  'nomnom is eating...',
  'nom... searching for snacks...',
  'nom nom nom nom nom...',
  'hunting for the perfect ting...',
  'chewing... please wait...',
];

export default function RandomMeme() {
  const [memeUrl, setMemeUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [boingKey, setBoingKey] = useState(0);
  const [loadingMsg] = useState(
    () => LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]
  );

  const fetchMeme = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${SERVER_URL}/api/memes/random`);
      if (!res.ok) throw new Error('Failed to fetch meme');
      const data = await res.json();
      setMemeUrl(data.url);
      setBoingKey((k) => k + 1);
    } catch (err) {
      setError('nomnom ate the meme... try again!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="memes"
      className="relative py-16 sm:py-20 px-4 overflow-hidden bg-nomnom-cream"
    >
      {/* Background sparkles */}
      <span className="sparkle-star text-3xl" style={{ top: '8%', left: '6%', animationDelay: '0s' }}>★</span>
      <span className="sparkle-star text-2xl" style={{ top: '15%', right: '8%', animationDelay: '0.5s' }}>★</span>
      <span className="sparkle-star text-xl" style={{ bottom: '10%', left: '10%', animationDelay: '0.9s' }}>★</span>
      <span className="sparkle-star text-3xl" style={{ bottom: '15%', right: '5%', animationDelay: '0.3s' }}>★</span>

      <div className="max-w-2xl mx-auto text-center">
        {/* Heading */}
        <h2 className="section-heading mb-2">
          feed nomnom ★
        </h2>
        <p className="font-gaegu text-xl text-nomnom-brown/70 mb-8">
          tap the button for a random nomnom meme!
        </p>

        {/* Meme display area */}
        <div
          className="relative mx-auto mb-6 rounded-3xl border-4 border-dashed border-nomnom-pink
                     bg-nomnom-blush min-h-64 sm:min-h-80 flex items-center justify-center overflow-hidden
                     shadow-kawaii-pink"
          style={{ minHeight: 280 }}
        >
          {!memeUrl && !loading && !error && (
            <div className="flex flex-col items-center gap-3 p-8">
              <div className="text-6xl animate-bounce-slow">🐹</div>
              <p className="font-gaegu text-xl text-nomnom-brown/50">
                press the button to feed me!
              </p>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center gap-3 p-8">
              <div className="text-5xl animate-spin-slow">🐹</div>
              <p className="font-gaegu text-xl text-nomnom-brown animate-pulse">
                {loadingMsg}
              </p>
            </div>
          )}

          {error && !loading && (
            <div className="flex flex-col items-center gap-2 p-8">
              <div className="text-5xl">😿</div>
              <p className="font-gaegu text-lg text-nomnom-red">{error}</p>
            </div>
          )}

          {memeUrl && !loading && (
            <img
              key={boingKey}
              src={memeUrl}
              alt="Random nomnom meme"
              className="max-w-full max-h-96 object-contain rounded-2xl animate-boing"
            />
          )}
        </div>

        {/* Button */}
        <button
          onClick={fetchMeme}
          disabled={loading}
          className={`btn-kawaii text-xl px-8 py-4 ${
            loading ? 'opacity-60 cursor-not-allowed' : ''
          }`}
        >
          {loading ? '🐹 nomming...' : memeUrl ? '🐹 another one!' : '🐹 give me a meme!'}
        </button>

        {/* Link to full meme maker */}
        <p className="mt-6 font-gaegu text-lg text-nomnom-brown/70">
          make your own!{' '}
          <Link
            href="/memes"
            className="text-nomnom-pink font-bold underline hover:text-nomnom-deep-orange
                       transition-colors duration-200"
          >
            open the meme maker ★
          </Link>
        </p>
      </div>
    </section>
  );
}
