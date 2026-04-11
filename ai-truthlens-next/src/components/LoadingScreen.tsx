"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface LoadingScreenProps {
  onComplete: () => void;
}

const WORDS = ["Detect", "Reveal", "Trust"];
const DURATION_COUNTER = 2700; // 2.7 seconds
const INTERVAL_WORDS = 900; // 0.9 seconds
const FINAL_DELAY = 400; // 400ms after 100%

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const onCompleteRef = useRef(onComplete);

  // Update ref to avoid stale closure
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Counter Logic
  useEffect(() => {
    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const nextProgress = Math.min((elapsed / DURATION_COUNTER) * 100, 100);
      
      setProgress(nextProgress);

      if (nextProgress < 100) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Word Rotation Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => {
        if (prev < WORDS.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, INTERVAL_WORDS);

    return () => clearInterval(interval);
  }, []);

  // Completion Logic
  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => {
        onCompleteRef.current();
      }, FINAL_DELAY);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-bg"
      exit={{ opacity: 0, pointerEvents: "none" }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Element 1: "Ai-truthlens" Label (Top-Left) */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="absolute top-8 left-8 md:top-12 md:left-12 text-xs md:text-sm text-muted uppercase tracking-[0.3em]"
      >
        Ai-truthlens
      </motion.div>

      {/* Element 2: Rotating Words (Center) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.span
            key={wordIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="text-4xl md:text-6xl lg:text-7xl font-display italic text-text/80"
          >
            {WORDS[wordIndex]}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Element 3: Counter (Bottom-Right) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="absolute bottom-8 right-8 md:bottom-12 md:right-12 text-6xl md:text-8xl lg:text-9xl font-display text-text tabular-nums"
      >
        {Math.round(progress).toString().padStart(3, "0")}
      </motion.div>

      {/* Element 4: Progress Bar (Bottom Edge) */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-stroke/50">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: progress / 100 }}
          transition={{ duration: 0.1, ease: "linear" }}
          className="h-full origin-left bg-gradient-to-r from-[#89AACC] to-[#4E85BF] shadow-[0_0_8px_rgba(137,170,204,0.35)]"
        />
      </div>
    </motion.div>
  );
}
