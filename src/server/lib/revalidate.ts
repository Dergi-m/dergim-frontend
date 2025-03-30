import 'server-only';

import { revalidateTag } from 'next/cache';

type DocumentCacheTag = {
  type: string;
  id?: string | null;
};

export function cacheTag({ type, id }: DocumentCacheTag) {
  if (id) {
    return `${type}:${id}`;
  }

  return type;
}

export function revalidateDocument({ type, id }: DocumentCacheTag) {
  if (id) {
    revalidateTag(cacheTag({ type, id }));
  }

  revalidateTag(cacheTag({ type }));
}
