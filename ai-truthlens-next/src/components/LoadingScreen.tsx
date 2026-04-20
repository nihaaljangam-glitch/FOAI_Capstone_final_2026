"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
  onComplete: () => void;
}

const words = ["Design", "Create", "Inspire"];

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [wordIndex, setWordIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const onCompleteRef = useRef(onComplete);

  // Keep the latest callback ref to avoid stale closures
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Handle words cycling
  useEffect(() => {
    const wordInterval = setInterval(() => {
      setWordIndex((prev) => {
        if (prev < words.length - 1) {
          return prev + 1;
        }
        clearInterval(wordInterval);
        return prev;
      });
    }, 900);

    return () => clearInterval(wordInterval);
  }, []);

  // Handle progress counter and completion
  useEffect(() => {
    let startTime: number;
    let animationFrameId: number;

    const DURATION = 2700;

    const updateProgress = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      
      const nextProgress = Math.min((elapsed / DURATION) * 100, 100);
      setProgress(nextProgress);

      if (elapsed < DURATION) {
        animationFrameId = requestAnimationFrame(updateProgress);
      } else {
        // When progress reaches 100: Wait 400ms, then call onComplete
        setTimeout(() => {
          onCompleteRef.current();
        }, 400);
      }
    };

    animationFrameId = requestAnimationFrame(updateProgress);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className="fixed inset-0 z-[9999] bg-bg"
    >
      {/* Element 1: "Portfolio" Label */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="absolute top-8 left-8 md:top-12 md:left-12 text-xs md:text-sm text-muted uppercase tracking-[0.3em]"
      >
        Portfolio
      </motion.div>

      {/* Element 2: Rotating Words */}
      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={wordIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="text-4xl md:text-6xl lg:text-7xl font-display italic text-text/80"
          >
            {words[wordIndex]}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Element 3: Counter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="absolute bottom-8 right-8 md:bottom-12 md:right-12 text-6xl md:text-8xl lg:text-9xl font-display text-text tabular-nums"
      >
        {Math.round(progress).toString().padStart(3, "0")}
      </motion.div>

      {/* Element 4: Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-stroke/50">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: progress / 100 }}
          transition={{ duration: 0.1, ease: "linear" }}
          className="h-full origin-left"
          style={{
            background: "linear-gradient(90deg, #89AACC 0%, #4E85BF 100%)",
            boxShadow: "0 0 8px rgba(137, 170, 204, 0.35)"
          }}
        />
      </div>
    </motion.div>
  );
}
