import React from 'react';
import type { ComputedNode, ComputedLink } from '../types';

interface TooltipProps {
  item: ComputedNode | ComputedLink;
  x: number;
  y: number;
  render?: (item: ComputedNode | ComputedLink) => React.ReactNode;
}

function isComputedNode(item: ComputedNode | ComputedLink): item is ComputedNode {
  return 'x0' in item;
}

export function Tooltip({ item, x, y, render }: TooltipProps) {
  const content = render ? (
    render(item)
  ) : isComputedNode(item) ? (
    <div>
      <strong>{item.label ?? item.id}</strong>
      <div>Value: {item.value}</div>
    </div>
  ) : (
    <div>
      <div>
        {item.source} → {item.target}
      </div>
      <div>Value: {item.value}</div>
    </div>
  );

  return (
    <div
      style={{
        position: 'fixed',
        left: x + 12,
        top: y - 8,
        background: 'rgba(0,0,0,0.75)',
        color: '#fff',
        borderRadius: 4,
        padding: '6px 10px',
        fontSize: 12,
        pointerEvents: 'none',
        zIndex: 9999,
        whiteSpace: 'nowrap',
      }}
    >
      {content}
    </div>
  );
}
