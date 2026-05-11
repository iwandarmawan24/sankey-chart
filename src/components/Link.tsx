import React from 'react';
import type { ComputedLink } from '../types';

interface LinkProps {
  link: ComputedLink;
  index: number;
  color: string;
  opacity: number;
}

export const Link = React.memo(function Link({ link, index, color, opacity }: LinkProps) {
  return (
    <path
      data-link-index={index}
      d={link.path}
      fill="none"
      stroke={color}
      strokeWidth={Math.max(1, link.width)}
      style={{
        opacity,
        transition: 'opacity var(--sankey-transition-duration, 200ms) ease',
        cursor: 'pointer',
        strokeOpacity: 'var(--sankey-link-opacity, 0.5)' as unknown as number,
      }}
    />
  );
});
