import { useEffect, useRef, useState, useCallback } from 'react';
import type { ContainerSize } from '../types/internal';

const MIN_WIDTH = 200;
const MIN_HEIGHT = 100;
const DEBOUNCE_MS = 120;

export function useResizeObserver(ref: React.RefObject<HTMLDivElement | null>): {
  size: ContainerSize | null;
  isTooSmall: boolean;
} {
  const [size, setSize] = useState<ContainerSize | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleResize = useCallback((entries: ResizeObserverEntry[]) => {
    const entry = entries[0];
    if (!entry) return;
    const { width, height } = entry.contentRect;

    if (timerRef.current !== null) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setSize({ width: Math.floor(width), height: Math.floor(height) });
    }, DEBOUNCE_MS);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new ResizeObserver(handleResize);
    observer.observe(el);

    const { width, height } = el.getBoundingClientRect();
    if (width > 0 && height > 0) {
      setSize({ width: Math.floor(width), height: Math.floor(height) });
    }

    return () => {
      observer.disconnect();
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    };
  }, [ref, handleResize]);

  const isTooSmall =
    size !== null && (size.width < MIN_WIDTH || size.height < MIN_HEIGHT);

  return { size, isTooSmall };
}
