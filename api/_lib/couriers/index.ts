import type { CourierAdapter } from './types';
import { TcsAdapter } from './tcsAdapter';
import { PostexAdapter } from './postexAdapter';
import { LeopardsAdapter } from './leopardsAdapter';
import { ManualAdapter } from './manualAdapter';

export * from './types';
export { TcsAdapter } from './tcsAdapter';
export { PostexAdapter } from './postexAdapter';
export { LeopardsAdapter } from './leopardsAdapter';
export { ManualAdapter } from './manualAdapter';

const adapters: Record<string, CourierAdapter> = {
  tcs: new TcsAdapter(),
  postex: new PostexAdapter(),
  leopards: new LeopardsAdapter(),
  manual: new ManualAdapter(),
};

export function getCourierAdapter(nameOrId?: string): CourierAdapter {
  if (!nameOrId) return adapters.manual;
  const key = nameOrId.toLowerCase().trim();
  if (key.includes('tcs')) return adapters.tcs;
  if (key.includes('postex') || key.includes('pex')) return adapters.postex;
  if (key.includes('leopard') || key.includes('lcs')) return adapters.leopards;
  return adapters[key] || adapters.manual;
}

export function listCourierAdapters(): Array<{
  providerId: string;
  displayName: string;
  isConfigured: boolean;
}> {
  return Object.values(adapters).map(a => ({
    providerId: a.providerId,
    displayName: a.displayName,
    isConfigured: a.isConfigured()
  }));
}
