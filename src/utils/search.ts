import Fuse, { type FuseResult } from "fuse.js";
import type { Bird } from "../types/bird";

export const SCORE_CUTOFF = 0.4;
export const MAX_RESULTS = 50;
export const MIN_QUERY_LENGTH = 2;

export const normalize = (s: string) =>
  s
    .replace(/['''\u2018\u2019-]/g, "")
    .replace(/[åÅ]/g, "a")
    .replace(/[äÄ]/g, "a")
    .replace(/[öÖ]/g, "o");

export function createFuse(birds: Bird[]): Fuse<Bird> {
  return new Fuse(birds, {
    keys: [
      { name: "swedish", weight: 0.4 },
      { name: "english", weight: 0.35 },
      { name: "scientific", weight: 0.25 },
      { name: "epithet", weight: 0.2 },
    ],
    getFn: (bird, path) => {
      const key = Array.isArray(path) ? path[0] : path;
      if (key === "epithet") {
        const parts = bird.scientific.trim().split(/\s+/);
        return parts.length >= 2 ? normalize(parts[parts.length - 1]) : "";
      }
      const val = (bird as unknown as Record<string, unknown>)[key as string];
      return typeof val === "string" ? normalize(val) : String(val ?? "");
    },
    threshold: 0.3,
    ignoreLocation: true,
    includeScore: true,
    minMatchCharLength: MIN_QUERY_LENGTH,
  });
}

export function searchBirds(fuse: Fuse<Bird>, query: string): Array<FuseResult<Bird>> {
  if (query.trim().length < MIN_QUERY_LENGTH) return [];
  return fuse
    .search(normalize(query.trim()))
    .filter(({ score }) => (score ?? 1) < SCORE_CUTOFF)
    .sort((a, b) => (a.score ?? 1) - (b.score ?? 1))
    .slice(0, MAX_RESULTS);
}
