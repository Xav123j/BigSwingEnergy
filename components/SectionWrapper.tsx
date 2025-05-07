'use client';

import React, { ReactNode, useEffect, useState, ForwardedRef } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  id?: string;
  // Allow passing custom variants or using default
  customVariants?: Variants;
  once?: boolean; // To trigger animation only once
  // Allow passing additional props to the motion.section component
  [key: string]: any; 
}

const defaultVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.5, 
      ease: 'easeOut', 
      staggerChildren: 0.1 // Optional: if children also have motion
    }
  }
};

const SectionWrapper = React.forwardRef<HTMLElement, SectionWrapperProps>(
  ({ children, className = '', id, customVariants, once = true, ...otherProps }, ref) => {
    const prefersReducedMotion = usePrefersReducedMotion();
    const [motionLib, setMotionLib] = useState<{ motion: typeof motion, AnimatePresence: typeof AnimatePresence } | null>(null);

    // Dynamically import framer-motion
    useEffect(() => {
      import('framer-motion').then(lib => setMotionLib(lib));
    }, []);

    // ref for this component's own useInView hook
    const { ref: internalInViewRef, inView } = useInView({
      triggerOnce: once,
      threshold: 0.2, // Adjust threshold as needed (percentage of element in view)
    });

    // Combine the internal ref for useInView and the forwarded ref from the parent
    const combinedRef = (node: HTMLElement | null) => {
      internalInViewRef(node);
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    const variantsToUse = customVariants || defaultVariants;

    if (prefersReducedMotion || !motionLib) {
      // Render static content if reduced motion is preferred or library not loaded
      return (
        <section id={id} className={className} ref={combinedRef} {...otherProps}>
          {children}
        </section>
      );
    }

    const { motion: m } = motionLib; // Destructure motion for cleaner use

    return (
      <m.section
        id={id}
        ref={combinedRef} // Apply the combined ref here
        className={className}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'} // inView is from this component's internal hook
        variants={variantsToUse}
        exit="hidden" // Optional: if you want an exit animation when it leaves view (if triggerOnce is false)
        {...otherProps}
      >
        {children}
      </m.section>
    );
  }
);

SectionWrapper.displayName = 'SectionWrapper';
export default SectionWrapper; 