import React, { useRef, useEffect } from "react";

export default function TextDisplay({ targetText, charStates, currentIndex }) {
  const containerRef = useRef(null);
  const cursorRef = useRef(null);

  // When the cursor gets close to the bottom of the visible area, scroll down one line
  useEffect(() => {
    const container = containerRef.current;
    const cursor = cursorRef.current;
    if (!container || !cursor) return;

    const containerRect = container.getBoundingClientRect();
    const cursorRect = cursor.getBoundingClientRect();

    const LINE_HEIGHT = 42; // matches lineHeight below
    const distanceFromBottom = containerRect.bottom - cursorRect.bottom;

    if (distanceFromBottom < LINE_HEIGHT * 1.5) {
      container.scrollBy({ top: LINE_HEIGHT, behavior: "smooth" });
    }
  }, [currentIndex]);

  return (
    <div
      ref={containerRef}
      className="relative rounded-2xl px-6 py-5 select-none"
      style={{
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        height: "168px",        // fixed height — shows exactly 3 lines
        overflowY: "hidden",    // scroll is programmatic only
        fontFamily: "'Fira Mono', 'Courier New', monospace",
        fontSize: "17px",
        lineHeight: "42px",     // consistent measurable line height
        letterSpacing: "0.02em",
        whiteSpace: "pre-wrap", // wraps at spaces, preserves spacing
        wordBreak: "break-word",
      }}
    >
      {targetText.split("").map((ch, i) => {
        const state = charStates[i];
        const isCursor = i === currentIndex;

        let color = "#94a3b8";  // pending — muted grey
        let bg = "transparent";
        if (state === "correct") {
          color = "#1e293b";    // correctly typed — dark
        } else if (state === "incorrect") {
          color = "#ef4444";    // error — red
          bg = "#fef2f2";
        }

        return (
          <span
            key={i}
            ref={isCursor ? cursorRef : null}
            style={{ color, background: bg, position: "relative", borderRadius: "2px" }}
          >
            {isCursor && (
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  top: "6px",
                  bottom: "6px",
                  width: "2px",
                  background: "#2563eb",
                  borderRadius: "2px",
                  animation: "blink 1s step-end infinite",
                }}
              />
            )}
            {ch}
          </span>
        );
      })}

      {/* End-of-text cursor */}
      {currentIndex === targetText.length && (
        <span
          style={{
            display: "inline-block",
            width: "2px",
            height: "22px",
            verticalAlign: "middle",
            background: "#2563eb",
            borderRadius: "2px",
            animation: "blink 1s step-end infinite",
          }}
        />
      )}

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </div>
  );
}