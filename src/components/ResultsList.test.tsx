import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ResultsList } from "./ResultsList";
import type { Bird } from "../types/bird";
import type { FuseResult } from "fuse.js";

const eagle: Bird = {
  nr: 1,
  scientific: "Aquila chrysaetos",
  english: "Golden Eagle",
  swedish: "kungsörn",
  extinct: false,
  order: "ROVFÅGLAR",
  family: "hökartade rovfåglar",
};

const dodo: Bird = {
  nr: 2,
  scientific: "Raphus cucullatus",
  english: "Dodo",
  swedish: "dodo",
  extinct: true,
  order: "DUVFÅGLAR",
  family: "drontar",
};

const mockResults: Array<FuseResult<Bird>> = [
  { item: eagle, score: 0.1, refIndex: 0 },
  { item: dodo, score: 0.2, refIndex: 1 },
];

describe("ResultsList", () => {
  it("renders all result items", () => {
    render(<ResultsList results={mockResults} query="orn" onSelect={() => {}} />);
    expect(screen.getByText("kungsörn")).toBeInTheDocument();
    expect(screen.getByText("dodo")).toBeInTheDocument();
  });

  it("renders English and scientific names", () => {
    render(<ResultsList results={mockResults} query="orn" onSelect={() => {}} />);
    expect(screen.getByText("Golden Eagle")).toBeInTheDocument();
    expect(screen.getByText("Aquila chrysaetos")).toBeInTheDocument();
  });

  it("renders taxonomy info", () => {
    render(<ResultsList results={mockResults} query="orn" onSelect={() => {}} />);
    expect(screen.getByText("hökartade rovfåglar")).toBeInTheDocument();
    expect(screen.getByText("ROVFÅGLAR")).toBeInTheDocument();
  });

  it("calls onSelect when a result is clicked", async () => {
    const onSelect = vi.fn();
    render(<ResultsList results={mockResults} query="orn" onSelect={onSelect} />);
    await userEvent.click(screen.getByText("kungsörn"));
    expect(onSelect).toHaveBeenCalledWith(eagle);
  });

  it("calls onSelect when Enter is pressed on a result", () => {
    const onSelect = vi.fn();
    render(<ResultsList results={mockResults} query="orn" onSelect={onSelect} />);
    const item = screen.getByText("kungsörn").closest("li")!;
    fireEvent.keyDown(item, { key: "Enter" });
    expect(onSelect).toHaveBeenCalledWith(eagle);
  });

  it("does not call onSelect for non-Enter keys", () => {
    const onSelect = vi.fn();
    render(<ResultsList results={mockResults} query="orn" onSelect={onSelect} />);
    const item = screen.getByText("kungsörn").closest("li")!;
    fireEvent.keyDown(item, { key: "Space" });
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("shows extinct badge for extinct birds", () => {
    render(<ResultsList results={mockResults} query="dodo" onSelect={() => {}} />);
    expect(screen.getByText("†")).toBeInTheDocument();
  });

  it("adds extinct CSS class to extinct result items", () => {
    render(<ResultsList results={mockResults} query="dodo" onSelect={() => {}} />);
    const dodoItem = screen.getByText("dodo").closest("li")!;
    expect(dodoItem).toHaveClass("extinct");
  });

  it("shows no-results message when results empty and query long enough", () => {
    render(<ResultsList results={[]} query="xyzxyz" onSelect={() => {}} />);
    expect(screen.getByText(/Inga arter hittades/)).toBeInTheDocument();
    expect(screen.getByText(/xyzxyz/)).toBeInTheDocument();
  });

  it("renders empty list (no message) when query is too short", () => {
    render(<ResultsList results={[]} query="x" onSelect={() => {}} />);
    expect(screen.queryByText(/Inga arter hittades/)).not.toBeInTheDocument();
  });

  it("each result item has role=button and is focusable", () => {
    render(<ResultsList results={mockResults} query="orn" onSelect={() => {}} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBe(2);
    buttons.forEach((btn) => expect(btn).toHaveAttribute("tabindex", "0"));
  });
});
