import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useSankeyLayout } from '../src/hooks/useSankeyLayout';
import type { SankeyData } from '../src/types';

const sampleData: SankeyData = {
  nodes: [
    { id: 'A', label: 'Source A' },
    { id: 'B', label: 'Middle B' },
    { id: 'C', label: 'Target C' },
  ],
  links: [
    { source: 'A', target: 'B', value: 50 },
    { source: 'A', target: 'C', value: 30 },
    { source: 'B', target: 'C', value: 20 },
  ],
};

describe('useSankeyLayout', () => {
  it('returns null when isInteracting is true', () => {
    const { result } = renderHook(() =>
      useSankeyLayout(sampleData, 800, 400, 20, 10, 'justify', true),
    );
    expect(result.current).toBeNull();
  });

  it('returns null when dimensions are zero', () => {
    const { result } = renderHook(() =>
      useSankeyLayout(sampleData, 0, 0, 20, 10, 'justify', false),
    );
    expect(result.current).toBeNull();
  });

  it('returns layout with nodes and links for valid input', () => {
    const { result } = renderHook(() =>
      useSankeyLayout(sampleData, 800, 400, 20, 10, 'justify', false),
    );
    expect(result.current).not.toBeNull();
    expect(result.current?.nodes).toHaveLength(3);
    expect(result.current?.links.length).toBeGreaterThan(0);
  });

  it('computed nodes have position values', () => {
    const { result } = renderHook(() =>
      useSankeyLayout(sampleData, 800, 400, 20, 10, 'justify', false),
    );
    const node = result.current?.nodes[0];
    expect(node).toBeDefined();
    expect(typeof node?.x0).toBe('number');
    expect(typeof node?.x1).toBe('number');
    expect(typeof node?.y0).toBe('number');
    expect(typeof node?.y1).toBe('number');
  });

  it('computed links have path strings', () => {
    const { result } = renderHook(() =>
      useSankeyLayout(sampleData, 800, 400, 20, 10, 'justify', false),
    );
    const link = result.current?.links[0];
    expect(link?.path).toBeTruthy();
    expect(typeof link?.path).toBe('string');
  });

  it('returns empty arrays for empty data', () => {
    const emptyData: SankeyData = { nodes: [], links: [] };
    const { result } = renderHook(() =>
      useSankeyLayout(emptyData, 800, 400, 20, 10, 'justify', false),
    );
    expect(result.current?.nodes).toHaveLength(0);
    expect(result.current?.links).toHaveLength(0);
  });

  it('works with all nodeAlign options', () => {
    const aligns = ['left', 'right', 'center', 'justify'] as const;
    for (const align of aligns) {
      const { result } = renderHook(() =>
        useSankeyLayout(sampleData, 800, 400, 20, 10, align, false),
      );
      expect(result.current).not.toBeNull();
    }
  });
});
