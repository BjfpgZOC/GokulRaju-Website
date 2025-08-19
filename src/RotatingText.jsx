"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { motion, AnimatePresence } from "motion/react";
import "./RotatingText.css";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const RotatingText = forwardRef((props, ref) => {
  const {
    texts,
    // character motion
    transition = { type: "spring", damping: 22, stiffness: 320 },
    initial = { y: "100%", opacity: 0 },
    animate = { y: 0, opacity: 1 },
    exit = { y: "-120%", opacity: 0 },

    // layout/presence
    animatePresenceMode = "popLayout",      // was "wait"
    animatePresenceInitial = false,
    rotationInterval = 2000,

    // staggering
    staggerDuration = 0.03,
    staggerFrom = "last",

    loop = true,
    auto = true,
    splitBy = "words",
    onNext,
    mainClassName,
    splitLevelClassName,
    elementLevelClassName,
    ...rest
  } = props;

  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  // Spring for the pill’s width/height changes (bouncy + smooth)
  const layoutSpring = useMemo(
    () => ({
      layout: {
        type: "spring",
        stiffness: 220,
        damping: 18,
        mass: 0.7,
        bounce: 0.4, // overshoot
      },
      ...transition, // for the letters
    }),
    [transition]
  );

  const splitIntoCharacters = (text) => {
    if (typeof Intl !== "undefined" && Intl.Segmenter) {
      const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
      return Array.from(segmenter.segment(text), (s) => s.segment);
    }
    return Array.from(text);
  };

  const elements = useMemo(() => {
    const currentText = texts[currentTextIndex];

    if (splitBy === "characters") {
      const words = currentText.split(" ");
      return words.map((word, i) => ({
        characters: splitIntoCharacters(word),
        needsSpace: i !== words.length - 1,
      }));
    }
    if (splitBy === "words") {
      return currentText.split(" ").map((word, i, arr) => ({
        characters: [word],
        needsSpace: i !== arr.length - 1,
      }));
    }
    if (splitBy === "lines") {
      return currentText.split("\n").map((line, i, arr) => ({
        characters: [line],
        needsSpace: i !== arr.length - 1,
      }));
    }
    return currentText.split(splitBy).map((part, i, arr) => ({
      characters: [part],
      needsSpace: i !== arr.length - 1,
    }));
  }, [texts, currentTextIndex, splitBy]);

  const getStaggerDelay = useCallback(
    (index, totalChars) => {
      if (staggerFrom === "first") return index * staggerDuration;
      if (staggerFrom === "last") return (totalChars - 1 - index) * staggerDuration;
      if (staggerFrom === "center") {
        const c = Math.floor(totalChars / 2);
        return Math.abs(c - index) * staggerDuration;
      }
      if (staggerFrom === "random") {
        const r = Math.floor(Math.random() * totalChars);
        return Math.abs(r - index) * staggerDuration;
      }
      return Math.abs(staggerFrom - index) * staggerDuration;
    },
    [staggerFrom, staggerDuration]
  );

  const handleIndexChange = useCallback(
    (newIndex) => {
      setCurrentTextIndex(newIndex);
      onNext?.(newIndex);
    },
    [onNext]
  );

  const next = useCallback(() => {
    const end = texts.length - 1;
    const ni = currentTextIndex === end ? (loop ? 0 : end) : currentTextIndex + 1;
    if (ni !== currentTextIndex) handleIndexChange(ni);
  }, [currentTextIndex, texts.length, loop, handleIndexChange]);

  const previous = useCallback(() => {
    const end = texts.length - 1;
    const pi = currentTextIndex === 0 ? (loop ? end : 0) : currentTextIndex - 1;
    if (pi !== currentTextIndex) handleIndexChange(pi);
  }, [currentTextIndex, texts.length, loop, handleIndexChange]);

  const jumpTo = useCallback(
    (i) => {
      const vi = Math.max(0, Math.min(i, texts.length - 1));
      if (vi !== currentTextIndex) handleIndexChange(vi);
    },
    [texts.length, currentTextIndex, handleIndexChange]
  );

  const reset = useCallback(() => {
    if (currentTextIndex !== 0) handleIndexChange(0);
  }, [currentTextIndex, handleIndexChange]);

  useImperativeHandle(ref, () => ({ next, previous, jumpTo, reset }), [next, previous, jumpTo, reset]);

  useEffect(() => {
    if (!auto) return;
    const id = setInterval(next, rotationInterval);
    return () => clearInterval(id);
  }, [next, rotationInterval, auto]);

  return (
    <motion.span
      className={cn("text-rotate", mainClassName)}
      {...rest}
      layout
      style={{ transformOrigin: "50% 50%" }}
      transition={layoutSpring}
    >
      <span className="text-rotate-sr-only">{texts[currentTextIndex]}</span>

      <AnimatePresence mode={animatePresenceMode} initial={animatePresenceInitial}>
        <motion.span
          key={currentTextIndex}
          // Shared layoutId gives buttery size morph between phrases
          layout
          layoutId="rt-pill-shape"
          className={cn(splitBy === "lines" ? "text-rotate-lines" : "text-rotate")}
          aria-hidden="true"
          transition={layoutSpring}
          style={{ display: "inline-flex" }}
        >
          {elements.map((wordObj, wordIndex, array) => {
            const total = array.reduce((s, w) => s + w.characters.length, 0);
            const prevChars = array.slice(0, wordIndex).reduce((s, w) => s + w.characters.length, 0);
            return (
              <motion.span
                key={wordIndex}
                className={cn("text-rotate-word", splitLevelClassName)}
                layout
                transition={layoutSpring}
              >
                {wordObj.characters.map((char, charIndex) => (
                  <motion.span
                    key={charIndex}
                    initial={initial}
                    animate={animate}
                    exit={exit}
                    transition={{ ...transition, delay: getStaggerDelay(prevChars + charIndex, total) }}
                    className={cn("text-rotate-element", elementLevelClassName)}
                  >
                    {char}
                  </motion.span>
                ))}
                {wordObj.needsSpace && <span className="text-rotate-space"> </span>}
              </motion.span>
            );
          })}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  );
});

RotatingText.displayName = "RotatingText";
export default RotatingText;
