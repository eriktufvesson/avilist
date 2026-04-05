import { describe, it, expect } from "vitest";
import { normalize, searchBirds, createFuse, SCORE_CUTOFF, MAX_RESULTS, MIN_QUERY_LENGTH } from "./search";
import type { Bird } from "../types/bird";

const mockBirds: Bird[] = [
  { nr: 1, scientific: "Struthio camelus", english: "Common Ostrich", swedish: "struts", extinct: false, order: "STRUTSFÅGLAR", family: "strutsar" },
  { nr: 2, scientific: "Aquila chrysaetos", english: "Golden Eagle", swedish: "kungsörn", extinct: false, order: "ROVFÅGLAR", family: "hökartade rovfåglar" },
  { nr: 3, scientific: "Raphus cucullatus", english: "Dodo", swedish: "dodo", extinct: true, order: "DUVFÅGLAR", family: "drontar" },
  { nr: 4, scientific: "Haliaeetus albicilla", english: "White-tailed Eagle", swedish: "havsörn", extinct: false, order: "ROVFÅGLAR", family: "hökartade rovfåglar" },
];

describe("normalize", () => {
  it("replaces å with a", () => expect(normalize("rådjur")).toBe("radjur"));
  it("replaces Å with a", () => expect(normalize("Åke")).toBe("ake"));
  it("replaces ä with a", () => expect(normalize("räv")).toBe("rav"));
  it("replaces Ä with a", () => expect(normalize("Ärla")).toBe("arla"));
  it("replaces ö with o", () => expect(normalize("örn")).toBe("orn"));
  it("replaces Ö with o", () => expect(normalize("Örn")).toBe("orn"));
  it("removes apostrophes", () => expect(normalize("Bewick's")).toBe("Bewicks"));
  it("removes curly apostrophes", () => expect(normalize("Bewick\u2019s")).toBe("Bewicks"));
  it("removes hyphens", () => expect(normalize("white-tailed")).toBe("whitetailed"));
  it("handles all special chars together", () => expect(normalize("ÅÄÖ")).toBe("aao"));
  it("leaves regular latin characters unchanged", () => expect(normalize("eagle")).toBe("eagle"));
  it("handles empty string", () => expect(normalize("")).toBe(""));
});

describe("SCORE_CUTOFF / MAX_RESULTS / MIN_QUERY_LENGTH constants", () => {
  it("SCORE_CUTOFF is a positive number below 1", () => {
    expect(SCORE_CUTOFF).toBeGreaterThan(0);
    expect(SCORE_CUTOFF).toBeLessThan(1);
  });
  it("MAX_RESULTS is 50", () => expect(MAX_RESULTS).toBe(50));
  it("MIN_QUERY_LENGTH is 2", () => expect(MIN_QUERY_LENGTH).toBe(2));
});

describe("searchBirds", () => {
  const fuse = createFuse(mockBirds);

  it("returns empty array for empty query", () => {
    expect(searchBirds(fuse, "")).toHaveLength(0);
  });

  it("returns empty array for single-char query", () => {
    expect(searchBirds(fuse, "a")).toHaveLength(0);
  });

  it("finds birds by Swedish name", () => {
    const results = searchBirds(fuse, "struts");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].item.swedish).toBe("struts");
  });

  it("finds birds by English name", () => {
    const results = searchBirds(fuse, "eagle");
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.item.english.includes("Eagle"))).toBe(true);
  });

  it("finds birds by scientific name", () => {
    const results = searchBirds(fuse, "aquila");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].item.scientific).toContain("Aquila");
  });

  it("finds extinct birds", () => {
    const results = searchBirds(fuse, "dodo");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].item.extinct).toBe(true);
  });

  it("all results have score below SCORE_CUTOFF", () => {
    const results = searchBirds(fuse, "eagle");
    results.forEach(({ score }) => expect(score ?? 1).toBeLessThan(SCORE_CUTOFF));
  });

  it("results are sorted by score ascending", () => {
    const results = searchBirds(fuse, "örn");
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].score ?? 1).toBeLessThanOrEqual(results[i].score ?? 1);
    }
  });

  it("returns at most MAX_RESULTS results", () => {
    const manyBirds: Bird[] = Array.from({ length: 100 }, (_, i) => ({
      nr: i,
      scientific: `Fagel fagel${i}`,
      english: `bird ${i}`,
      swedish: `fagel ${i}`,
      extinct: false,
      order: "ORDER",
      family: "family",
    }));
    const largeFuse = createFuse(manyBirds);
    const results = searchBirds(largeFuse, "fagel");
    expect(results.length).toBeLessThanOrEqual(MAX_RESULTS);
  });

  it("handles Swedish characters in query via normalization", () => {
    const results = searchBirds(fuse, "kungsorn");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].item.swedish).toBe("kungsörn");
  });
});
