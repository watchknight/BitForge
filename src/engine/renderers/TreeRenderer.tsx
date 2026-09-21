/**
 * BitForge Hierarchical Tree Visualizer: `TreeRenderer`
 * 
 * SVG canvas renderer for tree data structures and recursive tree traversals
 * (Binary Search Tree, AVL Tree, Red-Black Tree, Inorder, Preorder, Postorder).
 * 
 * FEATURES:
 * 1. Recursive Layout Algorithm: Computes balanced (x, y) coordinates based on
 *    depth and sub-tree boundary intervals.
 * 2. Connecting Branch Lines: Renders directional SVG lines between parent and children.
 * 3. Unified Semantic Styling: Delegates fill, stroke, and text styling to `getSvgNodeTheme`.
 * 4. Interactive Pan/Zoom Viewport: Encapsulated within `SimulationViewport` with pinch/zoom.
 */

import React, { useMemo } from 'react';
import { HighlightRole } from '../../types/simulation';
import { motion } from 'framer-motion';
import { SimulationViewport } from './SimulationViewport';
import { useTheme } from '../../context/ThemeContext';
import { getSvgNodeTheme } from '../semanticThemes';

export interface TreeNode {
  id: string | number;
  val: number | string;
  left?: TreeNode | null;
  right?: TreeNode | null;
}

interface TreeRendererProps {
  root: TreeNode | null;
  highlights?: Record<string | number, HighlightRole>;
  traversalList?: Array<number | string>;
  pointers?: Record<string, string | number>;
}

interface PositionedNode {
  id: string | number;
  val: number | string;
  x: number;
  y: number;
  left?: PositionedNode | null;
  right?: PositionedNode | null;
}

const WIDTH = 600;
const HEIGHT = 280;
const NODE_RADIUS = 20;

export const TreeRenderer: React.FC<TreeRendererProps> = React.memo(({
  root,
  highlights = {},
  traversalList = [],
  pointers = {},
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  // Memoize tree layout geometry and SVG line coordinates
  const { positionedRoot, nodesList, lines } = useMemo(() => {
    const layoutTree = (
      node: TreeNode | null,
      depth: number = 0,
      minX: number = 20,
      maxX: number = WIDTH - 20
    ): PositionedNode | null => {
      if (!node) return null;

      const x = (minX + maxX) / 2;
      const y = 40 + depth * 65;

      return {
        id: node.id,
        val: node.val,
        x,
        y,
        left: layoutTree(node.left ?? null, depth + 1, minX, x),
        right: layoutTree(node.right ?? null, depth + 1, x, maxX),
      };
    };

    const positionedRoot = layoutTree(root);
    const linesArr: Array<{ x1: number; y1: number; x2: number; y2: number; key: string }> = [];
    const list: PositionedNode[] = [];

    const traverse = (node: PositionedNode | null) => {
      if (!node) return;
      list.push(node);
      if (node.left) {
        linesArr.push({
          x1: node.x,
          y1: node.y,
          x2: node.left.x,
          y2: node.left.y,
          key: `${node.id}->${node.left.id}`,
        });
        traverse(node.left);
      }
      if (node.right) {
        linesArr.push({
          x1: node.x,
          y1: node.y,
          x2: node.right.x,
          y2: node.right.y,
          key: `${node.id}->${node.right.id}`,
        });
        traverse(node.right);
      }
    };

    traverse(positionedRoot);
    return { positionedRoot, nodesList: list, lines: linesArr };
  }, [root]);

  const getNodeColors = (role?: HighlightRole) => getSvgNodeTheme(role, isLight);

  return (
    <div className="w-full flex flex-col items-center justify-center p-2 md:p-6 select-none">
      {/* SVG Canvas for Tree with Pan/Zoom & Fit-to-Screen */}
      <SimulationViewport
        contentWidth={WIDTH}
        contentHeight={HEIGHT}
        className="max-w-2xl min-h-[300px]"
      >
        {!positionedRoot ? (
          <div className="h-48 flex items-center justify-center text-slate-500 font-mono text-sm">
            Empty Tree (NULL)
          </div>
        ) : (
          <svg
            width={WIDTH}
            height={HEIGHT}
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="overflow-visible select-none shrink-0"
          >
            {/* Tree branches/edges */}
            {lines.map((l) => (
              <line
                key={l.key}
                x1={l.x1}
                y1={l.y1}
                x2={l.x2}
                y2={l.y2}
                stroke={isLight ? '#cbbfad' : '#2e2e33'}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            ))}

            {/* Tree nodes */}
            {nodesList.map((n) => {
              const role = highlights[n.id] || highlights[n.val];
              const isHighlighted = !!role;
              const colors = getNodeColors(role);

              return (
                <g key={n.id} className="transition-all duration-300">
                  {/* Outer pulse/glow circle if active or comparing */}
                  {isHighlighted && (
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r={NODE_RADIUS + 5}
                      fill="none"
                      stroke={colors.stroke}
                      strokeWidth="2"
                      opacity="0.6"
                      className="animate-ping"
                    />
                  )}

                  {/* Main node circle */}
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={NODE_RADIUS}
                    fill={colors.fill}
                    stroke={colors.stroke}
                    strokeWidth="2.5"
                    className="transition-colors duration-200"
                  />

                  {/* Node label */}
                  <text
                    x={n.x}
                    y={n.y + 5}
                    textAnchor="middle"
                    fill={colors.text}
                    fontSize="13"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {n.val}
                  </text>
                </g>
              );
            })}
          </svg>
        )}
      </SimulationViewport>

      {/* In-Order Traversal sequence bar if present with momentum horizontal scrolling */}
      {traversalList.length > 0 && (
        <div className="mt-4 w-full max-w-xl flex flex-col items-center">
          <div className="text-xs font-mono text-slate-400 mb-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-steel-400"></span>
            <span>In-Order Traversal Visited Stream:</span>
          </div>
          <div className="w-full overflow-x-auto pb-1" style={{ WebkitOverflowScrolling: 'touch', overscrollBehaviorX: 'contain' }}>
            <div className="flex items-center justify-start sm:justify-center gap-2 p-2 bg-obsidian-950 rounded-lg border border-slate-800 min-w-max">
              {traversalList.map((val, idx) => (
                <motion.div
                  key={idx}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="px-2.5 py-1 rounded bg-steel-500/20 text-steel-200 border border-steel-500/40 text-xs font-mono font-bold shrink-0"
                >
                  {val}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
