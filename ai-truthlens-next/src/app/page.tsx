"use client";

import AppWrapper from "@/components/AppWrapper";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <AppWrapper>
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="space-y-6"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display italic text-text">
            TruthLens
          </h1>
          <p className="max-w-2xl mx-auto text-muted text-lg md:text-xl tracking-wide uppercase leading-relaxed">
            Unveiling the authentic narrative through advanced analytical synthesis.
          </p>
          <div className="pt-8">
            <a 
              href="http://localhost:5173/playground" 
              className="inline-block px-8 py-3 bg-text text-bg rounded-full font-medium hover:scale-105 transition-transform"
            >
              EXPLORE CASE STUDIES
            </a>
          </div>
        </motion.div>
        
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-12 text-[10px] tracking-[0.4em] text-muted/50 uppercase">
          <span>Est. 2024</span>
          <span>Tokyo & London</span>
          <span>All Rights Reserved</span>
        </div>
      </div>
    </AppWrapper>
  );
}
