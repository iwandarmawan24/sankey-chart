import React from 'react';
import type { ComputedNode } from '../types';

interface NodeProps {
  node: ComputedNode;
  color: string;
  opacity: number;
}

export const Node = React.memo(function Node({ node, color, opacity }: NodeProps) {
  return (
    <rect
      data-node-id={node.id}
      x={node.x0}
      y={node.y0}
      width={node.x1 - node.x0}
      height={Math.max(1, node.y1 - node.y0)}
      fill={color}
      style={{
        opacity,
        transition: 'opacity var(--sankey-transition-duration, 200ms) ease',
        cursor: 'pointer',
        stroke: 'var(--sankey-node-hover-stroke, none)',
      }}
    />
  );
});
