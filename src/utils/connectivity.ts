import type { ComputedLink } from '../types';

export interface ConnectivityMap {
  connectedNodeIds: Set<string>;
  connectedLinkIndices: Set<number>;
}

export function buildNodeConnectivity(nodeId: string, links: ComputedLink[]): ConnectivityMap {
  const connectedNodeIds = new Set<string>([nodeId]);
  const connectedLinkIndices = new Set<number>();

  links.forEach((link, i) => {
    if (link.source === nodeId || link.target === nodeId) {
      connectedLinkIndices.add(i);
      connectedNodeIds.add(link.source);
      connectedNodeIds.add(link.target);
    }
  });

  return { connectedNodeIds, connectedLinkIndices };
}

export function buildLinkConnectivity(linkIndex: number, links: ComputedLink[]): ConnectivityMap {
  const link = links[linkIndex];
  if (!link) return { connectedNodeIds: new Set(), connectedLinkIndices: new Set() };

  const connectedNodeIds = new Set<string>([link.source, link.target]);
  const connectedLinkIndices = new Set<number>([linkIndex]);

  return { connectedNodeIds, connectedLinkIndices };
}

export function buildCascadeConnectivity(nodeId: string, links: ComputedLink[]): ConnectivityMap {
  const connectedNodeIds = new Set<string>([nodeId]);
  const connectedLinkIndices = new Set<number>();

  let changed = true;
  while (changed) {
    changed = false;
    links.forEach((link, i) => {
      if (!connectedLinkIndices.has(i)) {
        const sourceConnected = connectedNodeIds.has(link.source);
        const targetConnected = connectedNodeIds.has(link.target);
        if (sourceConnected || targetConnected) {
          connectedLinkIndices.add(i);
          if (!connectedNodeIds.has(link.source)) {
            connectedNodeIds.add(link.source);
            changed = true;
          }
          if (!connectedNodeIds.has(link.target)) {
            connectedNodeIds.add(link.target);
            changed = true;
          }
        }
      }
    });
  }

  return { connectedNodeIds, connectedLinkIndices };
}
