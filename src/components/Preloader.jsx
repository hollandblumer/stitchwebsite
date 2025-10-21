import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "../styles/preloader.scss";

export default function Preloader({
  isLoading = true,
  svgTextSrc,
  svgTextAlt = "Loading Title",
  strandSrc = "https://assets.codepen.io/9259849/red-strand.svg",
  yarnSrc = "https://assets.codepen.io/9259849/yarn-2.svg",
  downFromTopVh = 65, // how far down you want the loader’s center
  showBackdrop = true,
}) {
  const [visible, setVisible] = useState(isLoading);
  const [out, setOut] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setOut(true);
      const t = setTimeout(() => {
        setVisible(false);
        setOut(false);
      }, 300); // fade-out to match CSS
      return () => clearTimeout(t);
    } else {
      setVisible(true);
    }
  }, [isLoading]);

  if (!visible) return null;

  const node = (
    <div
      className={`preloader ${showBackdrop ? "with-backdrop" : ""} ${
        out ? "preloader--out" : ""
      }`}
    >
      <div
        className="loader"
        style={{ top: `${downFromTopVh}vh` }} // vertical position control
        role="status"
        aria-live="polite"
      >
        {/* Optional title image above the strand */}
        {svgTextSrc ? (
          <img className="svg-text" src={svgTextSrc} alt={svgTextAlt} />
        ) : null}

        {/* Your original rollout + yarn (same rhythm) */}
        <div
          className="rollout"
          style={{ backgroundImage: `url(${strandSrc})` }}
        >
          <img src={yarnSrc} className="yarn" alt="" aria-hidden="true" />
        </div>
      </div>
    </div>
  );

  return createPortal(node, document.body);
}
