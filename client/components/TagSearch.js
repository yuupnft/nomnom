import { useState, useMemo, useRef, useEffect } from 'react';
import ResultsOverlay from '@/components/ResultsOverlay';

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://nomnom-1u79.onrender.com';

export default function TagSearch() {
  const [allTags, setAllTags] = useState([]);
  const [tagsLoaded, setTagsLoaded] = useState(false);
  const [tagsLoading, setTagsLoading] = useState(false);
  const [tagsError, setTagsError] = useState(null);

  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const containerRef = useRef(null);

  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [results, setResults] = useState(null);
  const [focusedImage, setFocusedImage] = useState(null);

  const ensureTagsLoaded = () => {
    if (tagsLoaded || tagsLoading) return;
    setTagsLoading(true);
    setTagsError(null);
    fetch(`${SERVER_URL}/api/tags`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch tags');
        return res.json();
      })
      .then((data) => {
        setAllTags(Array.isArray(data) ? data : []);
        setTagsLoaded(true);
      })
      .catch(() => setTagsError("nomnom couldn't find the tags... try again!"))
      .finally(() => setTagsLoading(false));
  };

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allTags
      .filter((tag) => !selectedTags.includes(tag))
      .filter((tag) => !q || tag.toLowerCase().includes(q))
      .slice(0, 8);
  }, [allTags, query, selectedTags]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSearch = async () => {
    if (selectedTags.length === 0 || searching) return;
    setSearching(true);
    setSearchError(null);
    try {
      const res = await fetch(`${SERVER_URL}/api/memes/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tags: selectedTags }),
      });
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      setResults(data);
      setFocusedImage(null);
    } catch {
      setSearchError("nomnom couldn't find those memes... try again!");
    } finally {
      setSearching(false);
    }
  };

  const closeResults = () => {
    setResults(null);
    setFocusedImage(null);
  };

  return (
    <div className="max-w-md mx-auto">
      <div ref={containerRef} className="relative">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
              ensureTagsLoaded();
            }}
            onFocus={() => {
              setShowSuggestions(true);
              ensureTagsLoaded();
            }}
            maxLength={60}
            placeholder="search memes by tag..."
            className="w-full font-gaegu text-lg text-nomnom-ink bg-nomnom-cream border-2 border-nomnom-brown/30
                       rounded-2xl px-4 py-3 outline-none focus:border-nomnom-pink transition-colors duration-200
                       placeholder:text-nomnom-ink/30"
          />
          <button
            onClick={handleSearch}
            disabled={selectedTags.length === 0 || searching}
            className="btn-kawaii-pink px-5 py-3 text-base flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {searching ? 'nomming...' : 'Search'}
          </button>
        </div>

        {showSuggestions && tagsLoading && (
          <div className="absolute top-full left-0 right-0 mt-2 z-10 bg-nomnom-white border-2 border-nomnom-brown/20
                          rounded-2xl shadow-kawaii px-4 py-3">
            <p className="font-gaegu text-sm text-nomnom-ink/50">loading tags...</p>
          </div>
        )}

        {showSuggestions && !tagsLoading && matches.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 z-10 bg-nomnom-white border-2 border-nomnom-brown/20
                          rounded-2xl shadow-kawaii max-h-56 overflow-y-auto">
            {matches.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className="w-full text-left font-gaegu text-base text-nomnom-ink px-4 py-2.5
                           hover:bg-nomnom-cream transition-colors duration-150 capitalize"
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {tagsError && (
          <p className="font-gaegu text-sm text-nomnom-red mt-2">{tagsError}</p>
        )}
      </div>

      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {selectedTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 font-gaegu text-sm text-nomnom-ink
                         bg-nomnom-blush border-2 border-nomnom-pink rounded-full pl-3 pr-2 py-1 capitalize"
            >
              {tag}
              <button
                onClick={() => toggleTag(tag)}
                aria-label={`Remove ${tag}`}
                className="w-4 h-4 flex items-center justify-center leading-none text-nomnom-ink/60 hover:text-nomnom-red"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {searchError && (
        <p className="font-gaegu text-sm text-nomnom-red mt-3">{searchError}</p>
      )}

      {results !== null && (
        <ResultsOverlay
          results={results}
          focusedImage={focusedImage}
          setFocusedImage={setFocusedImage}
          onClose={closeResults}
        />
      )}
    </div>
  );
}
