import React from 'react';
import { motion } from 'framer-motion';
import { useAccessibility } from '../../context/AccessibilityContext';

interface TextRevealProps {
  children: string | React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'div' | 'span';
  delay?: number;
  stagger?: number;
  duration?: number;
}

export const TextReveal: React.FC<TextRevealProps> = ({
  children,
  className = '',
  as: Component = 'div',
  delay = 0,
  stagger = 0.08,
  duration = 0.9,
}) => {
  const { reducedMotion } = useAccessibility();

  if (typeof children !== 'string') {
    if (reducedMotion) {
      return <Component className={className}>{children}</Component>;
    }
    return (
      <div className="overflow-hidden">
        <motion.div
          initial={{ y: '105%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration,
            delay,
            ease: [0.16, 1, 0.3, 1], // cinematic smooth ease-out
          }}
          className={className}
        >
          {children}
        </motion.div>
      </div>
    );
  }

  // Split string into words for staggered kinetic reveal
  const words = children.split(' ');

  if (reducedMotion) {
    return <Component className={className}>{children}</Component>;
  }

  return (
    <Component className={`flex flex-wrap ${className}`}>
      {words.map((word, idx) => (
        <span key={idx} className="overflow-hidden inline-block mr-[0.26em] pb-1">
          <motion.span
            initial={{ y: '110%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration,
              delay: delay + idx * stagger,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{ willChange: 'transform, opacity' }}
            className="inline-block"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Component>
  );
};

interface LineRevealProps {
  lines: (string | React.ReactNode)[];
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'div';
  delay?: number;
  lineDelay?: number;
}

export const LineReveal: React.FC<LineRevealProps> = ({
  lines,
  className = '',
  as: Component = 'div',
  delay = 0,
  lineDelay = 0.15,
}) => {
  const { reducedMotion } = useAccessibility();

  return (
    <Component className={`space-y-1.5 ${className}`}>
      {lines.map((line, idx) => {
        if (reducedMotion) {
          return <div key={idx}>{line}</div>;
        }

        return (
          <div key={idx} className="overflow-hidden">
            <motion.div
              initial={{ y: '110%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.95,
                delay: delay + idx * lineDelay,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{ willChange: 'transform, opacity' }}
            >
              {line}
            </motion.div>
          </div>
        );
      })}
    </Component>
  );
};
