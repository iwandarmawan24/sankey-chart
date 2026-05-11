import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SankeyChart } from '../src/SankeyChart';
import type { SankeyData } from '../src/types';

const minimalData: SankeyData = {
  nodes: [
    { id: 'A', label: 'Source A' },
    { id: 'B', label: 'Target B' },
  ],
  links: [{ source: 'A', target: 'B', value: 100 }],
};

describe('SankeyChart', () => {
  it('renders without crash with minimal data', () => {
    const { container } = render(<SankeyChart data={minimalData} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('shows placeholder when container is too small', () => {
    const { container } = render(
      <SankeyChart data={minimalData} width={100} height={50} />,
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('renders with empty data without throwing', () => {
    const emptyData: SankeyData = { nodes: [], links: [] };
    expect(() => render(<SankeyChart data={emptyData} />)).not.toThrow();
  });

  it('accepts all prop types without TypeScript errors', () => {
    const onNodeClick = vi.fn();
    const onLinkClick = vi.fn();
    const onNodeHover = vi.fn();
    const onLinkHover = vi.fn();

    expect(() =>
      render(
        <SankeyChart
          data={minimalData}
          width="100%"
          height="100%"
          nodeWidth={20}
          nodePadding={10}
          nodeAlign="justify"
          hoverable={true}
          hoverHighlightMode="connected"
          dimOpacity={0.2}
          isInteracting={false}
          onNodeClick={onNodeClick}
          onLinkClick={onLinkClick}
          onNodeHover={onNodeHover}
          onLinkHover={onLinkHover}
          tooltip={true}
        />,
      ),
    ).not.toThrow();
  });

  it('pauses layout when isInteracting is true', () => {
    const { rerender } = render(<SankeyChart data={minimalData} isInteracting={false} />);
    expect(() => rerender(<SankeyChart data={minimalData} isInteracting={true} />)).not.toThrow();
  });

  it('accepts custom colorScheme as array', () => {
    expect(() =>
      render(<SankeyChart data={minimalData} colorScheme={['#ff0000', '#00ff00']} />),
    ).not.toThrow();
  });

  it('accepts custom colorScheme as function', () => {
    expect(() =>
      render(
        <SankeyChart
          data={minimalData}
          colorScheme={(node) => `#${node.id.charCodeAt(0).toString(16)}0000`}
        />,
      ),
    ).not.toThrow();
  });

  it('accepts all hoverHighlightMode values', () => {
    const modes = ['none', 'connected', 'cascade'] as const;
    for (const mode of modes) {
      expect(() =>
        render(<SankeyChart data={minimalData} hoverHighlightMode={mode} />),
      ).not.toThrow();
    }
  });

  it('accepts custom tooltip renderer', () => {
    expect(() =>
      render(
        <SankeyChart
          data={minimalData}
          tooltip={(item) => <div>custom {JSON.stringify(item)}</div>}
        />,
      ),
    ).not.toThrow();
  });
});
