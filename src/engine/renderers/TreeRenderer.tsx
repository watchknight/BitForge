import React from 'react';
import { HighlightRole } from '../../types/simulation';
import { motion } from 'framer-motion';
import { SimulationViewport } from './SimulationViewport';

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

export const TreeRenderer: React.FC<TreeRendererProps> = ({
  root,
  highlights = {},
  traversalList = [],
  pointers = {},
}) => {
  const WIDTH = 600;
  const HEIGHT = 280;
  const NODE_RADIUS = 20;

  // Calculate layout coordinates recursively
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

  // Collect all lines and nodes for SVG rendering
  const lines: Array<{ x1: number; y1: number; x2: number; y2: number; key: string }> = [];
  const nodesList: PositionedNode[] = [];

  const traverse = (node: PositionedNode | null) => {
    if (!node) return;
    nodesList.push(node);
    if (node.left) {
      lines.push({
        x1: node.x,
        y1: node.y,
        x2: node.left.x,
        y2: node.left.y,
        key: `${node.id}->${node.left.id}`,
      });
      traverse(node.left);
    }
    if (node.right) {
      lines.push({
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

  const getNodeFill = (role?: HighlightRole) => {
    switch (role) {
      case 'active':
        // "In the forge" — blazing forge flame (single most vivid color)
        return '#f97316';
      case 'comparing':
        // "In the forge" — molten crucible gold
        return '#f59e0b';
      case 'sorted':
        // "Tempered" — confirmed sorted/balanced
        return '#38bdf8';
      case 'visited':
        // "Tempered" — traversed node
        return '#0284c7';
      case 'danger':
        // "Overheated" — violation / backtracked node
        return '#c53030';
      default:
        // "Unforged" — raw unworked iron
        return '#1a1c22';
    }
  };

  const getNodeStroke = (role?: HighlightRole) => {
    switch (role) {
      case 'active':
        return '#fb923c';
      case 'comparing':
        return '#fbbf24';
      case 'sorted':
        return '#7dd3fc';
      case 'visited':
        return '#38bdf8';
      case 'danger':
        return '#fca5a5';
      default:
        // "Unforged" — cool muted border
        return '#3d434f';
    }
  };

  const getNodeTextColor = (role?: HighlightRole) => {
    // On solid glowing forge heat/amber, use deep obsidian dark for WCAG AAA 7.2:1 - 9.6:1 contrast
    if (role === 'active' || role === 'comparing') {
      return '#0c0c0e';
    }
    // On tempered blue-steel, dark obsidian gives 7.5:1 contrast
    if (role === 'sorted') {
      return '#0c0c0e';
    }
    // On dark unworked iron or deep quenched visited nodes, use warm bone
    return '#f5f2eb';
  };

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
                stroke="#2e2e33"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            ))}

            {/* Tree nodes */}
            {nodesList.map((n) => {
              const role = highlights[n.id] || highlights[n.val];
              const isHighlighted = !!role;

              return (
                <g key={n.id} className="transition-all duration-300">
                  {/* Outer pulse/glow circle if active or comparing */}
                  {isHighlighted && (
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r={NODE_RADIUS + 5}
                      fill="none"
                      stroke={getNodeStroke(role)}
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
                    fill={getNodeFill(role)}
                    stroke={getNodeStroke(role)}
                    strokeWidth="2.5"
                    className="transition-colors duration-200"
                  />

                  {/* Node label */}
                  <text
                    x={n.x}
                    y={n.y + 5}
                    textAnchor="middle"
                    fill={getNodeTextColor(role)}
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
};
