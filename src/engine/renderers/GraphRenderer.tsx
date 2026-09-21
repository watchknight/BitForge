import React from 'react';
import { HighlightRole } from '../../types/simulation';
import { motion } from 'framer-motion';
import { SimulationViewport } from './SimulationViewport';

export interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
}

export interface GraphEdge {
  from: string;
  to: string;
  weight?: number;
  directed?: boolean;
}

interface GraphRendererProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  highlights?: Record<string, HighlightRole>;
  queue?: string[];
  visited?: string[];
  distances?: Record<string, number>;
  activeEdge?: { from: string; to: string } | null;
}

export const GraphRenderer: React.FC<GraphRendererProps> = ({
  nodes,
  edges,
  highlights = {},
  queue = [],
  visited = [],
  distances = {},
  activeEdge,
}) => {
  const NODE_RADIUS = 22;

  // Lookup node by ID
  const nodeMap = new Map<string, GraphNode>();
  nodes.forEach((n) => nodeMap.set(n.id, n));

  const getNodeFill = (role?: HighlightRole) => {
    switch (role) {
      case 'active':
        // "In the forge" — blazing forge flame (single most vivid color)
        return '#f97316';
      case 'comparing':
        // "In the forge" — molten crucible gold
        return '#f59e0b';
      case 'sorted':
        // "Tempered" — cooled blue-steel
        return '#38bdf8';
      case 'visited':
        // "Tempered" — processed / quenched steel
        return '#0284c7';
      case 'danger':
        // "Overheated" — deep desaturated overheated red
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
    // Deep obsidian on glowing orange or gold for WCAG AAA 7.2:1 - 9.6:1 contrast
    if (role === 'active' || role === 'comparing' || role === 'sorted') {
      return '#0c0c0e';
    }
    return '#f5f2eb';
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-2 md:p-6 select-none">
      {/* Top: Graph Canvas with Pan/Zoom & Fit-to-Screen */}
      <SimulationViewport
        contentWidth={560}
        contentHeight={300}
        className="max-w-2xl min-h-[300px]"
      >
        <svg
          width={560}
          height={300}
          viewBox="0 0 560 300"
          className="overflow-visible select-none shrink-0"
        >
          {/* Edges */}
          {edges.map((edge, idx) => {
            const u = nodeMap.get(edge.from);
            const v = nodeMap.get(edge.to);
            if (!u || !v) return null;

            const isEdgeActive =
              (activeEdge?.from === edge.from && activeEdge?.to === edge.to) ||
              (!edge.directed && activeEdge?.from === edge.to && activeEdge?.to === edge.from);

            return (
              <g key={`${edge.from}-${edge.to}-${idx}`}>
                <line
                  x1={u.x}
                  y1={u.y}
                  x2={v.x}
                  y2={v.y}
                  stroke={isEdgeActive ? '#f97316' : '#2e2e33'}
                  strokeWidth={isEdgeActive ? '3.5' : '2'}
                  strokeDasharray={isEdgeActive ? '4 2' : undefined}
                  className="transition-all duration-300"
                />
                {edge.weight !== undefined && (
                  <text
                    x={(u.x + v.x) / 2}
                    y={(u.y + v.y) / 2 - 6}
                    textAnchor="middle"
                    fill="#a39e95"
                    fontSize="11"
                    fontFamily="monospace"
                  >
                    {edge.weight}
                  </text>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const role = highlights[node.id];
            const dist = distances[node.id];

            return (
              <g key={node.id} className="transition-all duration-300">
                {role === 'active' && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={NODE_RADIUS + 6}
                    fill="none"
                    stroke="#fb923c"
                    strokeWidth="2"
                    opacity="0.6"
                    className="animate-ping"
                  />
                )}

                <circle
                  cx={node.x}
                  cy={node.y}
                  r={NODE_RADIUS}
                  fill={getNodeFill(role)}
                  stroke={getNodeStroke(role)}
                  strokeWidth="2.5"
                />

                <text
                  x={node.x}
                  y={node.y + 5}
                  textAnchor="middle"
                  fill={getNodeTextColor(role)}
                  fontSize="14"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {node.label}
                </text>

                {dist !== undefined && (
                  <g>
                    <rect
                      x={node.x + 12}
                      y={node.y - 24}
                      width="20"
                      height="16"
                      rx="4"
                      fill="#0c0c0e"
                      stroke="#ea580c"
                      strokeWidth="1"
                    />
                    <text
                      x={node.x + 22}
                      y={node.y - 12}
                      textAnchor="middle"
                      fill="#fed7aa"
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {dist === Infinity ? '∞' : dist}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </SimulationViewport>

      {/* Bottom: Queue and Visited Panels */}
      <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
        {/* BFS Queue Box */}
        <div className="bg-obsidian-900/90 rounded-lg border border-slate-800 p-3 flex flex-col">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-brand-500"></span>
              Queue (FIFO)
            </span>
            <span className="text-[10px] text-slate-500">Front &larr; Back</span>
          </div>
          <div
            className="flex items-center gap-2 min-h-[38px] p-1.5 bg-obsidian-950 rounded border border-slate-800/80 overflow-x-auto"
            style={{ WebkitOverflowScrolling: 'touch', overscrollBehaviorX: 'contain' }}
          >
            {queue.length === 0 ? (
              <span className="text-xs font-mono text-slate-500 italic px-2">
                Empty Queue
              </span>
            ) : (
              queue.map((item, idx) => (
                <motion.div
                  key={`${item}-${idx}`}
                  layout
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`px-3 py-1 rounded text-xs font-mono font-bold border ${
                    idx === 0
                      ? 'bg-brand-500/20 text-brand-300 border-brand-500/40 ring-1 ring-brand-400/40'
                      : 'bg-obsidian-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {item}
                  {idx === 0 && (
                    <span className="ml-1.5 text-[9px] text-brand-400 uppercase font-sans">
                      Head
                    </span>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Visited Set Box */}
        <div className="bg-obsidian-900/90 rounded-lg border border-slate-800 p-3 flex flex-col">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-steel-400"></span>
              Visited Set
            </span>
            <span className="text-[10px] text-slate-500">{visited.length} total</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 min-h-[38px] p-1.5 bg-obsidian-950 rounded border border-slate-800/80">
            {visited.length === 0 ? (
              <span className="text-xs font-mono text-slate-500 italic px-2">
                None visited yet
              </span>
            ) : (
              visited.map((v) => (
                <span
                  key={v}
                  className="px-2 py-0.5 rounded bg-steel-500/20 text-steel-200 border border-steel-500/40 text-xs font-mono font-bold"
                >
                  {v}
                </span>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
