import { useState, useMemo, useRef, useEffect, useDeferredValue } from "react";
import Fuse from "fuse.js";
import birdsData from "./birds.json";
import "./App.css";

interface Bird {
  nr: number;
  scientific: string;
  english: string;
  swedish: string;
  extinct: boolean;
  order: string;
  family: string;
}

const birds = birdsData as Bird[];

const SCORE_CUTOFF = 0.4;

const normalize = (s: string) =>
  s
    .replace(/['''\u2018\u2019-]/g, "")
    .replace(/[åÅ]/g, "a")
    .replace(/[äÄ]/g, "a")
    .replace(/[öÖ]/g, "o");

const fuse = new Fuse(birds, {
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
  minMatchCharLength: 2,
});

export default function App() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [selected, setSelected] = useState<Bird | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(() => {
    if (deferredQuery.trim().length < 2) return [];
    return fuse
      .search(normalize(deferredQuery.trim()))
      .filter(({ score }) => (score ?? 1) < SCORE_CUTOFF)
      .sort((a, b) => (a.score ?? 1) - (b.score ?? 1))
      .slice(0, 50);
  }, [deferredQuery]);

  return (
    <div className="app">
      <header className="header">
        <h1 className="title">Svenska fågelnamn</h1>
        <p className="subtitle">Officiella svenska namn på världens fågelarter</p>
      </header>

      <div className="search-wrapper">
        <input
          ref={inputRef}
          className="search-input"
          type="search"
          placeholder="Sök på svenska, engelska eller latinska namn…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
          spellCheck={false}
        />
        {query.length >= 2 && (
          <span className="result-count">
            {results.length === 50 ? "50+" : results.length} träffar
          </span>
        )}
      </div>

      {query.length >= 2 && results.length === 0 && (
        <p className="no-results">Inga arter hittades för "{query}"</p>
      )}

      <ul className="results">
        {results.map(({ item }) => (
          <li
            key={item.nr}
            className={`result-item${item.extinct ? " extinct" : ""}`}
            onClick={() => setSelected(item)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setSelected(item)}
          >
            <div className="result-main">
              <span className="swedish-name">{item.swedish}</span>
              {item.extinct && <span className="extinct-badge">†</span>}
            </div>
            <div className="result-meta">
              <span className="english-name">{item.english}</span>
              <span className="separator">·</span>
              <span className="scientific-name">{item.scientific}</span>
            </div>
            <div className="result-taxonomy">
              <span className="family">{item.family}</span>
              {item.order && (
                <>
                  <span className="separator">·</span>
                  <span className="order">{item.order}</span>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>

      <footer className="footer">
        <span>{birds.length.toLocaleString("sv")} arter · NL v2025</span>
      </footer>

      {selected && (
        <div className="detail-overlay" onClick={() => setSelected(null)}>
          <div className="detail-panel" onClick={(e) => e.stopPropagation()}>
            <button className="detail-close" onClick={() => setSelected(null)} aria-label="Stäng">✕</button>
            <div className="detail-header">
              <h2 className="detail-swedish">
                {selected.swedish}
                {selected.extinct && <span className="extinct-badge"> †</span>}
              </h2>
              <p className="detail-scientific">{selected.scientific}</p>
            </div>
            <dl className="detail-fields">
              <div className="detail-row">
                <dt>Engelska</dt>
                <dd>{selected.english}</dd>
              </div>
              <div className="detail-row">
                <dt>Familj</dt>
                <dd>{selected.family}</dd>
              </div>
              {selected.order && (
                <div className="detail-row">
                  <dt>Ordning</dt>
                  <dd>{selected.order}</dd>
                </div>
              )}
              <div className="detail-row">
                <dt>NL-nummer</dt>
                <dd>{selected.nr}</dd>
              </div>
              {selected.extinct && (
                <div className="detail-row">
                  <dt>Status</dt>
                  <dd>Utdöd</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      )}
    </div>
  );
}
