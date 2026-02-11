"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image"; // If you went back to PNG
// import { logoPaths } from "./LogoData"; // Uncomment if you are using the SVG version

export default function HomeIntro() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Wait for animation (2.2s) then exit
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
          
          // 👇 FIX: Start fully visible (opacity 1) so it covers the page instantly
          initial={{ opacity: 1 }} 
          animate={{ opacity: 1 }}
          
          // Only animate the EXIT (slide up)
          exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
        >
          
          {/* THE LOGO ANIMATION (The "Slam") */}
          <motion.div
            // Start: Big, Invisible, Blurred
            initial={{ scale: 10, opacity: 0, filter: "blur(10px)" }}
            
            // End: Normal size, Visible, Sharp
            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
            
            // Physics
            transition={{ 
                duration: 0.8, 
                ease: "circOut", 
                type: "spring",
                stiffness: 150, 
                damping: 20
            }}
            
            className="relative w-[80vw] h-[50vh] md:w-[60vw] md:h-[60vh]"
          >
             {/* If using the PNG: */}
            <Image 
                src="/sb-logo.png" 
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