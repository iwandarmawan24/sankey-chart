import { useState, useCallback } from 'react';
import type { HoverState } from '../types/internal';

export function useHoverState(): {
  hoverState: HoverState;
  setHoveredNodeId: (id: string | null) => void;
  setHoveredLinkIndex: (index: number | null) => void;
  clearHover: () => void;
} {
  const [hoverState, setHoverState] = useState<HoverState>({
    hoveredNodeId: null,
    hoveredLinkIndex: null,
  });

  const setHoveredNodeId = useCallback((id: string | null) => {
    setHoverState({ hoveredNodeId: id, hoveredLinkIndex: null });
  }, []);

  const setHoveredLinkIndex = useCallback((index: number | null) => {
    setHoverState({ hoveredNodeId: null, hoveredLinkIndex: index });
  }, []);

  const clearHover = useCallback(() => {
    setHoverState({ hoveredNodeId: null, hoveredLinkIndex: null });
  }, []);

  return { hoverState, setHoveredNodeId, setHoveredLinkIndex, clearHover };
}
