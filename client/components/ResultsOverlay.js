import { useEffect } from 'react';

export default function ResultsOverlay({ results, focusedImage, setFocusedImage, onClose }) {
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (focusedImage) setFocusedImage(null);
        else onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [focusedImage, onClose, setFocusedImage]);

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm overflow-y-auto animate-fade-in-up">
      <button
        onClick={onClose}
        aria-label="Close search results"
        className="fixed top-4 right-4 z-[110] w-10 h-10 flex items-center justify-center
                   rounded-full bg-nomnom-white text-nomnom-ink text-xl font-bold shadow-kawaii
                   hover:bg-nomnom-blush transition-colors duration-150"
      >
        ×
      </button>

      {results.length === 0 && (
        <div className="min-h-screen flex items-center justify-center px-4">
          <p className="font-gaegu text-xl text-white text-center">
            nomnom couldn&apos;t find any memes with those tags...
          </p>
        </div>
      )}

      {results.length > 0 && !focusedImage && (
        <div className="columns-2 sm:columns-3 md:columns-4 gap-3 p-4 pt-20">
          {results.map((img) => (
            <div key={img.public_id || img.secure_url} className="break-inside-avoid mb-3">
              <img
                src={img.secure_url}
                alt=""
                onClick={() => setFocusedImage(img)}
                className="w-full h-auto rounded-xl cursor-pointer shadow-kawaii hover:-translate-y-0.5 transition-transform duration-150"
              />
            </div>
          ))}
        </div>
      )}

      {focusedImage && (
        <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8 animate-boing">
          <img
            src={focusedImage.secure_url}
            alt=""
            className="max-h-[75vh] max-w-[90vw] object-contain rounded-xl shadow-kawaii-lg"
          />
          <button
            onClick={() => setFocusedImage(null)}
            className="btn-kawaii-outline"
          >
            ← Back to results
          </button>
        </div>
      )}
    </div>
  );
}
