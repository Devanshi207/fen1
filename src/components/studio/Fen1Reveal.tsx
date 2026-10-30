import { subProgress } from "@/lib/studio";

export const REVEAL = {
  bg: "#F1F6FF",
  navy: "#101B3A",
  blue: "#2864F5",
};

const TOP = 248;
const BOTTOM = 428;
const H = BOTTOM - TOP;
const ink = REVEAL.navy;

// the four letters of the finished lockup; the loader and the home page's wordmark both draw these same shapes
const SHAPE_F = (
  <>
    <rect x="324" y="248" width="36" height="180" fill={ink} rx="1" />
    <rect x="360" y="248" width="80" height="34" fill={ink} />
    <rect x="360" y="322" width="64" height="32" fill={ink} />
  </>
);
const SHAPE_E = (
  <>
    <rect x="462" y="248" width="36" height="180" fill={ink} rx="1" />
    <rect x="498" y="248" width="82" height="34" fill={ink} />
    <rect x="498" y="322" width="66" height="32" fill={ink} />
    <rect x="498" y="394" width="82" height="34" fill={ink} />
  </>
);
const SHAPE_N = (
  <>
    <rect x="612" y="248" width="36" height="180" fill={ink} rx="1" />
    <polygon points="648,248 710,428 648,286" fill={ink} />
    <rect x="708" y="248" width="36" height="180" fill={ink} rx="1" />
  </>
);
const SHAPE_1 = (
  <>
    <polygon points="774,282 800,248 800,282" fill={ink} />
    <rect x="800" y="248" width="36" height="180" fill={ink} rx="1" />
    <rect x="776" y="396" width="84" height="32" fill={ink} rx="1" />
  </>
);

/** The finished FEN1 lockup, the same artwork the loader ends on. The home page uses it as its big wordmark. */
export function Fen1Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="324 229 536 199" className={className} aria-hidden="true" style={{ shapeRendering: "geometricPrecision" }}>
      {SHAPE_F}
      {SHAPE_E}
      {SHAPE_N}
      {SHAPE_1}
      <circle cx="818" cy="234" r="5" fill={REVEAL.blue} />
    </svg>
  );
}

/**
 * The FEN1 wordmark on an architectural grid. The letters are the finished lockup, each wiped in through its own mask: F
 * and 1 rise from the baseline, E sweeps in from the left, N is drawn from the top. Then the two halves settle together
 * and a blue beam runs along the top edge. `progress` (0 to 1) is the whole timeline; nothing in here keeps time.
 * The invisible `data-lockup` rect marks where the finished lockup sits, so the loader can fly it onto the page.
 */
export default function Fen1Reveal({ progress, svgRef }: { progress: number; svgRef?: React.Ref<SVGSVGElement> }) {
  const p = progress;
  const pOrigin = subProgress(p, 0.01, 0.14);
  const pGuide = subProgress(p, 0.04, 0.2);
  const guides = 1 - subProgress(p, 0.62, 0.82);

  const pF = subProgress(p, 0.12, 0.34);
  const pE = subProgress(p, 0.24, 0.46);
  const pN = subProgress(p, 0.36, 0.6);
  const p1 = subProgress(p, 0.48, 0.72);
  const pDot = subProgress(p, 0.72, 0.8);

  const pJoin = subProgress(p, 0.68, 0.86);
  const pSettle = subProgress(p, 0.8, 0.92);
  const pBeam = subProgress(p, 0.84, 0.98);
  const beamX = 260 + pBeam * 680;
  const beamOpacity = Math.sin(pBeam * Math.PI);

  const lift = (v: number) => (1 - v) * 16;

  return (
    <svg ref={svgRef} viewBox="230 170 740 330" className="st-reveal" role="img" aria-label="FEN1" style={{ shapeRendering: "geometricPrecision" }}>
      <defs>
        <filter id="st-beam" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <clipPath id="st-clip-f"><rect x="320" y={BOTTOM - pF * H} width="124" height={pF * H} /></clipPath>
        <clipPath id="st-clip-e"><rect x="458" y="240" width={pE * 128} height="196" /></clipPath>
        <clipPath id="st-clip-n"><rect x="608" y="240" width="140" height={pN * (H + 8)} /></clipPath>
        <clipPath id="st-clip-1"><rect x="770" y={BOTTOM - p1 * H} width="94" height={p1 * H} /></clipPath>
      </defs>

      <rect data-lockup="" x="324" y="229" width="536" height="199" fill="none" />

      {/* construction guides: an origin dot and dashed lines that draw out from it, then fade */}
      <g opacity={guides}>
        <circle cx="600" cy="338" r={pOrigin * 5} fill={REVEAL.blue} opacity={pOrigin < 1 ? pOrigin : 1 - subProgress(p, 0.3, 0.5)} />
        <line x1={600 - pGuide * 400} y1={BOTTOM} x2={600 + pGuide * 400} y2={BOTTOM} stroke={REVEAL.blue} strokeWidth="1.2" strokeDasharray="4 6" opacity="0.35" />
        <line x1={600 - pGuide * 400} y1={TOP} x2={600 + pGuide * 400} y2={TOP} stroke={REVEAL.blue} strokeWidth="1" strokeDasharray="4 6" opacity="0.3" />
        <line x1="600" y1={338 - pGuide * 150} x2="600" y2={338 + pGuide * 150} stroke={REVEAL.blue} strokeWidth="1" strokeDasharray="3 5" opacity="0.25" />
      </g>

      <g transform={`translate(0, ${(1 - pSettle) * 4})`}>
        <g transform={`translate(${(1 - pJoin) * -10}, 0)`}>
          <g clipPath="url(#st-clip-f)">
            <g transform={`translate(0, ${lift(pF)})`}>{SHAPE_F}</g>
          </g>
          <g clipPath="url(#st-clip-e)">
            <g transform={`translate(${(1 - pE) * -16}, 0)`}>{SHAPE_E}</g>
          </g>
          {pF > 0 && pF < 1 && <line x1="316" y1={BOTTOM - pF * H} x2="446" y2={BOTTOM - pF * H} stroke={REVEAL.blue} strokeWidth="2" opacity="0.8" />}
          {pE > 0 && pE < 1 && <line x1={458 + pE * 128} y1="240" x2={458 + pE * 128} y2="436" stroke={REVEAL.blue} strokeWidth="2" opacity="0.8" />}
        </g>

        <g transform={`translate(${(1 - pJoin) * 10}, 0)`}>
          <g clipPath="url(#st-clip-n)">
            <g transform={`translate(0, ${-lift(pN)})`}>{SHAPE_N}</g>
          </g>
          <g clipPath="url(#st-clip-1)">
            <g transform={`translate(0, ${lift(p1)})`}>{SHAPE_1}</g>
          </g>
          {pN > 0 && pN < 1 && <line x1="604" y1={248 + pN * (H + 8)} x2="752" y2={248 + pN * (H + 8)} stroke={REVEAL.blue} strokeWidth="2" opacity="0.8" />}
          {p1 > 0 && p1 < 1 && <line x1="766" y1={BOTTOM - p1 * H} x2="868" y2={BOTTOM - p1 * H} stroke={REVEAL.blue} strokeWidth="2" opacity="0.8" />}
          <circle cx="818" cy="234" r={5 * pDot} fill={REVEAL.blue} />
        </g>

        {pBeam > 0 && beamOpacity > 0.05 && (
          <g opacity={beamOpacity}>
            <circle cx={beamX} cy={TOP} r="5" fill="#FFFFFF" filter="url(#st-beam)" />
            <line x1={beamX - 45} y1={TOP} x2={beamX + 20} y2={TOP} stroke={REVEAL.blue} strokeWidth="2.5" strokeLinecap="round" />
            <line x1={beamX - 25} y1={TOP} x2={beamX + 6} y2={TOP} stroke="#FFFFFF" strokeWidth="1.2" />
          </g>
        )}
      </g>
    </svg>
  );
}
