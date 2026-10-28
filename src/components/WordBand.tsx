const WORDS = ["Glass", "Aluminium", "Windows"];

/**
 * Two rows of giant outlined words that scroll sideways on their own, in opposite directions, without stopping.
 * Each row holds two identical halves and slides by exactly one half, so the loop has no visible seam.
 * Decorative only: hidden from assistive technology. It runs slowly and pauses while the pointer is over it.
 */
export default function WordBand() {
  const half = Array.from({ length: 2 }, () => WORDS).flat();

  return (
    <div className="wordband" aria-hidden="true" data-no-reveal>
      {[0, 1].map((r) => (
        <div key={r} className={`wordband-row ${r === 1 ? "is-reverse" : ""}`}>
          {[0, 1].map((copy) => (
            <div key={copy} className="wordband-half">
              {half.map((w, i) => (
                <span key={i} className="wordband-item">
                  {w}
                  <i className="wordband-dot" />
                </span>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
