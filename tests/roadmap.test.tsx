import { afterEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import Workflow, { PHASES, STEP_SVH } from "@/components/Workflow";
import { ROADMAP_STAGES } from "@/data/roadmap";
import { STAGE_SCREENS } from "@/data/stageScreens";

const css = () => readFileSync(join("src", "app", "motion.css"), "utf8");
const rule = (selector: string) => new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} \\{[^}]*\\}`).exec(css())![0];

/** A stand-in IntersectionObserver that lets a test say which marker is crossing the middle of the screen. */
function stubObserver() {
  const callbacks: IntersectionObserverCallback[] = [];
  const watched: Element[] = [];
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(cb: IntersectionObserverCallback) {
        callbacks.push(cb);
      }
      observe(el: Element) {
        watched.push(el);
      }
      unobserve() {}
      disconnect() {}
    }
  );
  return {
    cross: (i: number) => act(() => callbacks[0]([{ isIntersecting: true, target: watched[i] } as unknown as IntersectionObserverEntry], {} as IntersectionObserver)),
    /** the whole block leaves the screen: off the bottom (reader went on to the next section) or off the top */
    leave: (where: "below" | "above") =>
      act(() => callbacks[1]([{ isIntersecting: false, boundingClientRect: { bottom: where === "below" ? -10 : 900 } } as unknown as IntersectionObserverEntry], {} as IntersectionObserver)),
    watched,
  };
}

afterEach(() => vi.unstubAllGlobals());

describe("Workflow (scroll-driven)", () => {
  it("has nothing to click: no buttons, links or tabs", () => {
    render(<Workflow />);
    expect(document.querySelector("#roadmap button, #roadmap a, #roadmap [role='tab'], #roadmap [tabindex]")).toBeNull();
  });

  it("never captures the scroll: no listeners, no wheel handling, no scrolling by script", () => {
    const src = readFileSync(join("src", "components", "Workflow.tsx"), "utf8");
    expect(src).not.toMatch(/addEventListener|onWheel|wheel|preventDefault|scrollTo|scrollIntoView|setInterval/);
  });

  it("is a tall block with one panel held in place while you scroll, about a quarter of a screen per stage", () => {
    render(<Workflow />);
    const track = document.querySelector(".wf3-track") as HTMLElement;
    expect(track.style.getPropertyValue("--n")).toBe(String(ROADMAP_STAGES.length));
    expect(track.style.getPropertyValue("--step")).toBe(`${STEP_SVH}svh`);
    expect(STEP_SVH).toBeGreaterThanOrEqual(18);
    expect(STEP_SVH).toBeLessThanOrEqual(30);
    expect(rule(".wf3-stage")).toMatch(/position: sticky/);
    expect(rule(".wf3-track")).toMatch(/calc\(var\(--n, 13\) \* var\(--step, 24svh\)/);
  });

  it("has one invisible marker per stage, and the panel starts on the first stage", () => {
    render(<Workflow />);
    expect(document.querySelectorAll(".wf3-markers [data-i]")).toHaveLength(ROADMAP_STAGES.length);
    expect(document.querySelector(".wf3-title")).toHaveTextContent(ROADMAP_STAGES[0].title);
    expect(document.querySelector(".wf2-node.is-active")).toHaveTextContent("01");
  });

  it("changes the stage as the page is scrolled: whichever marker crosses the middle of the screen", () => {
    const io = stubObserver();
    render(<Workflow />);
    expect(io.watched.filter((el) => el.hasAttribute("data-i"))).toHaveLength(ROADMAP_STAGES.length);
    io.cross(5);
    expect(document.querySelector(".wf3-title")).toHaveTextContent(ROADMAP_STAGES[5].title);
    expect(document.querySelector(".wf3-copy")).toHaveTextContent(ROADMAP_STAGES[5].desc);
    expect(document.querySelector(".wf3-copy")).toHaveTextContent(ROADMAP_STAGES[5].module);
    expect(document.querySelector(".wf2-node.is-active")).toHaveTextContent("06");
    expect(document.querySelectorAll(".wf2-node.is-done")).toHaveLength(5);
    expect((document.querySelector(".wf3-track") as HTMLElement).style.getPropertyValue("--p")).toBe(String(5 / 12));
    io.cross(1); // a small scroll back up while still inside the block moves back one stage at a time
    expect(document.querySelector(".wf3-title")).toHaveTextContent(ROADMAP_STAGES[1].title);
    expect(document.querySelectorAll(".wf2-node.is-done")).toHaveLength(1);
  });

  it("walks through every stage going down, in order", () => {
    const io = stubObserver();
    render(<Workflow />);
    ROADMAP_STAGES.forEach((s, i) => {
      io.cross(i);
      expect(document.querySelector(".wf3-title")).toHaveTextContent(s.title);
    });
  });

  it("coming back up from the next section goes straight to step 1, without scrolling through the stages", () => {
    const io = stubObserver();
    render(<Workflow />);
    for (let i = 0; i < ROADMAP_STAGES.length; i++) io.cross(i);
    io.leave("below"); // on to Solutions
    expect(document.querySelector(".wf2-node.is-active")).toHaveTextContent("01");
    for (let i = ROADMAP_STAGES.length - 1; i >= 0; i--) {
      io.cross(i); // scrolling back up through the block
      expect(document.querySelector(".wf2-node.is-active")).toHaveTextContent("01");
    }
    io.cross(1); // and scrolling down again picks the stages up again
    expect(document.querySelector(".wf3-title")).toHaveTextContent(ROADMAP_STAGES[1].title);
    io.cross(2);
    expect(document.querySelector(".wf3-title")).toHaveTextContent(ROADMAP_STAGES[2].title);
  });

  it("shrinks the block to one screen on the way back up, so Home is one scroll away, and grows it back above", () => {
    const io = stubObserver();
    render(<Workflow />);
    const track = document.querySelector(".wf3-track") as HTMLElement;
    io.leave("below");
    expect(track).toHaveClass("is-short");
    expect(rule(".wf3-track.is-short")).toMatch(/height: calc\(100svh - 4\.4rem\)/);
    io.leave("above");
    expect(track).not.toHaveClass("is-short");
  });

  it("is on step 1 when the block is left off the top too", () => {
    const io = stubObserver();
    render(<Workflow />);
    io.cross(4);
    io.leave("above");
    expect(document.querySelector(".wf2-node.is-active")).toHaveTextContent("01");
  });

  it("has one line and a bar of 13 segments for phones, which follow the stage", () => {
    const io = stubObserver();
    render(<Workflow />);
    const bar = () => [...document.querySelectorAll(".wf-m-bar span")];
    expect(bar()).toHaveLength(ROADMAP_STAGES.length);
    expect(document.querySelector(".wf-m-phase")).toHaveTextContent("Win the job");
    expect(document.querySelector(".wf-m-count")).toHaveTextContent("01 / 13");
    io.cross(6);
    expect(document.querySelector(".wf-m-phase")).toHaveTextContent("Make it");
    expect(document.querySelector(".wf-m-count")).toHaveTextContent("07 / 13");
    expect(bar().filter((s) => s.className === "is-done")).toHaveLength(6);
    expect(bar()[6]).toHaveClass("is-now");
    // on a phone the circles and the phase bars give way to it
    expect(css()).toMatch(/@media \(max-width: 760px\) \{[^@]*\.wf2-phases, \.wf2-rail, \.wf-lede, \.wf-eyebrow \{ display: none; \}[^@]*\.wf-m \{ display: grid/);
    expect(rule(".wf-m")).toMatch(/display: none/);
  });


  it("fills each phase bar along with the numbers, and the last number of a phase completes it", () => {
    const io = stubObserver();
    render(<Workflow />);
    const fill = () => [...document.querySelectorAll<HTMLElement>(".wf2-phases span")].map((el) => Number(el.style.getPropertyValue("--f")));
    expect(fill()).toEqual([0.25, 0, 0, 0]); // step 1: a quarter of "Win the job"
    io.cross(3); // step 4 completes "Win the job"
    expect(fill()).toEqual([1, 0, 0, 0]);
    io.cross(4); // step 5 starts "Define it"
    expect(fill()).toEqual([1, 0.5, 0, 0]);
    io.cross(5);
    expect(fill()).toEqual([1, 1, 0, 0]);
    io.cross(10); // step 11 completes "Make it"
    expect(fill()).toEqual([1, 1, 1, 0]);
    io.cross(11);
    expect(fill()).toEqual([1, 1, 1, 0.5]);
    io.cross(12); // step 13 completes "Deliver it"
    expect(fill()).toEqual([1, 1, 1, 1]);
  });

  it("groups the stages into phases that cover all of them exactly once", () => {
    const covered = PHASES.flatMap((p) => Array.from({ length: p.to - p.from + 1 }, (_, i) => p.from + i));
    expect(covered).toEqual(ROADMAP_STAGES.map((_, i) => i));
  });

  it("gives screen readers the whole workflow as a plain list, and hides the pinned panel from them so nothing is read twice", () => {
    render(<Workflow />);
    const items = screen.getAllByRole("listitem").filter((li) => li.closest(".sr-only"));
    expect(items).toHaveLength(ROADMAP_STAGES.length);
    expect(screen.getByRole("heading", { level: 2, name: "From enquiry to handover" })).toBeInTheDocument();
    ROADMAP_STAGES.forEach((s, i) => expect(items[i]).toHaveTextContent(s.desc));
    expect(document.querySelector(".wf3-stage")).toHaveAttribute("aria-hidden", "true");
  });

  it("stays short enough to fit under the header on a phone: one column, the main screen across the width and the other two under it", () => {
    expect(css()).toMatch(/@media \(max-width: 899px\) \{[^@]*\.wf3-panel \{ grid-template-columns: minmax\(0, 1fr\)/);
    expect(css()).toMatch(/@media \(max-width: 760px\) \{[^@]*\.wf3-shots \{ display: grid; grid-template-columns: 1fr 1fr;[^@]*\.wf3-shot\.s1 \{ grid-column: 1 \/ -1/);
  });

  it("blurs the other screens only where there is a pointer to hover with, not after a tap on a phone", () => {
    expect(css()).toMatch(/@media \(hover: hover\) \{\s*\.wf3-shots:has\(\.wf3-shot:hover\) \.wf3-shot \{/);
  });
});

describe("Workflow screens", () => {
  it("shows three ERP screens for the stage, the main one first, and they change with the stage", () => {
    const io = stubObserver();
    render(<Workflow />);
    const srcs = () => [...document.querySelectorAll(".wf3-shot img")].map((i) => i.getAttribute("src"));
    expect(srcs()).toEqual(STAGE_SCREENS["01"].map((s) => s.src));
    io.cross(2);
    expect(srcs()).toEqual(STAGE_SCREENS["03"].map((s) => s.src));
  });

  it("fetches every stage's screens as soon as the section mounts, and none is loaded lazily, so a stage never opens on empty boxes", () => {
    const fetched: string[] = [];
    vi.stubGlobal(
      "Image",
      class {
        decoding = "";
        set src(v: string) {
          fetched.push(v);
        }
      }
    );
    render(<Workflow />);
    const all = Object.values(STAGE_SCREENS).flatMap((shots) => shots.map((s) => s.src));
    expect(all).toHaveLength(39);
    expect(fetched.sort()).toEqual([...all].sort());
    expect(document.querySelector(".wf3-shot img[loading]")).toBeNull();
  });

  it("has a compact layout for a phone held sideways: copy beside the screens, with the heading and the numbers kept", () => {
    const block = /@media \(max-height: 520px\) \{[^@]*\}\r?\n/.exec(css())![0];
    expect(block).toMatch(/\.wf3-panel \{ grid-template-columns: minmax\(0, 5fr\) minmax\(0, 6fr\)/);
    expect(block).toMatch(/\.wf2-phases[^}]*display: none/);
  });

  it("puts the main screen big in the middle with a smaller one on each side", () => {
    expect(rule(".wf3-shot.s1")).toMatch(/order: 2/);
    expect(rule(".wf3-shot.s1")).toMatch(/flex-grow: 3/);
    expect(rule(".wf3-shot.s2")).toMatch(/order: 1/);
    expect(rule(".wf3-shot.s3")).toMatch(/order: 3/);
    expect(rule(".wf3-shot")).toMatch(/flex: 1 1 0/);
  });

  it("makes a screen big when it is pointed at, and shrinks and blurs the other two, only while one is pointed at", () => {
    const text = css();
    const others = /\.wf3-shots:has\(\.wf3-shot:hover\) \.wf3-shot \{[^}]*\}/.exec(text)![0];
    expect(others).toMatch(/flex-grow: 1/);
    expect(others).toMatch(/filter: blur\(3px\)/);
    expect(others).toMatch(/opacity: 0\.7/);
    const pointed = /\.wf3-shots:has\(\.wf3-shot:hover\) \.wf3-shot:hover \{[^}]*\}/.exec(text)![0];
    expect(pointed).toMatch(/flex-grow: 3/);
    expect(pointed).toMatch(/filter: none/);
    expect(pointed).toMatch(/opacity: 1/);
  });

  it("is the only place anything is blurred, and only on hover", () => {
    const blurred = css().split("\n").filter((l) => /blur\(/.test(l));
    expect(blurred).toHaveLength(1);
    expect(blurred[0]).toContain(".wf3-shots:has(.wf3-shot:hover) .wf3-shot");
  });
});

describe("demo ERP screens", () => {
  it("ships 39 wireframe screens, clearly marked as demo images", () => {
    const files = readdirSync(join("public", "erp"));
    expect(files).toHaveLength(39);
    for (const f of files) {
      const svg = readFileSync(join("public", "erp", f), "utf8");
      expect(svg).toContain("DEMO IMAGE");
      const words = [...svg.matchAll(/<text[^>]*>([^<]*)</g)].map((m) => m[1]).join(" ");
      expect(words.replace(/FEN1/g, "")).not.toMatch(/\d/); // no figures in the lettering: skeleton shapes only
    }
  });
  it("points every stage at files that exist", () => {
    for (const shots of Object.values(STAGE_SCREENS)) for (const s of shots) expect(existsSync(join("public", s.src))).toBe(true);
  });
});
