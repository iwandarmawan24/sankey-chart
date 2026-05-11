import { useMemo } from 'react';
import { sankey, sankeyLeft, sankeyRight, sankeyCenter, sankeyJustify } from 'd3-sankey';
import { linkHorizontal } from 'd3-shape';
import type { SankeyData, ComputedNode, ComputedLink, NodeAlign } from '../types';
import type { LayoutResult } from '../types/internal';

const ALIGN_MAP = {
  left: sankeyLeft,
  right: sankeyRight,
  center: sankeyCenter,
  justify: sankeyJustify,
} as const;

interface RawNode {
  id: string;
  label?: string;
  color?: string;
  x0?: number;
  x1?: number;
  y0?: number;
  y1?: number;
  value?: number;
}

interface RawLink {
  source: string | RawNode;
  target: string | RawNode;
  value: number;
  width?: number;
  y0?: number;
  y1?: number;
}

interface SankeyGraph {
  nodes: RawNode[];
  links: RawLink[];
}

// d3-sankey mutates input arrays — types reflect post-layout shape
type SankeyFn = (graph: SankeyGraph) => SankeyGraph;
interface SankeyBuilder extends SankeyFn {
  nodeId: (fn: (d: RawNode) => string) => SankeyBuilder;
  nodeAlign: (fn: (node: RawNode, n: number) => number) => SankeyBuilder;
  nodeWidth: (w: number) => SankeyBuilder;
  nodePadding: (p: number) => SankeyBuilder;
  extent: (ext: [[number, number], [number, number]]) => SankeyBuilder;
}

function toComputedNode(node: RawNode): ComputedNode {
  return {
    id: node.id,
    label: node.label,
    color: node.color,
    x0: node.x0 ?? 0,
    x1: node.x1 ?? 0,
    y0: node.y0 ?? 0,
    y1: node.y1 ?? 0,
    value: node.value ?? 0,
  };
}

function toComputedLink(
  link: RawLink,
  nodeMap: Map<string, ComputedNode>,
): ComputedLink | null {
  const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
  const targetId = typeof link.target === 'string' ? link.target : link.target.id;
  const sourceNode = nodeMap.get(sourceId);
  const targetNode = nodeMap.get(targetId);
  if (!sourceNode || !targetNode) return null;

  const srcObj = link.source as RawNode;
  const tgtObj = link.target as RawNode;

  const pathGen = linkHorizontal<unknown, { x: number; y: number }>()
    .x((d) => d.x)
    .y((d) => d.y);

  const path =
    pathGen({
      source: { x: srcObj.x1 ?? 0, y: link.y0 ?? 0 },
      target: { x: tgtObj.x0 ?? 0, y: link.y1 ?? 0 },
    }) ?? '';

  return {
    source: sourceId,
    target: targetId,
    value: link.value,
    width: link.width ?? 0,
    path,
    sourceNode,
    targetNode,
  };
}

export function useSankeyLayout(
  data: SankeyData,
  width: number,
  height: number,
  nodeWidth: number,
  nodePadding: number,
  nodeAlign: NodeAlign,
  isInteracting: boolean,
): LayoutResult | null {
  return useMemo(() => {
    if (isInteracting || width <= 0 || height <= 0) return null;
    if (data.nodes.length === 0) return { nodes: [], links: [] };

    const inputNodes: RawNode[] = data.nodes.map((n) => ({ ...n }));
    const inputLinks: RawLink[] = data.links.map((l) => ({ ...l }));

    const builder = (sankey as unknown as () => SankeyBuilder)();
    builder
      .nodeId((d) => d.id)
      .nodeAlign(ALIGN_MAP[nodeAlign] as (node: RawNode, n: number) => number)
      .nodeWidth(nodeWidth)
      .nodePadding(nodePadding)
      .extent([[1, 1], [width - 1, height - 1]]);

    let graph: SankeyGraph;
    try {
      graph = builder({ nodes: inputNodes, links: inputLinks });
    } catch {
      return { nodes: [], links: [] };
    }

    const computedNodes = graph.nodes.map(toComputedNode);
    const nodeMap = new Map(computedNodes.map((n) => [n.id, n]));
    const computedLinks = graph.links
      .map((l) => toComputedLink(l, nodeMap))
      .filter((l): l is ComputedLink => l !== null);

    return { nodes: computedNodes, links: computedLinks };
  }, [data, width, height, nodeWidth, nodePadding, nodeAlign, isInteracting]);
}
