import type { SankeyNode, SankeyLink } from 'd3-sankey';
import type { SankeyNodeInput, SankeyLinkInput } from './index';

export type D3SankeyNode = SankeyNode<SankeyNodeInput, SankeyLinkInput>;
export type D3SankeyLink = SankeyLink<SankeyNodeInput, SankeyLinkInput>;

export interface HoverState {
  hoveredNodeId: string | null;
  hoveredLinkIndex: number | null;
}

export interface LayoutResult {
  nodes: import('./index').ComputedNode[];
  links: import('./index').ComputedLink[];
}

export interface ContainerSize {
  width: number;
  height: number;
}
