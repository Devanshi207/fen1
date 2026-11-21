import { HOME_INTRO, HOME_PROMISES } from "@/data/aboutContent";
import SectionHead from "./SectionHead";

/** Home, between the hero and the comparison table: what FEN1 is, and the three things it promises. */
export default function HomeIntro() {
  return (
    <div id="what-is-fen1" className="page-sec">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHead title="What is FEN1?" more={HOME_INTRO.slice(1)}>
          {HOME_INTRO[0]}
        </SectionHead>
        <ul className="home-promises">
          {HOME_PROMISES.map((p) => (
            <li key={p.title}>
              <strong>{p.title}</strong>
              <span>{p.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
