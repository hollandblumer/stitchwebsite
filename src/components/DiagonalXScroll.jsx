// src/DiagonalXScroll.jsx
import { useEffect, useRef } from "react";
import p5 from "p5";

export default function DiagonalXScroll({
  bg = "#ffd4d6",
  color = "#e42014",
  stitch = 14, // tip-to-tip per stroke (smaller X)
  thick = 3, // stroke width
  gapX = 20, // horizontal spacing between X centers
  margin = 28, // side padding
  bottomOffset = 80, // distance from bottom of viewport
}) {
  const hostRef = useRef(null);
  const p5Ref = useRef(null);

  useEffect(() => {
    const sketch = (s) => {
      let STITCH = stitch;
      let THICK = thick;
      let GAPX = gapX;
      let MARGIN = margin;
      let BOTTOM = bottomOffset;

      s.setup = () => {
        const c = s.createCanvas(s.windowWidth, s.windowHeight);
        // Make the canvas fixed + non-interactive like your HTML version
        c.elt.style.position = "fixed";
        c.elt.style.inset = "0";
        c.elt.style.display = "block";
        c.elt.style.pointerEvents = "none";
        s.noLoop();
        window.addEventListener("scroll", onScroll, { passive: true });
      };

      s.windowResized = () => {
        s.resizeCanvas(s.windowWidth, s.windowHeight);
        s.redraw();
      };

      function onScroll() {
        s.redraw();
      }

      s.draw = () => {
        // remove this:
        // s.background(bg);

        // instead, clear canvas (keeps transparency)
        s.clear();

        s.stroke(color);
        s.strokeWeight(THICK);
        s.strokeCap(s.ROUND);

        const half = STITCH * 0.5;
        const stepX = STITCH + GAPX;
        const stepY = stepX * 0.5; // preserves 45° relation

        // two rows near the bottom
        const baseY = s.height - BOTTOM;
        const row1Y = baseY - stepY / 2;
        const row2Y = baseY + stepY / 2;

        // columns that fit across
        const maxCols = Math.ceil((s.width - 2 * MARGIN) / stepX) + 2;

        // scroll progress -> fraction (0.20..1.00)
        const scrollMax =
          document.documentElement.scrollHeight - s.windowHeight;
        const t = scrollMax > 0 ? window.scrollY / scrollMax : 0;
        const frac = s.constrain(0.2 + 0.8 * t, 0.2, 1.0);

        // discrete column reveal (one X at a time)
        const minCols = Math.max(1, Math.floor(maxCols * 0.2));
        const targetCols = Math.max(minCols, Math.floor(frac * maxCols));

        drawRow(row1Y, 0, stepX, half, targetCols);
        drawRow(row2Y, stepX * 0.5, stepX, half, targetCols);

        function drawRow(y, xOffset, stepX, half, cols) {
          let x = MARGIN + xOffset;
          for (let i = 0; i < cols; i++) {
            drawX(x, y, half);
            x += stepX;
          }
        }

        function drawX(cx, cy, half) {
          s.line(cx - half, cy - half, cx + half, cy + half);
          s.line(cx - half, cy + half, cx + half, cy - half);
        }
      };

      // Keyboard live tweaks (optional)
      s.keyPressed = () => {
        if (s.key === "[") {
          STITCH = Math.max(6, STITCH - 2);
          s.redraw();
        }
        if (s.key === "]") {
          STITCH += 2;
          s.redraw();
        }
        if (s.key === "1") {
          GAPX = Math.max(4, GAPX - 2);
          s.redraw();
        }
        if (s.key === "2") {
          GAPX += 2;
          s.redraw();
        }
      };

      s.remove = (() => {
        // Patch p5's remove to also remove our scroll listener
        const orig = s.remove.bind(s);
        return () => {
          window.removeEventListener("scroll", onScroll);
          orig();
        };
      })();
    };

    p5Ref.current = new p5(sketch, hostRef.current);
    return () => {
      if (p5Ref.current) {
        p5Ref.current.remove();
        p5Ref.current = null;
      }
    };
  }, [bg, color, stitch, thick, gapX, margin, bottomOffset]);

  // host div just anchors the p5 instance (canvas is fixed to viewport)
  return <div ref={hostRef} />;
}
