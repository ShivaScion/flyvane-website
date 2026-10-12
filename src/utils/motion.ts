import { Variants, Transition } from 'framer-motion';

// Google Stitch & Linear-calibrated spring physics
export const stitchSpring = {
  snappy: { type: 'spring', stiffness: 420, damping: 32 } as Transition,
  gentle: { type: 'spring', stiffness: 280, damping: 26 } as Transition,
  float: { type: 'spring', stiffness: 120, damping: 14 } as Transition,
};

export const stitchEase = [0.16, 1, 0.3, 1] as const;

// Section reveal animations
export const fadeInRise: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: stitchEase,
    },
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const cardHoverMotion = {
  rest: { y: 0, scale: 1 },
  hover: {
    y: -4,
    scale: 1.012,
    transition: { duration: 0.25, ease: stitchEase },
  },
};
