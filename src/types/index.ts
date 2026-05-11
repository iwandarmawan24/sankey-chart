import type React from 'react';

export type NodeAlign = 'left' | 'right' | 'center' | 'justify';
export type HoverHighlightMode = 'none' | 'connected' | 'cascade';

export interface SankeyNodeInput {
  id: string;
  label?: string;
  color?: string;
}

export interface SankeyLinkInput {
  source: string;
  target: string;
  value: number;
}

export interface SankeyData {
  nodes: SankeyNodeInput[];
  links: SankeyLinkInput[];
}

export interface ComputedNode extends SankeyNodeInput {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
  value: number;
}

export interface ComputedLink extends SankeyLinkInput {
  width: number;
  path: string;
  sourceNode: ComputedNode;
  targetNode: ComputedNode;
}

export interface SankeyChartProps {
  data: SankeyData;
  width?: string | number;
  height?: string | number;
  nodeWidth?: number;
  nodePadding?: number;
  nodeAlign?: NodeAlign;
  colorScheme?: string[] | ((node: ComputedNode) => string);
  animationDuration?: number;
  hoverable?: boolean;
  hoverHighlightMode?: HoverHighlightMode;
  dimOpacity?: number;
  tooltip?: boolean | ((item: ComputedNode | ComputedLink) => React.ReactNode);
  isInteracting?: boolean;
  onNodeClick?: (node: ComputedNode) => void;
  onLinkClick?: (link: ComputedLink) => void;
  onNodeHover?: (node: ComputedNode | null) => void;
  onLinkHover?: (link: ComputedLink | null) => void;
  className?: string;
  style?: React.CSSProperties;
}
