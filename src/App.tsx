import { useState, useMemo, useRef, useEffect } from "react";
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

const fuse = new Fuse(birds, {
  keys: [
    { name: "swedish", weight: 0.4 },
    { name: "english", weight: 0.35 },
    { name: "scientific", weight: 0.25 },
  ],
  threshold: 0.35,
  includeScore: true,
  minMatchCharLength: 2,
});

export default function App() {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const results = useMemo(() => {
    if (query.trim().length < 2) return [];
    return fuse.search(query.trim()).slice(0, 50);
  }, [query]);

  return (
    <div className="app">
      <header className="header">
        <h1 className="title">Avilist</h1>
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
          <li key={item.nr} className={`result-item${item.extinct ? " extinct" : ""}`}>
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
    </div>
  );
}
