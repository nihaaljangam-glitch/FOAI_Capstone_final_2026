"use client";

import { useState, ReactNode } from "react";
import { AnimatePresence } from "framer-motion";
import LoadingScreen from "./LoadingScreen";

interface AppWrapperProps {
  children: ReactNode;
}

export default function AppWrapper({ children }: AppWrapperProps) {
  const [isLoading, setIsLoading] = useState(true);

  const handleComplete = () => {
    setIsLoading(false);
    // Loader fades out (0.6s) + Page fades in (0.5s) = 1.1s
    setTimeout(() => {
      window.location.href = "http://localhost:5173";
    }, 1100);
  };

  return (
    <div className="relative min-h-screen bg-bg overflow-hidden">
      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingScreen key="loader" onComplete={handleComplete} />
        )}
      </AnimatePresence>

      <main
        style={{
          opacity: isLoading ? 0 : 1,
          transition: "opacity 0.5s ease-out",
        }}
        className="relative z-10"
      >
        {children}
      </main>
    </div>
  );
}
