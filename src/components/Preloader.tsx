import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

interface PreloaderProps {
  onComplete: () => void;
}

const CUBIC_EASE = [0.76, 0, 0.24, 1] as const;

const PRELOADER_WORDS = [
  "Hello", "Namaste", "Bonjour", "Konnichiwa", "Ciao", "Flyvane"
];

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [index, setIndex] = useState(0);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    setDimension({ width: window.innerWidth, height: window.innerHeight });
    document.body.style.overflow = 'hidden';

    const handleResize = () => {
      setDimension({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Hard fallback: never allow preloader to trap page or leave overflow hidden for more than 2200ms
    const safetyTimer = setTimeout(() => {
      document.body.style.overflow = '';
      setIsExiting(true);
      onComplete();
    }, 2200);

    return () => clearTimeout(safetyTimer);
  }, [onComplete]);

  useEffect(() => {
    if (index === PRELOADER_WORDS.length - 1) {
      const exitTimeout = setTimeout(() => {
        setIsExiting(true);
      }, 350);
      return () => clearTimeout(exitTimeout);
    }

    const timer = setTimeout(() => {
      setIndex(prev => prev + 1);
    }, index === 0 ? 300 : 160);

    return () => clearTimeout(timer);
  }, [index]);

  const w = dimension.width || 1000;
  const h = dimension.height || 800;

  // Dennis Snellenberg Cubic Bezier Path Morphing:
  // Initial: Flat bottom hanging below container
  const initialPath = `M0 0 L${w} 0 L${w} ${h} Q${w / 2} ${h} 0 ${h}  L0 0`;
  // Target: Dramatic downward convex curve pulling down by 300px as curtain lifts
  const targetPath = `M0 0 L${w} 0 L${w} ${h} Q${w / 2} ${h + 300} 0 ${h}  L0 0`;
  // Final: Flat line once curtain clears top
  const exitPath = `M0 0 L${w} 0 L${w} ${h} Q${w / 2} ${h} 0 ${h}  L0 0`;

  const curveVariants: Variants = {
    initial: {
      d: initialPath,
      transition: { duration: 0.7, ease: CUBIC_EASE }
    },
    exit: {
      d: [initialPath, targetPath, exitPath],
      transition: { duration: 0.85, times: [0, 0.45, 1], ease: CUBIC_EASE }
    }
  };

  const slideUpVariants: Variants = {
    initial: {
      top: 0,
    },
    exit: {
      top: "-100vh",
      transition: { duration: 0.85, ease: CUBIC_EASE, delay: 0.05 }
    }
  };

  return (
    <AnimatePresence onExitComplete={() => {
      document.body.style.overflow = '';
      onComplete();
    }}>
      {!isExiting && (
        <motion.div
          variants={slideUpVariants}
          initial="initial"
          exit="exit"
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#050608] select-none"
        >
          {/* Word presentation */}
          <div className="relative z-20 text-center px-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-[11px] uppercase font-mono tracking-[0.25em] text-neutral-400">
                System Initializing // Automation Core
              </span>
            </div>
            <motion.h1
              key={index}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="text-4xl sm:text-6xl md:text-7xl font-display font-extrabold text-white tracking-tight min-h-[90px] flex items-center justify-center"
            >
              {PRELOADER_WORDS[index]}
            </motion.h1>
            <p className="text-[11px] font-mono text-neutral-500 mt-4 tracking-widest">
              [ AUTOMATE THE BORING // MARKET THE BRILLIANT ]
            </p>
          </div>

          {/* Dennis Snellenberg Hanging Morphing SVG Curve */}
          {dimension.width > 0 && (
            <svg
              className="absolute top-0 left-0 w-full pointer-events-none fill-[#050608] overflow-visible z-10"
              style={{ height: 'calc(100% + 300px)' }}
            >
              <motion.path
                variants={curveVariants}
                initial="initial"
                exit="exit"
              />
            </svg>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default Preloader;
