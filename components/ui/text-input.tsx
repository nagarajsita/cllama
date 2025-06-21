"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function PlaceholdersDisplay() {
  const placeholders = [
    "Write a Javascript method to reverse a string.Write a Javascript method to reverse a string.",
    "How to assemble your own PC?",
    "What is the answer to life, the universe, and everything?",
    "How do you exit Vim?",
    "What is the difference between == and === in JavaScript?",
    "Why is the sky blue?",
    "Write a Python function to check for palindromes.",
    "How do you center a div in CSS?",
  ];

  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [placeholders.length]);

  return (
    <div
    className={cn(
      "relative max-w-screen-sm mx-auto bg-gray-800/70 rounded-full h-12 w-full sm:w-[480px]",
      "flex items-center justify-center px-6 transition-all duration-300 ease-in-out",
      "shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),_0px_1px_0px_0px_rgba(25,28,33,0.02),_0px_0px_0px_1px_rgba(25,28,33,0.08)]"
    )}
  >
    <div className="absolute w-full text-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.span
          key={`placeholder-${currentPlaceholder}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="block w-full overflow-hidden whitespace-nowrap text-ellipsis px-4 text-white text-sm sm:text-base font-medium"
        >
          {placeholders[currentPlaceholder]}
        </motion.span>
      </AnimatePresence>
    </div>
  </div>
  
  );
}
