import { useRef, useEffect, useMemo, useState } from "react";

/**
 * TextDisplay — MonkeyType-style windowed word renderer.
 *
 * Key optimisation: instead of one <span> per character for the whole
 * paragraph, we render each *word* as a single <span> (coloured by its
 * overall state). Only the *currently active word* is split into per-char
 * spans. This keeps the DOM to O(words) instead of O(characters), which
 * eliminates the lag on long paragraphs.
 *
 * A hidden "ruler" div (identical layout, visibility:hidden) is used to
 * measure where each word sits vertically, so we can CSS-translate the
 * inner content to keep the active line in view — exactly like MonkeyType.
 */

const LINE_H = 54;       // px — matches lineHeight below
const VISIBLE_LINES = 4; // how many lines the box shows

export default function TextDisplay({ targetText, charStates, currentIndex }) {
  const rulerRef   = useRef(null);
  const [windowTop, setWindowTop] = useState(0);

  // ── Build word list from targetText ──────────────────────────────────
  const words = useMemo(() => {
    const raw = targetText.split(" ");
    let ci = 0;
    return raw.map((word, wi) => {
      const token    = wi < raw.length - 1 ? word + " " : word;
      const startIdx = ci;
      ci += token.length;
      return { token, startIdx, len: token.length };
    });
  }, [targetText]);

  // ── Which word is the cursor currently in? ───────────────────────────
  const activeWordIdx = useMemo(() => {
    const idx = words.findIndex(
      (w) => w.startIdx + w.len > currentIndex
    );
    return idx === -1 ? words.length - 1 : idx;
  }, [words, currentIndex]);

  // ── After layout, measure each word's offsetTop from the ruler ───────
  const rowOffsetsRef = useRef([]);
  useEffect(() => {
    const ruler = rulerRef.current;
    if (!ruler) return;
    const spans   = ruler.querySelectorAll("span[data-wi]");
    const offsets = [];
    spans.forEach((s) => { offsets[+s.dataset.wi] = s.offsetTop; });
    rowOffsetsRef.current = offsets;
  }, [targetText]); // only re-measure when text changes

  // ── Slide window so active line is always the 2nd visible line ───────
  useEffect(() => {
    const offsets   = rowOffsetsRef.current;
    const activeTop = offsets[activeWordIdx] ?? 0;
    setWindowTop(Math.max(0, activeTop - LINE_H));
  }, [activeWordIdx]);

  // ── Per-character colour ──────────────────────────────────────────────
  const charColor = (state) => {
    if (state === "correct")   return "#1a1a2e";
    if (state === "incorrect") return "#dc2626";
    return "#c0c8d2";
  };

  const sharedStyle = {
    fontFamily: "'DM Mono', 'Fira Mono', 'Courier New', monospace",
    fontSize:   "24px",
    lineHeight: `${LINE_H}px`,
    whiteSpace: "pre-wrap",
    wordBreak:  "break-word",
  };

  return (
    <div style={{ position: "relative" }}>

      {/* ── Hidden ruler: full text, same layout, used only for measuring ── */}
      <div
        ref={rulerRef}
        aria-hidden="true"
        style={{
          ...sharedStyle,
          position:      "absolute",
          top:           0,
          left:          18,
          right:         18,
          visibility:    "hidden",
          pointerEvents: "none",
          paddingTop:    "2px",
        }}
      >
        {words.map((w, wi) => (
          <span key={wi} data-wi={wi}>{w.token}</span>
        ))}
      </div>

      {/* ── Visible clipping box ─────────────────────────────────────────── */}
      <div
        style={{
          height:       `${LINE_H * VISIBLE_LINES}px`,
          overflow:     "hidden",
          position:     "relative",
          borderRadius: "10px",
          background:   "#fafafa",
          border:       "1px solid #e2e8f0",
          padding:      "0 18px",
        }}
      >
        {/* Bottom fade */}
        <div
          style={{
            position:      "absolute",
            bottom:        0,
            left:          0,
            right:         0,
            height:        "48px",
            background:    "linear-gradient(transparent, #fafafa)",
            pointerEvents: "none",
            zIndex:        2,
          }}
        />

        {/* Scrolling inner — CSS transform, no JS scroll */}
        <div
          style={{
            ...sharedStyle,
            transform:  `translateY(-${windowTop}px)`,
            transition: "transform 0.18s cubic-bezier(0.4,0,0.2,1)",
            paddingTop: "2px",
          }}
        >
          {words.map((w, wi) => {
            const isActive = wi === activeWordIdx;

            if (!isActive) {
              // ── Non-active word: ONE span, colour by majority state ──
              let color = "#c0c8d2"; // all pending
              const slice = charStates.slice(w.startIdx, w.startIdx + w.len);
              if (slice.every((s) => s === "correct"))        color = "#1a1a2e";
              else if (slice.some((s) => s === "incorrect"))  color = "#dc2626";

              return (
                <span key={wi} style={{ color }}>
                  {w.token}
                </span>
              );
            }

            // ── Active word: per-character spans (small, ≤ ~15 chars) ──
            return (
              <span key={wi}>
                {w.token.split("").map((ch, ci) => {
                  const absIdx  = w.startIdx + ci;
                  const state   = charStates[absIdx] ?? "pending";
                  const isCursor = absIdx === currentIndex;

                  return (
                    <span
                      key={ci}
                      style={{
                        color:        charColor(state),
                        background:   state === "incorrect" ? "#fff1f2" : "transparent",
                        borderRadius: "3px",
                        position:     "relative",
                      }}
                    >
                      {isCursor && (
                        <span
                          style={{
                            position:    "absolute",
                            left:        0,
                            top:         "4px",
                            bottom:      "4px",
                            width:       "2px",
                            background:  "#1a1a2e",
                            borderRadius:"2px",
                            animation:   "tpBlink 1s step-end infinite",
                          }}
                        />
                      )}
                      {ch === " " ? "\u00A0" : ch}
                    </span>
                  );
                })}
              </span>
            );
          })}

          {/* End-of-text cursor */}
          {currentIndex === targetText.length && (
            <span
              style={{
                display:      "inline-block",
                width:        "2px",
                height:       "22px",
                verticalAlign:"middle",
                background:   "#1a1a2e",
                borderRadius: "2px",
                animation:    "tpBlink 1s step-end infinite",
              }}
            />
          )}
        </div>
      </div>

      <style>{`
        @keyframes tpBlink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </div>
  );
}