import { useMemo, useDeferredValue } from "react";
import type Fuse from "fuse.js";
import type { FuseResult } from "fuse.js";
import { searchBirds } from "../utils/search";
import type { Bird } from "../types/bird";

export function useSearch(fuse: Fuse<Bird>, query: string): Array<FuseResult<Bird>> {
  const deferredQuery = useDeferredValue(query);
  return useMemo(() => searchBirds(fuse, deferredQuery), [fuse, deferredQuery]);
}
