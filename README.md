# cekat-sankey-chart

Lightweight, performant Sankey chart for React — built for draggable & resizable dashboard widgets.

## Install

```bash
npm install cekat-sankey-chart
# or
pnpm add cekat-sankey-chart
```

React 18+ and react-dom are peer dependencies.

## Basic Usage

```tsx
import { SankeyChart } from 'cekat-sankey-chart';

function MyDashboard() {
  return (
    <div style={{ width: 800, height: 400 }}>
      <SankeyChart
        data={{
          nodes: [
            { id: 'visits', label: 'Visits' },
            { id: 'signups', label: 'Signups' },
            { id: 'conversions', label: 'Conversions' },
          ],
          links: [
            { source: 'visits', target: 'signups', value: 1000 },
            { source: 'signups', target: 'conversions', value: 300 },
          ],
        }}
        width="100%"
        height="100%"
        hoverable
        hoverHighlightMode="connected"
        tooltip
      />
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `SankeyData` | required | Nodes and links |
| `width` | `string \| number` | `'100%'` | Container width |
| `height` | `string \| number` | `'100%'` | Container height |
| `nodeWidth` | `number` | `20` | Width of node rectangles in px |
| `nodePadding` | `number` | `10` | Vertical padding between nodes in px |
| `nodeAlign` | `NodeAlign` | `'justify'` | Node alignment: `left`, `right`, `center`, `justify` |
| `colorScheme` | `string[] \| ((node) => string)` | built-in palette | Node colors |
| `hoverable` | `boolean` | `true` | Enable hover interactions |
| `hoverHighlightMode` | `HoverHighlightMode` | `'connected'` | Hover mode: `none`, `connected`, `cascade` |
| `dimOpacity` | `number` | `0.15` | Opacity for dimmed (non-highlighted) elements |
| `tooltip` | `boolean \| ((item) => ReactNode)` | `false` | Show tooltip on hover |
| `isInteracting` | `boolean` | `false` | Pause layout recalc (use during drag/resize) |
| `animationDuration` | `number` | — | Reserved for future animation support |
| `onNodeClick` | `(node: ComputedNode) => void` | — | Fired on node click |
| `onLinkClick` | `(link: ComputedLink) => void` | — | Fired on link click |
| `onNodeHover` | `(node: ComputedNode \| null) => void` | — | Fired on node hover in/out |
| `onLinkHover` | `(link: ComputedLink \| null) => void` | — | Fired on link hover in/out |
| `className` | `string` | — | CSS class on root container |
| `style` | `React.CSSProperties` | — | Inline style on root container |

## Hover Modes

| Mode | Behavior |
|------|----------|
| `none` | No dimming — all elements stay at full opacity |
| `connected` | Hovered node/link + its direct neighbors stay highlighted; rest dim |
| `cascade` | Full connected subgraph reachable from hovered node stays highlighted |

## CSS Variable Theming

Override these CSS variables on any ancestor element:

```css
.my-dashboard {
  --sankey-node-hover-stroke: #fff;
  --sankey-link-opacity: 0.4;
  --sankey-label-color: #555;
  --sankey-font: 'Inter', sans-serif;
  --sankey-transition-duration: 150ms;
}
```

| Variable | Default | Controls |
|----------|---------|----------|
| `--sankey-node-hover-stroke` | `none` | Node border on hover |
| `--sankey-link-opacity` | `0.5` | Base link stroke-opacity |
| `--sankey-label-color` | `#333` | Node label color |
| `--sankey-font` | `sans-serif` | Label font family |
| `--sankey-transition-duration` | `200ms` | Opacity transition speed |

## Dashboard Integration

Use `isInteracting` to skip layout recalculation while the user drags or resizes a widget — prevents unnecessary work and visual jank:

```tsx
import { useState } from 'react';
import { SankeyChart } from 'cekat-sankey-chart';

function DashboardWidget() {
  const [dragging, setDragging] = useState(false);

  return (
    <DraggableWidget
      onDragStart={() => setDragging(true)}
      onDragStop={() => setDragging(false)}
    >
      <SankeyChart
        data={data}
        width="100%"
        height="100%"
        isInteracting={dragging}
      />
    </DraggableWidget>
  );
}
```

The chart auto-resizes via `ResizeObserver` (debounced 120ms) whenever the container changes size — no `window.resize` listener.

## License

MIT
