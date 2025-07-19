import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

interface ScrollAnimationProps {
  threshold?: number;
  once?: boolean;
  delay?: number;
}

export const useScrollAnimation = ({ threshold = 0.2, once = true, delay = 0 }: ScrollAnimationProps = {}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once,
    margin: `-${Math.floor((1 - threshold) * 100)}% 0px`,
  });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      const timer = setTimeout(() => {
        setHasAnimated(true);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [isInView, delay, hasAnimated]);

  const animationProps = {
    initial: { opacity: 0, y: 30 },
    animate: hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 },
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1], // Custom cubic-bezier for smooth animation
    },
  };

  return { ref, isInView, hasAnimated, animationProps };
}; 