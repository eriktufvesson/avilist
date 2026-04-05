import { render, screen } from "@testing-library/react";
import { Header } from "./Header";

describe("Header", () => {
  it("renders the h1 title", () => {
    render(<Header />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Svenska fågelnamn");
  });

  it("renders the subtitle", () => {
    render(<Header />);
    expect(screen.getByText("Officiella svenska namn på världens fågelarter")).toBeInTheDocument();
  });
});
