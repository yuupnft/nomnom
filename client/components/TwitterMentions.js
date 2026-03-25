import Marquee from 'react-fast-marquee';
import { Tweet } from 'react-tweet';

// Replace these tweet IDs with real ones when available.
// Tweet ID is the number at the end of the tweet URL:
// e.g. https://twitter.com/user/status/1234567890  → ID is "1234567890"
const TWEET_IDS = [
  '1881061061438345332', // @Wendys
  '1872356307115647432', // @MercedesBenz
  '1872340388175839673', // @MercedesBenz
  '1847347030806405150', // @redlobster
  '1847332714459914312', // @DennysDiner
  '1845805278932959504', // @BMW
  '1845841019457187860', // @kfc
  '1845135017590091782', // @kfc
  '1839816123815989284', // @wendys
  '1837264371048661233', // @bmw
  '1836453210631856616', // @BMW
  '1832044328778346846', // @Chilis
  '1828460106251440408', // @BMW
  '1826160713620140402', // @Chilis
  '1821299106767065114', // @KITKAT
  '1820903180336590931', // @kfc
  '1821262424739344509', // @kfc
  '1821279141783892384', // @SUBWAY
  '1816137068172443765', // @kfc
  '1810741600873545873', // @ChipotleTweets
  '1811069802728845620', // @MountainDew
];

// Placeholder card shown when no tweet IDs are configured or tweet fails to load
function PlaceholderCard({ label }) {
  return (
    <div className="flex-shrink-0 w-64 sm:w-72 card-blush flex flex-col items-center justify-center
                    text-center gap-2 min-h-[160px] mx-2">
      <span className="text-4xl">🐹</span>
      <p className="font-gaegu font-bold text-nomnom-brown text-base">{label}</p>
      <p className="font-rubik text-xs text-nomnom-brown/60">nomnom mention incoming...</p>
    </div>
  );
}

const PLACEHOLDER_LABELS = [
  'brand spotted nomnom!',
  'they mentioned nomnom ★',
  'nom nom nom nom nom',
  'another one gets eaten',
  'nom 🐹',
  'nom ate their tweet',
  'everyone loves nomnom',
  'eating all their content',
];

export default function TwitterMentions() {
  const hasTweets = TWEET_IDS.length > 0;

  return (
    <section className="relative py-12 sm:py-16 overflow-hidden bg-nomnom-blush border-y-2 border-nomnom-brown">
      {/* Background decorations */}
      <span className="sparkle-star text-2xl" style={{ top: '15%', left: '3%', animationDelay: '0.3s' }}>★</span>
      <span className="sparkle-star text-xl" style={{ top: '60%', right: '2%', animationDelay: '0.7s' }}>★</span>

      {/* Section header */}
      <div className="text-center mb-8 px-4">
        <h2 className="section-heading">
          nomnom is everywhere ★
        </h2>
        <p className="font-gaegu text-lg text-nomnom-brown/70 mt-1">
          even the brands can&apos;t resist nom
        </p>
      </div>

      {/* Marquee */}
      <Marquee
        gradient={false}
        speed={40}
        className="overflow-hidden"
      >
        {hasTweets ? (
          TWEET_IDS.map((id) => (
            <div key={id} className="mx-3 flex-shrink-0" style={{ maxWidth: 320 }}>
              <Tweet id={id} />
            </div>
          ))
        ) : (
          // Show placeholder cards when no tweet IDs are set
          [...PLACEHOLDER_LABELS, ...PLACEHOLDER_LABELS].map((label, i) => (
            <PlaceholderCard key={i} label={label} />
          ))
        )}
      </Marquee>


{!hasTweets && (
        <p className="text-center font-gaegu text-sm text-nomnom-brown/50 mt-4 px-4">
          tweet IDs coming soon — add them to <code className="bg-nomnom-brown/10 px-1 rounded">TwitterMentions.js</code>
        </p>
      )}
    </section>
  );
}
