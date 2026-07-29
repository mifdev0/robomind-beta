import { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';

/**
 * ScrollProgressBar component
 * Displays a sleek glowing progress bar at the very top of the page.
 */
export const ScrollProgressBar = () => {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      style={{ scaleX: scrollYProgress }}
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-teal-400 origin-left z-[100] shadow-lg shadow-primary-500/20"
    />
  );
};

/**
 * ScrollToTopButton component
 * A floating button that displays circular scroll progress and smoothly scrolls to top on click.
 */
export const ScrollToTopButton = () => {
  const { scrollYProgress } = useScroll();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setShowScrollTop(latest > 0.08); // Show after scrolling down 8% of the page
  });

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.6, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 30 }}
          whileHover={{ scale: 1.1, y: -4 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleScrollToTop}
          className="fixed bottom-6 right-6 z-40 p-1.5 rounded-full bg-white dark:bg-slate-800 text-gray-800 dark:text-white shadow-2xl border border-gray-100 dark:border-slate-700/80 cursor-pointer flex items-center justify-center group focus:outline-none focus:ring-2 focus:ring-primary-500/30"
          aria-label="Scroll to top"
        >
          <svg className="w-12 h-12 transform -rotate-90">
            {/* Background Circle */}
            <circle
              cx="24"
              cy="24"
              r="20"
              className="stroke-gray-100 dark:stroke-slate-700 fill-none"
              strokeWidth="3.5"
            />
            {/* Animated Progress Circle */}
            <motion.circle
              cx="24"
              cy="24"
              r="20"
              className="stroke-primary-500 fill-none"
              strokeWidth="3.5"
              strokeLinecap="round"
              style={{ pathLength: scrollYProgress }}
            />
          </svg>
          {/* Inner Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <ChevronUp className="w-5 h-5 text-primary-500 group-hover:-translate-y-1 transition-transform duration-300" />
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

/**
 * ScrollReveal component
 * Wraps content to reveal it with beautiful animations when it enters the viewport.
 */
export const ScrollReveal = ({
  children,
  animation = 'fade-up',
  duration = 0.8,
  delay = 0,
  threshold = 0.1,
  once = true,
  className = ''
}) => {
  const getVariants = () => {
    switch (animation) {
      case 'fade-up':
        return {
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0 }
        };
      case 'fade-down':
        return {
          hidden: { opacity: 0, y: -50 },
          visible: { opacity: 1, y: 0 }
        };
      case 'fade-left':
        return {
          hidden: { opacity: 0, x: 50 },
          visible: { opacity: 1, x: 0 }
        };
      case 'fade-right':
        return {
          hidden: { opacity: 0, x: -50 },
          visible: { opacity: 1, x: 0 }
        };
      case 'scale-up':
        return {
          hidden: { opacity: 0, scale: 0.85 },
          visible: { opacity: 1, scale: 1 }
        };
      case 'scale-down':
        return {
          hidden: { opacity: 0, scale: 1.15 },
          visible: { opacity: 1, scale: 1 }
        };
      case 'rotate-in':
        return {
          hidden: { opacity: 0, rotate: -5, y: 40 },
          visible: { opacity: 1, rotate: 0, y: 0 }
        };
      default:
        return {
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0 }
        };
    }
  };

  const variants = getVariants();

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: threshold }}
      transition={{
        type: 'spring',
        stiffness: 70,
        damping: 15,
        duration: duration,
        delay: delay
      }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
};
