import dynamic from 'next/dynamic';
import Link from 'next/link';
import TagSearch from '@/components/TagSearch';

// hammerjs (used inside NomnomEditor) touches `window` at import time, which
// breaks Next's server-side prerender — load it client-only.
const NomnomEditor = dynamic(() => import('@/components/NomnomEditor'), { ssr: false });

export default function FeedNomnom() {
  return (
    <section id="feed" className="py-16 sm:py-20 px-4 bg-nomnom-white">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="section-heading mb-2">FIND A MEME</h2>
        <p className="font-gaegu text-lg text-nomnom-ink/60 mb-8">
          pick a few tags and nomnom will hunt down the perfect meme
        </p>

        <div className="mb-8">
          <img
            src="/nomnom-search.png"
            alt="Nomnom the Hungry Hamster"
            className="w-40 sm:w-48 md:w-56 h-auto drop-shadow-xl animate-bounce-slow mx-auto"
          />
        </div>

        <TagSearch />
      </div>

      <div className="mt-16 max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto bg-nomnom-cream rounded-3xl border-2 border-nomnom-brown/15 px-4 sm:px-8 py-10 text-center">
        <h3 className="font-gaegu font-bold text-2xl text-nomnom-ink mb-2">
          MAKE YOUR OWN
        </h3>
        <p className="font-gaegu text-base text-nomnom-ink/60 mb-6">
          upload a photo and drag nomnom on top of whatever he should eat next
        </p>
        <div className="w-[85%] max-w-md sm:max-w-lg lg:max-w-2xl xl:max-w-3xl mx-auto">
          <NomnomEditor />
        </div>

        <p className="font-gaegu text-sm text-nomnom-ink/50 mt-6">
          you can also use the{' '}
          <Link href="/memes" className="text-nomnom-pink font-bold hover:underline">
            classic meme maker
          </Link>
          {' '}— an earlier version with extra features and nomnom costumes.
        </p>
      </div>
    </section>
  );
}
