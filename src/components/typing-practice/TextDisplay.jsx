import { useRef, useEffect } from "react";

export default function TextDisplay({ targetText, charStates, currentIndex }) {
  const containerRef = useRef(null);
  const cursorRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const cursor = cursorRef.current;
    if (!container || !cursor) return;

    const containerRect = container.getBoundingClientRect();
    const cursorRect = cursor.getBoundingClientRect();
    const LINE_HEIGHT = 44;
    const distanceFromBottom = containerRect.bottom - cursorRect.bottom;

    if (distanceFromBottom < LINE_HEIGHT * 1.5) {
      container.scrollBy({ top: LINE_HEIGHT, behavior: "smooth" });
    }
  }, [currentIndex]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        borderRadius: "10px",
        padding: "20px 24px",
        background: "#fafafa",
        border: "1px solid #e2e8f0",
        height: "220px",       /* taller: shows ~4 lines comfortably */
        overflowY: "hidden",
        fontFamily: "'DM Mono', 'Fira Mono', 'Courier New', monospace",
        fontSize: "25px",
        lineHeight: "44px",
        letterSpacing: "0.025em",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        userSelect: "none",
      }}
    >
      {targetText.split("").map((ch, i) => {
        const state = charStates[i];
        const isCursor = i === currentIndex;

        let color = "#B0A7A5";   // pending — light grey
        let bg = "transparent";
        if (state === "correct") {
          color = "#1a1a2e";     // typed correctly — near-black
        } else if (state === "incorrect") {
          color = "#b91c1c";
          bg = "#fff1f2";
        }

        return (
          <span
            key={i}
            ref={isCursor ? cursorRef : null}
            style={{
              color,
              background: bg,
              position: "relative",
              borderRadius: "3px",
            }}
          >
            {isCursor && (
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  top: "5px",
                  bottom: "5px",
                  width: "2px",
                  background: "#1a1a2e",
                  borderRadius: "2px",
                  animation: "tpBlink 1s step-end infinite",
                }}
              />
            )}
            {ch}
          </span>
        );
      })}

      {currentIndex === targetText.length && (
        <span
          style={{
            display: "inline-block",
            width: "2px",
            height: "22px",
            verticalAlign: "middle",
            background: "#1a1a2e",
            borderRadius: "2px",
            animation: "tpBlink 1s step-end infinite",
          }}
        />
      )}

      <style>{`
        @keyframes tpBlink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </div>
  );
}