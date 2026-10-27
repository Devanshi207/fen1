import { describe, expect, it, vi } from "vitest";
import { render, waitFor } from "@testing-library/react";
import MotionProvider from "@/components/MotionProvider";

function Page() {
  return (
    <>
      <main>
        <div id="page">
          <div className="space-y-4">
            <h2>Heading</h2>
            <p>Intro text</p>
          </div>
          <div className="grid">
            <article id="a">
              <h3>Card A</h3>
              <p>Inside card A</p>
            </article>
            <article id="b">
              <h3>Card B</h3>
              <p>Inside card B</p>
            </article>
            <article id="c">
              <h3>Card C</h3>
              <p>Inside card C</p>
            </article>
          </div>
          <div className="flex">
            <a href="/one" className="rounded-full px-4 py-2">
              One
            </a>
            <a href="/two" className="rounded-full px-4 py-2">
              Two
            </a>
          </div>
        </div>
      </main>
      <MotionProvider />
    </>
  );
}

describe("MotionProvider", () => {
  it("animates the card, not the text inside it", async () => {
    render(<Page />);
    await waitFor(() => expect(document.getElementById("a")).toHaveClass("reveal"));
    expect(document.querySelector("#a h3")).not.toHaveClass("reveal");
    expect(document.querySelector("#a p")).not.toHaveClass("reveal");
  });

  it("cascades a heading and its paragraph one after the other", async () => {
    render(<Page />);
    const h2 = document.querySelector("h2") as HTMLElement;
    const intro = document.querySelector("main p") as HTMLElement;
    await waitFor(() => expect(h2).toHaveClass("reveal"));
    const delay = (el: HTMLElement) => parseInt(el.style.getPropertyValue("--d"), 10);
    expect(delay(intro)).toBeGreaterThan(delay(h2));
  });

  it("staggers the items of a group in order", async () => {
    render(<Page />);
    await waitFor(() => expect(document.getElementById("c")).toHaveClass("reveal"));
    const delay = (id: string) => parseInt((document.getElementById(id) as HTMLElement).style.getPropertyValue("--d"), 10);
    expect(delay("a")).toBeLessThan(delay("b"));
    expect(delay("b")).toBeLessThan(delay("c"));
  });

  it("staggers pill buttons that sit side by side", async () => {
    render(<Page />);
    const links = [...document.querySelectorAll<HTMLElement>("a.rounded-full")];
    await waitFor(() => expect(links[1]).toHaveClass("reveal"));
    expect(parseInt(links[1].style.getPropertyValue("--d"), 10)).toBeGreaterThan(parseInt(links[0].style.getPropertyValue("--d"), 10));
  });

  it("marks content that is already on screen as revealed", async () => {
    render(<Page />);
    // jsdom has no layout, so everything counts as in view
    await waitFor(() => expect(document.getElementById("a")).toHaveClass("in"));
  });

  it("drifts parallax layers at their own speed, in opposite directions for opposite speeds", async () => {
    const rect = (top: number) =>
      ({ top, bottom: top + 200, left: 0, right: 100, width: 100, height: 200, x: 0, y: top, toJSON: () => ({}) }) as DOMRect;
    vi.spyOn(window, "innerHeight", "get").mockReturnValue(800);
    render(
      <>
        <main>
          <div id="page">
            <figure id="down" data-speed="0.05" />
            <figure id="up" data-speed="-0.05" />
          </div>
        </main>
        <MotionProvider />
      </>
    );
    // both layers sit 200px below the viewport centre
    vi.spyOn(document.getElementById("down")!, "getBoundingClientRect").mockReturnValue(rect(500));
    vi.spyOn(document.getElementById("up")!, "getBoundingClientRect").mockReturnValue(rect(500));
    window.dispatchEvent(new Event("scroll"));
    const sy = (id: string) => parseFloat(document.getElementById(id)!.style.getPropertyValue("--sy"));
    // The value set at mount (no layout yet) is replaced after the scroll recalculates it from the real position.
    await waitFor(() => expect(sy("down")).toBeGreaterThan(0));
    expect(sy("up")).toBeLessThan(0);
    expect(Math.abs(sy("down"))).toBeCloseTo(Math.abs(sy("up")));
    vi.restoreAllMocks();
  });
});
