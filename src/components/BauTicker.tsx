const ITEMS = ["See you at BAU 2027", "11 to 15 January 2027", "Messe München, Germany", "Hall B4, Stand 527", "Meet us there"];

/**
 * Home, under the hero: one line of the BAU 2027 details that runs across the page without stopping. The line is repeated so the
 * join never shows; the repeat is hidden from screen readers, which get the details once. It always runs (the visitor asked for it to be there), and stops under the pointer.
 */
export default function BauTicker() {
  return (
    <div className="bau-ticker" role="group" aria-label="BAU 2027: 11 to 15 January 2027, Messe München, Germany, Hall B4, Stand 527">
      <div className="bau-track" aria-hidden="true">
        {[0, 1].map((copy) => (
          <ul key={copy}>
            {ITEMS.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
