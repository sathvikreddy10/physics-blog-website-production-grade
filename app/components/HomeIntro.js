"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
// 👇 IMPORT: This is the cache-buster. 
// It ensures the browser sees the new .jpeg and doesn't look at the old deleted .png
import SBLogo from "./sb-logo.jpeg"; 

export default function HomeIntro() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-main"
          initial={{ opacity: 1 }} 
          animate={{ opacity: 1 }}
          exit={{ y: "-100%", transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } }}
        >
          
          <motion.div
            initial={{ scale: 10, opacity: 0, filter: "blur(5px)" }}
            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
            transition={{ 
                duration: 0.6, 
                ease: "circOut", 
                type: "spring",
                stiffness: 150, 
                damping: 20
            }}
            className="relative w-[80vw] h-[50vh] md:w-[60vw] md:h-[60vh]"
          >
            {/* 👇 UPDATED: Using the imported SBLogo object */}
            <Image 
                src={SBLogo} 
                alt="SB Logo"
                fill
                className="object-contain"
                priority
            />
          </motion.div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}