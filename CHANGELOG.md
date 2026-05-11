# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2026-05-11

### Added
- Initial release
- `SankeyChart` React component with SVG rendering
- Auto-resize via `ResizeObserver` (debounced 120ms)
- Dynamic data re-layout on `data` prop change
- Stable node identity via `node.id` keys
- `isInteracting` prop to pause layout during dashboard drag/resize
- Graceful degradation placeholder when container < 200×100px
- Hover interactions with three modes: `none`, `connected`, `cascade`
- Event delegation via single SVG root listener (`data-node-id`, `data-link-index`)
- CSS variable theming: `--sankey-node-color`, `--sankey-node-hover-stroke`, `--sankey-link-color`, `--sankey-link-opacity`, `--sankey-label-color`, `--sankey-font`, `--sankey-transition-duration`
- `tooltip` prop supporting boolean or custom render function
- `colorScheme` prop supporting array or function
- `nodeAlign` options: `left`, `right`, `center`, `justify`
- Callbacks: `onNodeClick`, `onLinkClick`, `onNodeHover`, `onLinkHover`
- Full TypeScript types with strict mode (zero `any`)
- ESM + CJS + `.d.ts` build outputs
- CI workflow for lint, typecheck, and tests
- Publish workflow triggered on git tag `v*`

[Unreleased]: https://github.com/iwancinggg/cekat-sankey-chart/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/iwancinggg/cekat-sankey-chart/releases/tag/v0.1.0
