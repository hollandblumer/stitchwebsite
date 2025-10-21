// App.jsx
import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import DiagonalStitchesGrow from "./components/DiagonalStitchesGrow";
import DiagonalXScroll from "./components/DiagonalXScroll";
import RotatingImages from "./components/RotatingImages";
import Preloader from "./components/Preloader";
import LoadingText from "./assets/images/loading-stitch-font.png";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const MIN_DURATION = 3000; // 3 seconds
    const start = Date.now();

    const finish = () => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, MIN_DURATION - elapsed);
      setTimeout(() => setLoading(false), remaining);
      document.body.style.overflow = "";
    };

    // preload the loading text asset
    const img = new Image();
    img.onload = finish;
    img.onerror = finish;
    img.src = LoadingText;

    // ensure scroll is locked while loading
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="app">
      <Preloader
        isLoading={loading}
        svgTextSrc={LoadingText}
        svgTextAlt="Your Brand"
        downFromTopVh={50}
        showBackdrop={true}
      />

      <Header />

      <main className="main-content">
        <RotatingImages size={260} speed={60} />
      </main>

      <DiagonalXScroll
        color="#e42014"
        stitch={14}
        thick={3}
        gapX={20}
        margin={28}
        bottomOffset={80}
      />

      {/* Optional */}
      {/* <DiagonalStitchesGrow /> */}
    </div>
  );
}

export default App;
