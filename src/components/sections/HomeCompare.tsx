import { CLOSING, PROBLEMS, PRINCIPLES } from "@/data/aboutContent";
import SectionHead from "./SectionHead";

/** Home, below the window drawing: what goes wrong without one system, set against the FEN1 way, one row for each. */
export default function HomeCompare() {
  return (
    <div id="compare" className="page-sec">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHead title="From scattered tools to one system" />
        <div className="compare">
          <table className="compare-table">
            <caption className="sr-only">Working without one system, compared with the FEN1 way</caption>
            <thead>
              <tr>
                <th scope="col">Area</th>
                <th scope="col">Without one system</th>
                <th scope="col">The FEN1 way</th>
              </tr>
            </thead>
            <tbody>
              {PROBLEMS.map((p, i) => (
                <tr key={p.n}>
                  <th scope="row" data-label="Area">
                    <span className="tech about-n">{p.n}</span>
                    {p.name}
                  </th>
                  <td data-label="Without one system">{p.issue}</td>
                  <td data-label="The FEN1 way">
                    <strong>{PRINCIPLES[i].title}</strong>
                    <span>{PRINCIPLES[i].text}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="compare-closing">
            <strong>{CLOSING.title}</strong>
            <span>{CLOSING.text}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
