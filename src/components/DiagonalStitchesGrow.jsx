// components/DiagonalStitchesGrow.jsx
import { useEffect, useRef } from "react";

export default function DiagonalStitchesGrow({
  bg = "#ffd4d6",
  color = "#e42014",
  stitch = 14, // X size
  thick = 3, // stroke width
  gapX = 20, // “tap 2 once”
  margin = 28, // side padding
  heightPx = 180, // a bit taller to be obvious
  minVisibleCols = 4, // always show some Xs
  growWindowPx = 800, // horizontal growth completes over this scroll distance
  debug = true, // turn on to see logs & outline
}) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const progressRef = useRef(0); // 0..1

  // Helper: get absolute page Y of element
  const pageY = (el) => {
    let y = 0;
    while (el) {
      y += el.offsetTop;
      el = el.offsetParent;
    }
    return y;
  };

  // Progress: 0 when viewport bottom reaches the top of the section.
  // Grows to 1 after you scroll another `growWindowPx`.
  const calcProgress = () => {
    const el = wrapRef.current;
    if (!el) return 0;
    const topPage = pageY(el);
    const viewportBottom = window.scrollY + window.innerHeight;
    const delta = viewportBottom - topPage; // how far we’ve “covered” the section
    const p = delta / Math.max(1, growWindowPx);
    return Math.max(0, Math.min(1, p));
  };

  const draw = () => {
    const cv = canvasRef.current;
    const el = wrapRef.current;
    if (!cv || !el) return;

    const ctx = cv.getContext("2d");
    const dpr = Math.max(1, window.devicePixelRatio || 1);

    // Size canvas to CSS box
    const { width: cssW, height: cssH } = el.getBoundingClientRect();
    const w = Math.max(1, Math.round(cssW * dpr));
    const h = Math.max(1, Math.round(cssH * dpr));
    if (cv.width !== w || cv.height !== h) {
      cv.width = w;
      cv.height = h;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Background
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, cssW, cssH);

    // Geometry
    const stepX = stitch + gapX; // horizontal distance between X centers
    const stepY = stepX * 0.5; // lock 45° alignment
    const half = stitch * 0.5;

    const centerY = cssH * 0.5;
    const row1Y = centerY - stepY * 0.5;
    const row2Y = centerY + stepY * 0.5;

    // Columns based on progress
    const progress = progressRef.current; // 0..1
    const usableW = Math.max(0, cssW - margin * 2);
    const maxCols = Math.max(1, Math.floor(usableW / stepX) + 1);
    const cols = Math.min(
      maxCols,
      Math.max(minVisibleCols, Math.floor(maxCols * Math.max(0.08, progress)))
    );

    const totalSpan = (cols - 1) * stepX;
    const startX = cssW * 0.5 - totalSpan * 0.5;

    // Draw
    ctx.lineCap = "round";
    ctx.strokeStyle = color;
    ctx.lineWidth = thick;

    // Row 1
    for (let i = 0; i < cols; i++) {
      const x = startX + i * stepX;
      if (x < margin || x > cssW - margin) continue;
      drawX(ctx, x, row1Y, half);
    }
    // Row 2 (stagger for diagonal)
    for (let i = 0; i < cols; i++) {
      const x = startX + i * stepX + stepX * 0.5;
      if (x < margin || x > cssW - margin) continue;
      drawX(ctx, x, row2Y, half);
    }

    if (debug) {
      // progress bar overlay (tiny, at top-left)
      ctx.fillStyle = "rgba(0,0,0,0.15)";
      ctx.fillRect(8, 8, 120, 6);
      ctx.fillStyle = "rgba(0,0,0,0.55)";
      ctx.fillRect(8, 8, 120 * progress, 6);
    }
  };

  const drawX = (ctx, cx, cy, half) => {
    ctx.beginPath();
    ctx.moveTo(cx - half, cy - half);
    ctx.lineTo(cx + half, cy + half);
    ctx.moveTo(cx - half, cy + half);
    ctx.lineTo(cx + half, cy - half);
    ctx.stroke();
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onScrollOrResize = () => {
      progressRef.current = calcProgress();
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(() => {
          rafRef.current = 0;
          draw();
        });
      }
    };

    // FIRST PAINT: ensure we draw even before any scroll
    progressRef.current = calcProgress();
    onScrollOrResize();

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    bg,
    color,
    stitch,
    thick,
    gapX,
    margin,
    heightPx,
    minVisibleCols,
    growWindowPx,
    debug,
  ]);

  return (
    <div
      ref={wrapRef}
      style={{
        width: "100%",
        height: `${heightPx}px`,
        background: bg,
        position: "relative",
        outline: debug ? "1px dashed #888" : "none",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
