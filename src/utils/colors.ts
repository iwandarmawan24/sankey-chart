import type { ComputedNode } from '../types';

const DEFAULT_PALETTE = [
  '#4e79a7',
  '#f28e2b',
  '#e15759',
  '#76b7b2',
  '#59a14f',
  '#edc948',
  '#b07aa1',
  '#ff9da7',
  '#9c755f',
  '#bab0ac',
];

export function resolveNodeColor(
  node: ComputedNode,
  index: number,
  colorScheme: string[] | ((node: ComputedNode) => string) | undefined,
): string {
  if (node.color) return node.color;
  if (typeof colorScheme === 'function') return colorScheme(node);
  const palette = Array.isArray(colorScheme) && colorScheme.length > 0 ? colorScheme : DEFAULT_PALETTE;
  return palette[index % palette.length];
}
