import type { FuseResult } from "fuse.js";
import type { Bird } from "../types/bird";

interface ResultsListProps {
  results: Array<FuseResult<Bird>>;
  query: string;
  onSelect: (bird: Bird) => void;
}

export function ResultsList({ results, query, onSelect }: ResultsListProps) {
  if (query.length >= 2 && results.length === 0) {
    return <p className="no-results">Inga arter hittades för "{query}"</p>;
  }

  return (
    <ul className="results">
      {results.map(({ item }) => (
        <li
          key={item.nr}
          className={`result-item${item.extinct ? " extinct" : ""}`}
          onClick={() => onSelect(item)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && onSelect(item)}
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
  );
}
