import React from 'react';
import type { ComputedNode } from '../types';

interface LabelProps {
  node: ComputedNode;
  opacity: number;
}

export const Label = React.memo(function Label({ node, opacity }: LabelProps) {
  const label = node.label ?? node.id;
  const midY = (node.y0 + node.y1) / 2;

  if (node.y1 - node.y0 < 8) return null;

  const isLeftSide = node.x0 < 50;
  const x = isLeftSide ? node.x1 + 6 : node.x0 - 6;
  const textAnchor = isLeftSide ? 'start' : 'end';

  return (
    <text
      x={x}
      y={midY}
      dy="0.35em"
      textAnchor={textAnchor}
      style={{
        fill: 'var(--sankey-label-color, #333)',
        fontFamily: 'var(--sankey-font, sans-serif)',
        fontSize: '12px',
        pointerEvents: 'none',
        userSelect: 'none',
        opacity,
        transition: 'opacity var(--sankey-transition-duration, 200ms) ease',
      }}
    >
      {label}
    </text>
  );
});
