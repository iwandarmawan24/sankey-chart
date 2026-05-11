import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useResizeObserver } from '../src/hooks/useResizeObserver';
import { useRef } from 'react';

describe('useResizeObserver', () => {
  it('returns null size initially when no element is attached', () => {
    const { result } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(null);
      return useResizeObserver(ref);
    });
    expect(result.current.size).toBeNull();
  });

  it('returns isTooSmall=false when size is null', () => {
    const { result } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(null);
      return useResizeObserver(ref);
    });
    expect(result.current.isTooSmall).toBe(false);
  });

  it('does not throw when hook is called', () => {
    expect(() => {
      renderHook(() => {
        const ref = useRef<HTMLDivElement>(null);
        return useResizeObserver(ref);
      });
    }).not.toThrow();
  });
});
