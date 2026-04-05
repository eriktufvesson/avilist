import { useRef, useEffect } from "react";
import { MAX_RESULTS } from "../utils/search";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  resultCount: number;
}

export function SearchInput({ value, onChange, resultCount }: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="search-wrapper">
      <input
        ref={inputRef}
        className="search-input"
        type="search"
        placeholder="Sök på svenska, engelska eller latinska namn…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
        spellCheck={false}
      />
      {value.length >= 2 && (
        <span className="result-count">
          {resultCount === MAX_RESULTS ? `${MAX_RESULTS}+` : resultCount} träffar
        </span>
      )}
    </div>
  );
}
