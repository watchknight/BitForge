/**
 * BitForge Graph & Network Visualizer: `GraphRenderer`
 * 
 * SVG canvas visualizer for directed, undirected, and weighted graph networks
 * (Breadth-First Search, Depth-First Search, Dijkstra, Prim's, Topological Sort).
 * 
 * FEATURES:
 * 1. Node & Edge Canvas: Renders vertex coordinates with directional arrow markers,
 *    weight pills, and shortest path highlighting.
 * 2. Auxiliary Frontier Panels: Displays real-time BFS Queue (FIFO) or DFS Stack
 *    and visited set tracking below the main network stage.
 * 3. Unified Semantic Styling: Uses `getSvgNodeTheme` for node circles, rings, and labels.
 */

import React, { useMemo } from 'react';
import { HighlightRole } from '../../types/simulation';
import { motion } from 'framer-motion';
import { SimulationViewport } from './SimulationViewport';
import { useTheme } from '../../context/ThemeContext';
import { getSvgNodeTheme } from '../semanticThemes';

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

const GRAPH_NODE_RADIUS = 22;

export const GraphRenderer: React.FC<GraphRendererProps> = React.memo(({
  nodes,
  edges,
  highlights = {},
  queue = [],
  visited = [],
  distances = {},
  activeEdge,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const NODE_RADIUS = GRAPH_NODE_RADIUS;

  // Memoize node lookup map
  const nodeMap = useMemo(() => {
    const map = new Map<string, GraphNode>();
    nodes.forEach((n) => map.set(n.id, n));
    return map;
  }, [nodes]);

  const getNodeColors = (role?: HighlightRole) => getSvgNodeTheme(role, isLight);


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
                  stroke={isEdgeActive ? (isLight ? '#c2410c' : '#f97316') : (isLight ? '#d6cebf' : '#2e2e33')}
                  strokeWidth={isEdgeActive ? '3.5' : '2'}
                  strokeDasharray={isEdgeActive ? '4 2' : undefined}
                  className="transition-all duration-300"
                />
                {edge.weight !== undefined && (
                  <text
                    x={(u.x + v.x) / 2}
                    y={(u.y + v.y) / 2 - 6}
                    textAnchor="middle"
                    fill={isLight ? '#57534e' : '#a39e95'}
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
                    stroke={isLight ? '#c2410c' : '#fb923c'}
                    strokeWidth="2"
                    opacity="0.6"
                    className="animate-ping"
                  />
                )}

                {(() => {
                  const colors = getNodeColors(role);
                  return (
                    <>
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={NODE_RADIUS}
                        fill={colors.fill}
                        stroke={colors.stroke}
                        strokeWidth="2.5"
                      />

                      <text
                        x={node.x}
                        y={node.y + 5}
                        textAnchor="middle"
                        fill={colors.text}
                        fontSize="14"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        {node.label}
                      </text>
                    </>
                  );
                })()}

                {dist !== undefined && (
                  <g>
                    <rect
                      x={node.x + 12}
                      y={node.y - 24}
                      width="20"
                      height="16"
                      rx="4"
                      fill={isLight ? '#ffffff' : '#0c0c0e'}
                      stroke={isLight ? '#c2410c' : '#ea580c'}
                      strokeWidth="1"
                    />
                    <text
                      x={node.x + 22}
                      y={node.y - 12}
                      textAnchor="middle"
                      fill={isLight ? '#9a3412' : '#fed7aa'}
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
                      ? isLight
                        ? 'bg-brand-500/15 text-brand-800 border-brand-500/40 ring-1 ring-brand-500/40'
                        : 'bg-brand-500/20 text-brand-300 border-brand-500/40 ring-1 ring-brand-400/40'
                      : isLight
                      ? 'bg-white text-slate-700 border-slate-300'
                      : 'bg-obsidian-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {item}
                  {idx === 0 && (
                    <span className={`ml-1.5 text-[9px] uppercase font-sans ${isLight ? 'text-brand-700' : 'text-brand-400'}`}>
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
                  className={`px-2 py-0.5 rounded text-xs font-mono font-bold border ${
                    isLight
                      ? 'bg-steel-500/15 text-steel-800 border-steel-500/30'
                      : 'bg-steel-500/20 text-steel-200 border-steel-500/40'
                  }`}
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
});
