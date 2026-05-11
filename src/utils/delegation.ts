import type React from 'react';

export function getNodeIdFromEvent(event: React.MouseEvent<SVGElement>): string | null {
  let el: Element | null = event.target as Element;
  while (el && el !== event.currentTarget) {
    const id = el.getAttribute('data-node-id');
    if (id !== null) return id;
    el = el.parentElement;
  }
  return null;
}

export function getLinkIndexFromEvent(event: React.MouseEvent<SVGElement>): number | null {
  let el: Element | null = event.target as Element;
  while (el && el !== event.currentTarget) {
    const idx = el.getAttribute('data-link-index');
    if (idx !== null) {
      const n = parseInt(idx, 10);
      return isNaN(n) ? null : n;
    }
    el = el.parentElement;
  }
  return null;
}
