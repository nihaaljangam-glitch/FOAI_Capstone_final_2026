"use client";

import { useState, ReactNode } from "react";
import { AnimatePresence } from "framer-motion";
import LoadingScreen from "./LoadingScreen";

interface AppWrapperProps {
  children: ReactNode;
}

export default function AppWrapper({ children }: AppWrapperProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative min-h-screen bg-bg">
      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingScreen key="loader" onComplete={() => setIsLoading(false)} />
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
