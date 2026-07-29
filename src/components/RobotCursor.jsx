import { useState, useEffect } from 'react';
import { motion, useMotionValue } from 'framer-motion';

const RobotCursor = () => {
  const [isMobile, setIsMobile] = useState(true);
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);

  // Mouse Coordinates (Raw Motion Values for instant tracking with ZERO delay)
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  useEffect(() => {
    // 1. Detect if desktop / fine pointer device
    const mediaQuery = window.matchMedia('(pointer: fine)');
    setIsMobile(!mediaQuery.matches);

    const listener = (e) => setIsMobile(!e.matches);
    mediaQuery.addEventListener('change', listener);

    // 2. Track mouse position instantly
    const moveCursor = (e) => {
      // Offset: width is 22px, so X offset is -11px to center the antenna bulb at the cursor point
      mouseX.set(e.clientX - 11);
      mouseY.set(e.clientY - 2);
    };

    // 3. Track hover states
    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target) return;

      const isClickable =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[role="button"]') ||
        window.getComputedStyle(target).cursor === 'pointer';

      setIsHoveringClickable(!!isClickable);
    };

    // 4. Track mouse click states
    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      mediaQuery.removeEventListener('change', listener);
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [mouseX, mouseY]);

  useEffect(() => {
    if (isMobile) return;

    // Enable custom cursor styles globally by adding class to body
    document.body.classList.add('custom-cursor-active');

    return () => {
      document.body.classList.remove('custom-cursor-active');
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <>
      {/* Global CSS to hide default cursor */}
      <style>{`
        body.custom-cursor-active,
        body.custom-cursor-active * {
          cursor: none !important;
        }
      `}</style>

      {/* Main Small Robot Head Cursor (positioned instantly, no outer ring, no delay) */}
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
        }}
        animate={{
          scale: isMouseDown ? 0.85 : isHoveringClickable ? 1.2 : 1,
          rotate: isHoveringClickable ? 10 : 0,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="fixed top-0 left-0 pointer-events-none z-[10000] drop-shadow-[0_2px_5px_rgba(13,138,188,0.25)]"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Antenna */}
          <rect x="11" y="1" width="2" height="4" rx="0.5" fill="#0D8ABC" />
          <motion.circle
            cx="12"
            cy="1"
            r="1.5"
            animate={{
              fill: isHoveringClickable ? '#F97316' : '#38BDF8',
            }}
          />

          {/* Ears */}
          <rect x="2" y="9" width="1" height="6" rx="0.5" fill="#0A6C94" />
          <rect x="21" y="9" width="1" height="6" rx="0.5" fill="#0A6C94" />

          {/* Head Body */}
          <motion.rect
            x="4"
            y="5"
            width="16"
            height="14"
            rx="3.5"
            animate={{
              fill: '#0D8ABC',
              stroke: isHoveringClickable ? '#38BDF8' : '#ffffff',
            }}
            strokeWidth="1.25"
          />

          {/* Visor Screen */}
          <rect x="6" y="7.5" width="12" height="4.5" rx="1.5" fill="#0F172A" />

          {/* Eyes */}
          <motion.circle
            cx="9"
            cy="9.5"
            r="1"
            animate={{
              fill: isHoveringClickable ? '#F97316' : '#38BDF8',
              scaleY: [1, 1, 0.1, 1, 1], // Blink animation
            }}
            transition={{
              repeat: Infinity,
              repeatDelay: 4,
              duration: 0.25,
            }}
          />
          <motion.circle
            cx="15"
            cy="9.5"
            r="1"
            animate={{
              fill: isHoveringClickable ? '#F97316' : '#38BDF8',
              scaleY: [1, 1, 0.1, 1, 1], // Blink animation
            }}
            transition={{
              repeat: Infinity,
              repeatDelay: 4,
              duration: 0.25,
            }}
          />

          {/* Mouth Grid */}
          <rect x="9" y="14" width="6" height="1.5" rx="0.5" fill="#0F172A" />
          <motion.line
            x1="10.5"
            y1="14.75"
            x2="13.5"
            y2="14.75"
            animate={{
              stroke: isHoveringClickable ? '#F97316' : '#38BDF8',
              strokeWidth: 0.5,
            }}
          />
        </svg>
      </motion.div>
    </>
  );
};

export default RobotCursor;
