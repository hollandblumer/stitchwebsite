import { useEffect, useMemo, useState } from "react";
import logoPath from "../assets/images/stitch-logo.svg";
import LoadingScreen from "../components/Preloader";

const ACCENT = "#e42014",
  PINK = "#f7d6d7",
  CREAM = "#fff9f0",
  TEXT = "#7a1f1a";
const SHOW_LOADER_MS = 1600; // how long to show loader after success

export default function PasswordGate({ children, logo = logoPath }) {
  // stage: "gate" | "loading" | "content"
  const initiallyAuthorized = sessionStorage.getItem("authorized") === "true";
  const [stage, setStage] = useState(initiallyAuthorized ? "content" : "gate");
  const [val, setVal] = useState("");
  const [err, setErr] = useState("");
  const [isNarrow, setIsNarrow] = useState(
    () => window.matchMedia("(max-width: 560px)").matches
  );

  const REQUIRED = useMemo(() => import.meta.env.VITE_SITE_PASSWORD || "", []);

  useEffect(() => {
    if (!REQUIRED) setStage("content");
  }, [REQUIRED]);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 560px)");
    const onChange = (e) => setIsNarrow(e.matches);
    mql.addEventListener?.("change", onChange);
    return () => mql.removeEventListener?.("change", onChange);
  }, []);

  const submit = (e) => {
    e?.preventDefault();
    if (val === REQUIRED) {
      // show loader *now*, then content
      setStage("loading");
      setTimeout(() => {
        sessionStorage.setItem("authorized", "true");
        setStage("content");
      }, SHOW_LOADER_MS);
    } else {
      setErr("Incorrect password");
    }
  };

  if (stage === "loading") return <LoadingScreen />;
  if (stage === "content") return children;

  // stage === "gate"
  const s = styles(isNarrow);
  return (
    <div style={s.page}>
      <form onSubmit={submit} style={s.card} role="dialog" aria-modal="true">
        <img src={logo} alt="What's the Stitch" style={s.logo} />
        <p style={s.subtitle}>enter password to continue</p>

        <div style={s.inputRow}>
          <input
            type="password"
            value={val}
            onChange={(e) => {
              setVal(e.target.value);
              setErr("");
            }}
            placeholder="enter password"
            aria-label="Password"
            inputMode="text"
            style={s.input}
          />
          <button type="submit" style={s.btn}>
            unlock
          </button>
        </div>

        {err && <div style={s.err}>{err}</div>}
        <div style={s.note}>Protected preview — client-side only</div>
      </form>
    </div>
  );
}

const styles = (narrow) => ({
  page: {
    position: "fixed",
    inset: 0,
    display: "grid",
    placeItems: "center",
    background: CREAM,
    zIndex: 99999,
    fontFamily: "Inter, system-ui, -apple-system, 'Helvetica Neue', Arial",
    padding: narrow ? "12px" : "24px",
    overflowY: "auto",
  },
  card: {
    width: narrow ? "100%" : "820px",
    maxWidth: narrow ? "560px" : "92vw",
    padding: narrow ? "28px 20px" : "40px 54px",
    borderRadius: 12,
    background: PINK,
    border: `${narrow ? 4 : 6}px solid ${ACCENT}`,
    boxShadow: `${narrow ? 8 : 12}px ${narrow ? 12 : 18}px 0 ${ACCENT}66`,
    display: "grid",
    gap: narrow ? 14 : 18,
    justifyItems: "center",
    textAlign: "center",
  },
  logo: {
    width: narrow ? 210 : 300,
    maxWidth: "70%",
    height: "auto",
    marginBottom: narrow ? 2 : 4,
    display: "block",
  },
  subtitle: {
    margin: narrow ? "2px 0 10px" : "6px 0 18px",
    color: TEXT,
    fontSize: narrow ? 16 : 20,
  },
  inputRow: {
    width: "100%",
    display: "flex",
    flexDirection: narrow ? "column" : "row",
    gap: narrow ? 12 : 18,
    alignItems: "center",
    justifyContent: "center",
    marginTop: narrow ? 2 : 6,
  },
  input: {
    width: narrow ? "100%" : "56%",
    minWidth: narrow ? "auto" : 220,
    padding: narrow ? "14px 16px" : "18px 22px",
    borderRadius: 40,
    border: `${narrow ? 2 : 3}px dashed ${ACCENT}`,
    background: "#fff0f0",
    fontSize: 18,
    outline: "none",
    color: TEXT,
  },
  btn: {
    width: narrow ? "100%" : "28%",
    minWidth: narrow ? "auto" : 140,
    padding: narrow ? "14px 18px" : "16px 20px",
    borderRadius: 40,
    border: "none",
    background: ACCENT,
    color: "#fff",
    fontWeight: 800,
    fontSize: 16,
    cursor: "pointer",
    boxShadow: `0 4px 0 ${ACCENT}aa`,
    textTransform: "uppercase",
  },
  err: { color: ACCENT, fontSize: 14, marginTop: 6 },
  note: { marginTop: 6, color: "#6b2d2b", fontSize: 13 },
});
