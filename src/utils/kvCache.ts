// src/utils/kvCache.ts

import { KVNamespace } from '@cloudflare/workers-types';

export const getFromCache = async <T>(kv: KVNamespace, key: string): Promise<T | null> => {
  const data = await kv.get(key);
  if (!data) return null;
  try {
    return JSON.parse(data) as T;
  } catch (e) {
    return data as unknown as T;
  }
};

export const setInCache = async (
  kv: KVNamespace, 
  key: string, 
  value: any, 
  ttlInSeconds?: number
): Promise<void> => {
  const data = typeof value === 'string' ? value : JSON.stringify(value);
  if (ttlInSeconds) {
    await kv.put(key, data, { expirationTtl: ttlInSeconds });
  } else {
    await kv.put(key, data);
  }
};

export const invalidateCache = async (kv: KVNamespace, key: string): Promise<void> => {
  await kv.delete(key);
};