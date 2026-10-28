const WORDS = ["Glass", "Aluminium", "Windows"];

/**
 * A single row of giant outlined words that scrolls sideways on its own, without stopping.
 * The row holds two identical halves and slides by exactly one half, so the loop has no visible seam.
 * Decorative only: hidden from assistive technology. It runs slowly and never pauses.
 */
export default function WordBand() {
  const half = Array.from({ length: 2 }, () => WORDS).flat();

  return (
    <div className="wordband" aria-hidden="true" data-no-reveal>
      <div className="wordband-row">
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
    </div>
  );
}
