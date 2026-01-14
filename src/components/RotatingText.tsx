import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface RotatingTextProps {
  words: string[];
  className?: string;
  interval?: number;
}

const RotatingText: React.FC<RotatingTextProps> = ({ 
  words, 
  className = '',
  interval = 2500 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, interval);

    return () => clearInterval(timer);
  }, [words.length, interval]);

  return (
    <div className={`relative inline-flex items-center overflow-hidden ${className}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1],
          }}
          className="text-primary font-semibold"
        >
          {words[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

export default RotatingText;
