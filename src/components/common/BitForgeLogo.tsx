import React from 'react';

interface BitForgeLogoProps {
  className?: string;
  size?: number;
}

/**
 * BitForgeLogo: Canonical Data Structures & Algorithms brand emblem.
 * Features an iconic binary tree / graph topology with root, child nodes,
 * connecting branches, and a central traversal link.
 */
export const BitForgeLogo: React.FC<BitForgeLogoProps> = ({
  className = 'w-5 h-5',
  size,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Binary Tree & Graph Edges */}
      <path d="M12 4.5L5.5 16.5M12 4.5L18.5 16.5" />
      <path d="M8 16.5H16" strokeWidth="1.8" strokeDasharray="2 1.5" />
      {/* Central Traversal / Pivot Node */}
      <circle cx="12" cy="11.5" r="1.5" fill="currentColor" stroke="none" />
      {/* Root Node (Top) */}
      <circle cx="12" cy="4.5" r="2.8" fill="currentColor" />
      {/* Left Child Node */}
      <circle cx="5.5" cy="16.5" r="2.8" fill="currentColor" />
      {/* Right Child Node */}
      <circle cx="18.5" cy="16.5" r="2.8" fill="currentColor" />
    </svg>
  );
};
