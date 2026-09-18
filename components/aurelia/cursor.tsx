"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { MoveHorizontal } from "lucide-react";

type CursorTarget = HTMLElement & { dataset: DOMStringMap };

export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [cursorText, setCursorText] = useState("");
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const ringX = useSpring(cursorX, { stiffness: 150, damping: 15 });
  const ringY = useSpring(cursorY, { stiffness: 150, damping: 15 });

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)");
    if (coarse.matches) return;
    setEnabled(true);

    const updateTarget = (target: EventTarget | null) => {
      const element =
        target instanceof HTMLElement
          ? (target.closest(
              "a, button, [data-cursor-hover]",
            ) as CursorTarget | null)
          : null;
      setHovered(Boolean(element));
      setCursorText(element?.dataset.cursorText ?? "");
    };
    const onMove = (event: MouseEvent) => {
      cursorX.set(event.clientX);
      cursorY.set(event.clientY);
      updateTarget(event.target);
    };
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, [cursorX, cursorY]);

  if (!enabled) return null;
  const ringSize = hovered ? 70 : 44;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[100] hidden md:block"
    >
      <motion.div
        className="fixed left-0 top-0 flex items-center justify-center rounded-full border border-white/40 bg-transparent mix-blend-difference shadow-[0_0_20px_rgba(255,255,255,0.35)]"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: ringSize,
          height: ringSize,
          scale: pressed ? 0.85 : 1,
          borderColor: hovered
            ? "rgba(255, 255, 255, 1)"
            : "rgba(255, 255, 255, 0.4)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {hovered &&
          (cursorText === "SCROLL" ? (
            <MoveHorizontal
              size={14}
              strokeWidth={1.5}
              className="text-white"
            />
          ) : (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="font-sans text-[10px] tracking-[0.1em] text-white"
            >
              {cursorText}
            </motion.span>
          ))}
      </motion.div>
      <motion.div
        className="fixed left-0 top-0 h-2 w-2 rounded-full bg-white mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{ opacity: hovered ? 0 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />
    </div>
  );
}

export function CursorHoverProps({
  text,
  children,
}: {
  text: string;
  children: React.ReactNode;
}) {
  return (
    <span data-cursor-hover data-cursor-text={text}>
      {children}
    </span>
  );
}
