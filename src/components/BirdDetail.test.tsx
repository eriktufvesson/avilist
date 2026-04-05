import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BirdDetail } from "./BirdDetail";
import type { Bird } from "../types/bird";

const eagle: Bird = {
  nr: 42,
  scientific: "Aquila chrysaetos",
  english: "Golden Eagle",
  swedish: "kungsörn",
  extinct: false,
  order: "ROVFÅGLAR",
  family: "hökartade rovfåglar",
};

const dodo: Bird = {
  nr: 99,
  scientific: "Raphus cucullatus",
  english: "Dodo",
  swedish: "dodo",
  extinct: true,
  order: "DUVFÅGLAR",
  family: "drontar",
};

describe("BirdDetail", () => {
  it("renders Swedish and scientific names", () => {
    render(<BirdDetail bird={eagle} onClose={() => {}} />);
    expect(screen.getByText("kungsörn")).toBeInTheDocument();
    expect(screen.getByText("Aquila chrysaetos")).toBeInTheDocument();
  });

  it("renders English name", () => {
    render(<BirdDetail bird={eagle} onClose={() => {}} />);
    expect(screen.getByText("Golden Eagle")).toBeInTheDocument();
  });

  it("renders family and order", () => {
    render(<BirdDetail bird={eagle} onClose={() => {}} />);
    expect(screen.getByText("hökartade rovfåglar")).toBeInTheDocument();
    expect(screen.getByText("ROVFÅGLAR")).toBeInTheDocument();
  });

  it("renders NL-nummer", () => {
    render(<BirdDetail bird={eagle} onClose={() => {}} />);
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", async () => {
    const onClose = vi.fn();
    render(<BirdDetail bird={eagle} onClose={onClose} />);
    await userEvent.click(screen.getByLabelText("Stäng"));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("calls onClose when overlay backdrop is clicked", () => {
    const onClose = vi.fn();
    const { container } = render(<BirdDetail bird={eagle} onClose={onClose} />);
    const overlay = container.querySelector(".detail-overlay")!;
    fireEvent.click(overlay);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("does not call onClose when clicking inside the panel", () => {
    const onClose = vi.fn();
    const { container } = render(<BirdDetail bird={eagle} onClose={onClose} />);
    const panel = container.querySelector(".detail-panel")!;
    fireEvent.click(panel);
    expect(onClose).not.toHaveBeenCalled();
  });

  it("shows extinct badge for extinct birds", () => {
    render(<BirdDetail bird={dodo} onClose={() => {}} />);
    expect(screen.getByText(/†/)).toBeInTheDocument();
  });

  it("shows Utdöd status row for extinct birds", () => {
    render(<BirdDetail bird={dodo} onClose={() => {}} />);
    expect(screen.getByText("Utdöd")).toBeInTheDocument();
  });

  it("does not show Utdöd status row for living birds", () => {
    render(<BirdDetail bird={eagle} onClose={() => {}} />);
    expect(screen.queryByText("Utdöd")).not.toBeInTheDocument();
  });

  it("does not show order row when order is empty", () => {
    const noOrderBird: Bird = { ...eagle, order: "" };
    render(<BirdDetail bird={noOrderBird} onClose={() => {}} />);
    expect(screen.queryByText("Ordning")).not.toBeInTheDocument();
  });
});
