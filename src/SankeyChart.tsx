import React, { useRef, useCallback, useState } from 'react';
import type { SankeyChartProps, ComputedNode, ComputedLink } from './types';
import { useResizeObserver } from './hooks/useResizeObserver';
import { useSankeyLayout } from './hooks/useSankeyLayout';
import { useHoverState } from './hooks/useHoverState';
import { Node } from './components/Node';
import { Link } from './components/Link';
import { Label } from './components/Label';
import { Tooltip } from './components/Tooltip';
import { resolveNodeColor } from './utils/colors';
import { getNodeIdFromEvent, getLinkIndexFromEvent } from './utils/delegation';
import {
  buildNodeConnectivity,
  buildLinkConnectivity,
  buildCascadeConnectivity,
} from './utils/connectivity';

export function SankeyChart({
  data,
  width = '100%',
  height = '100%',
  nodeWidth = 20,
  nodePadding = 10,
  nodeAlign = 'justify',
  colorScheme,
  hoverable = true,
  hoverHighlightMode = 'connected',
  dimOpacity = 0.15,
  tooltip = false,
  isInteracting = false,
  onNodeClick,
  onLinkClick,
  onNodeHover,
  onLinkHover,
  className,
  style,
}: SankeyChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { size, isTooSmall } = useResizeObserver(containerRef);
  const { hoverState, setHoveredNodeId, setHoveredLinkIndex, clearHover } = useHoverState();
  const [tooltipData, setTooltipData] = useState<{
    item: ComputedNode | ComputedLink;
    x: number;
    y: number;
  } | null>(null);

  const layout = useSankeyLayout(
    data,
    size?.width ?? 0,
    size?.height ?? 0,
    nodeWidth,
    nodePadding,
    nodeAlign,
    isInteracting || size === null,
  );

  const nodeColorMap = React.useMemo(() => {
    if (!layout) return new Map<string, string>();
    return new Map(layout.nodes.map((n, i) => [n.id, resolveNodeColor(n, i, colorScheme)]));
  }, [layout, colorScheme]);

  const connectivity = React.useMemo(() => {
    if (!layout || (!hoverState.hoveredNodeId && hoverState.hoveredLinkIndex === null)) return null;
    const { links } = layout;
    if (hoverState.hoveredNodeId) {
      const fn = hoverHighlightMode === 'cascade' ? buildCascadeConnectivity : buildNodeConnectivity;
      return fn(hoverState.hoveredNodeId, links);
    }
    if (hoverState.hoveredLinkIndex !== null) {
      return buildLinkConnectivity(hoverState.hoveredLinkIndex, links);
    }
    return null;
  }, [layout, hoverState, hoverHighlightMode]);

  const getNodeOpacity = useCallback(
    (nodeId: string) => {
      if (!hoverable || hoverHighlightMode === 'none' || !connectivity) return 1;
      return connectivity.connectedNodeIds.has(nodeId) ? 1 : dimOpacity;
    },
    [hoverable, hoverHighlightMode, connectivity, dimOpacity],
  );

  const getLinkOpacity = useCallback(
    (linkIndex: number) => {
      if (!hoverable || hoverHighlightMode === 'none' || !connectivity) return 1;
      return connectivity.connectedLinkIndices.has(linkIndex) ? 1 : dimOpacity;
    },
    [hoverable, hoverHighlightMode, connectivity, dimOpacity],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGElement>) => {
      if (!hoverable || !layout) return;

      const nodeId = getNodeIdFromEvent(e);
      if (nodeId !== null) {
        if (hoverState.hoveredNodeId !== nodeId) {
          setHoveredNodeId(nodeId);
          const node = layout.nodes.find((n) => n.id === nodeId) ?? null;
          onNodeHover?.(node);
        }
        if (tooltip) {
          const node = layout.nodes.find((n) => n.id === nodeId);
          if (node) setTooltipData({ item: node, x: e.clientX, y: e.clientY });
        }
        return;
      }

      const linkIndex = getLinkIndexFromEvent(e);
      if (linkIndex !== null) {
        if (hoverState.hoveredLinkIndex !== linkIndex) {
          setHoveredLinkIndex(linkIndex);
          onLinkHover?.(layout.links[linkIndex] ?? null);
        }
        if (tooltip) {
          const link = layout.links[linkIndex];
          if (link) setTooltipData({ item: link, x: e.clientX, y: e.clientY });
        }
        return;
      }

      if (hoverState.hoveredNodeId !== null || hoverState.hoveredLinkIndex !== null) {
        clearHover();
        onNodeHover?.(null);
        onLinkHover?.(null);
        setTooltipData(null);
      }
    },
    [
      hoverable,
      layout,
      hoverState,
      setHoveredNodeId,
      setHoveredLinkIndex,
      clearHover,
      onNodeHover,
      onLinkHover,
      tooltip,
    ],
  );

  const handleMouseLeave = useCallback(() => {
    clearHover();
    onNodeHover?.(null);
    onLinkHover?.(null);
    setTooltipData(null);
  }, [clearHover, onNodeHover, onLinkHover]);

  const handleClick = useCallback(
    (e: React.MouseEvent<SVGElement>) => {
      if (!layout) return;
      const nodeId = getNodeIdFromEvent(e);
      if (nodeId !== null) {
        const node = layout.nodes.find((n) => n.id === nodeId);
        if (node) onNodeClick?.(node);
        return;
      }
      const linkIndex = getLinkIndexFromEvent(e);
      if (linkIndex !== null) {
        const link = layout.links[linkIndex];
        if (link) onLinkClick?.(link);
      }
    },
    [layout, onNodeClick, onLinkClick],
  );

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width,
    height,
    ...style,
  };

  return (
    <div ref={containerRef} className={className} style={containerStyle}>
      {size === null ? null : isTooSmall ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            color: '#999',
            fontSize: 12,
          }}
        >
          Container too small
        </div>
      ) : layout === null ? null : (
        <>
          <svg
            width={size.width}
            height={size.height}
            style={{ display: 'block', overflow: 'visible' }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
          >
            <g className="sankey-links">
              {layout.links.map((link, i) => (
                <Link
                  key={`${link.source}-${link.target}-${i}`}
                  link={link}
                  index={i}
                  color={nodeColorMap.get(link.source) ?? '#ccc'}
                  opacity={getLinkOpacity(i)}
                />
              ))}
            </g>
            <g className="sankey-nodes">
              {layout.nodes.map((node) => (
                <Node
                  key={node.id}
                  node={node}
                  color={nodeColorMap.get(node.id) ?? '#ccc'}
                  opacity={getNodeOpacity(node.id)}
                />
              ))}
            </g>
            <g className="sankey-labels">
              {layout.nodes.map((node) => (
                <Label key={node.id} node={node} opacity={getNodeOpacity(node.id)} />
              ))}
            </g>
          </svg>
          {tooltip && tooltipData && (
            <Tooltip
              item={tooltipData.item}
              x={tooltipData.x}
              y={tooltipData.y}
              render={typeof tooltip === 'function' ? tooltip : undefined}
            />
          )}
        </>
      )}
    </div>
  );
}
