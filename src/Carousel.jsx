import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, animate } from "motion/react";
import "./Carousel.css";

const GAP = 16;
const SPRING = { type: "spring", stiffness: 300, damping: 34 };
const FLICK_VEL = 600;              
const DIST_FRACTION = 0.01;

export default function Carousel({
  items,                               // [{ src, title? }, ...]
  baseWidth = 640,
  baseHeight = 380,
  loop = false,                        // keep false for stability
  index: controlledIndex,              // optional (controlled)
  onIndexChange,                       // optional (controlled)
}) {
  const containerPadding = 16;
  const itemWidth = baseWidth - containerPadding * 2;
  const step = itemWidth + GAP;

  const slides = useMemo(
    () => (loop ? [...items, items[0]] : items),
    [items, loop]
  );
  const slideCount = slides.length;

  // local state when not controlled
  const [uncontrolledIndex, setUncontrolledIndex] = useState(0);
  const isControlled = controlledIndex !== undefined;
  const index = isControlled ? controlledIndex : uncontrolledIndex;

  const x = useMotionValue(0);
  const controlsRef = useRef(null);

  const trackWidth = slideCount * itemWidth + (slideCount - 1) * GAP;
  const leftBound = -(step * (slideCount - 1));

  const setAndNotify = (i) => {
    const clamped = Math.max(0, Math.min(i, slideCount - 1));
    if (!isControlled) setUncontrolledIndex(clamped);
    onIndexChange?.(clamped % items.length);
  };

  // snap to current index after changes
  useEffect(() => {
    controlsRef.current?.stop();
    controlsRef.current = animate(x, -index * step, SPRING);
    return () => controlsRef.current?.stop();
  }, [index, step, x]);

  return (
    <div
      className="carousel-container"
      style={{ width: `${baseWidth}px`, height: `${baseHeight}px` }}
    >
      <motion.div
        className="carousel-track"
        style={{
          x,
          width: `${trackWidth}px`,
          gap: `${GAP}px`,
          touchAction: "pan-y",
        }}
        drag="x"
        dragMomentum={false}
        dragElastic={0}                                // no rubber-band lies
        dragConstraints={{ left: leftBound, right: 0 }}
        onDragStart={() => {
          controlsRef.current?.stop();                 // stop any in-flight snap
        }}
        onDragEnd={(_, info) => {
          const currentX = x.get();                    // actual track position
          const slideAnchor = -index * step;           // where this slide sits
          const delta = currentX - slideAnchor;        // <0 means moved left
          const vx = info.velocity.x;

          let next = index;
          const distThresh = step * DIST_FRACTION;

          if (delta <= -distThresh || vx <= -FLICK_VEL) {
            next = Math.min(index + 1, slideCount - 1);
          } else if (delta >= distThresh || vx >= FLICK_VEL) {
            next = Math.max(index - 1, 0);
          }
          setAndNotify(next);
        }}
      >
        {slides.map((s, i) => (
          <div
            key={i}
            className="carousel-item"
            style={{ width: itemWidth, height: "100%" }}
          >
            <img
              className="carousel-media"
              src={s.src}
              alt={s.title || `slide-${i}`}
              draggable="false"
            />
          </div>
        ))}
      </motion.div>

      <div className="carousel-indicators-container">
        <div className="carousel-indicators">
          {items.map((_, i) => (
            <div
              key={i}
              className={`carousel-indicator ${
                index % items.length === i ? "active" : "inactive"
              }`}
              onClick={() => setAndNotify(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
