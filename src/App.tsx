import { useState, useEffect } from "react";
import birdsData from "./birds.json";
import "./App.css";

import type { Bird } from "./types/bird";
import { createFuse } from "./utils/search";
import { useSearch } from "./hooks/useSearch";
import { Header } from "./components/Header";
import { SearchInput } from "./components/SearchInput";
import { ResultsList } from "./components/ResultsList";
import { BirdDetail } from "./components/BirdDetail";

const birds = birdsData as Bird[];
const fuse = createFuse(birds);

export default function App() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Bird | null>(null);
  const results = useSearch(fuse, query);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="app">
      <Header />
      <SearchInput value={query} onChange={setQuery} resultCount={results.length} />
      <ResultsList results={results} query={query} onSelect={setSelected} />
      <footer className="footer">
        <span>{birds.length.toLocaleString("sv")} arter · NL v2025</span>
      </footer>
      {selected && <BirdDetail bird={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
