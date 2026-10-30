import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import Fen1Reveal, { Fen1Mark } from "@/components/studio/Fen1Reveal";

describe("Fen1Reveal", () => {
  it("ends on the finished lockup, shape for shape, with the guides faded out", () => {
    const svg = renderToStaticMarkup(<Fen1Reveal progress={1} />);
    ['x="324" y="248" width="36" height="180"', 'x="498" y="394" width="82" height="34"', 'points="648,248 710,428 648,286"', 'points="774,282 800,248 800,282"', 'x="776" y="396" width="84" height="32"'].forEach((shape) => expect(svg).toContain(shape));
    expect(svg).toContain('r="5"');
    expect(svg).toContain('<g opacity="0">');
  });

  it("starts with no letters showing", () => {
    const svg = renderToStaticMarkup(<Fen1Reveal progress={0} />);
    expect(svg).toContain('width="0"');
  });

  it("draws the home page's wordmark from the same shapes as the loader's finished frame", () => {
    const mark = renderToStaticMarkup(<Fen1Mark />);
    ['points="648,248 710,428 648,286"', 'x="498" y="394" width="82" height="34"', 'points="774,282 800,248 800,282"'].forEach((shape) => expect(mark).toContain(shape));
  });
});
