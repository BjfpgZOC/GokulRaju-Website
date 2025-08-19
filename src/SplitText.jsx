// src/SplitText.jsx
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText as GSAPSplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, GSAPSplitText);

export default function SplitText({
  text,                          // optional (plain string)
  children,                      // optional (rich JSX)
  rich = false,                  // set true when passing JSX
  className = "",
  delay = 100,
  duration = 0.6,
  ease = "power3.out",
  splitType = "words",           // "words" | "chars" | "lines"
  wordGap = "0em",
  letterGap = "0em",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "-100px",
  textAlign = "left",
  onLetterAnimationComplete,
}) {
  const ref = useRef(null);
  const splitInstance = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // cleanup previous
    splitInstance.current?.revert();
    splitInstance.current = null;

    // Always build lines, words, and chars so spacing works universally
    const s = new GSAPSplitText(el, {
      type: "lines,words,chars",
      wordsClass: "split-word",
      charsClass: "split-char",
      linesClass: "split-line",
      absolute: splitType === "lines",
    });
    splitInstance.current = s;

    const targets =
      splitType === "chars" ? s.chars :
      splitType === "words" ? s.words :
      s.lines;

    if (!targets?.length) return;

    targets.forEach(t => (t.style.willChange = "transform,opacity"));

    const startPct = (1 - threshold) * 100;
    const m = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
    const mv = m ? parseFloat(m[1]) : 0;
    const mu = m ? (m[2] || "px") : "px";
    const start = `top ${startPct}%${mv < 0 ? `-=${Math.abs(mv)}${mu}` : `+=${mv}${mu}`}`;

    const tl = gsap.timeline({
      scrollTrigger: { trigger: el, start, toggleActions: "play none none none", once: true },
      smoothChildTiming: true,
      onComplete: () => {
        gsap.set(targets, { ...to, clearProps: "willChange", immediateRender: true });
        onLetterAnimationComplete?.();
      },
    });

    tl.set(targets, { ...from, immediateRender: false, force3D: true });
    tl.to(targets, { ...to, duration, ease, stagger: delay / 1000, force3D: true });

    return () => {
      tl.kill();
      gsap.killTweensOf(targets);
      splitInstance.current?.revert();
      splitInstance.current = null;
    };
  }, [text, children, rich, delay, duration, ease, splitType, from, to, threshold, rootMargin, onLetterAnimationComplete]);

  // RENDER — rich JSX or plain string
  const baseStyle = {
    textAlign,
    overflow: "hidden",
    display: "inline-block",
    whiteSpace: "normal",
    wordWrap: "break-word",
    // spacing controls via CSS vars
    "--word-gap": wordGap,
    "--letter-gap": letterGap,
  };

  if (rich) {
    return (
      <p ref={ref} className={`split-parent ${className}`} style={baseStyle}>
        {children}
      </p>
    );
  }

  // plain string: support real \n, literal "\n", and &#10;
  const normalized = String(text ?? "").replaceAll("&#10;", "\n");
  const parts = normalized.split(/\r?\n|\\n/);

  return (
    <p ref={ref} className={`split-parent ${className}`} style={baseStyle}>
      {parts.map((seg, i) => (
        <span className="split-block" key={i}>
          {seg}
          {i < parts.length - 1 ? <br /> : null}
        </span>
      ))}
    </p>
  );
}
