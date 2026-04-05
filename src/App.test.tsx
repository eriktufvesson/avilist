import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

describe("App integration", () => {
  it("renders the page title", () => {
    render(<App />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Svenska fågelnamn");
  });

  it("renders the search input", () => {
    render(<App />);
    expect(screen.getByRole("searchbox")).toBeInTheDocument();
  });

  it("renders the footer with species count", () => {
    render(<App />);
    expect(screen.getByText(/arter · NL v2025/)).toBeInTheDocument();
  });

  it("shows no results initially", () => {
    render(<App />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("shows search results after typing a query", async () => {
    render(<App />);
    await userEvent.type(screen.getByRole("searchbox"), "struts");
    await waitFor(() => {
      expect(screen.getAllByRole("button").length).toBeGreaterThan(0);
    });
  });

  it("shows no-results message for unknown query", async () => {
    render(<App />);
    await userEvent.type(screen.getByRole("searchbox"), "xyzxyzxyz");
    await waitFor(() => {
      expect(screen.getByText(/Inga arter hittades/)).toBeInTheDocument();
    });
  });

  it("opens detail panel when a result is clicked", async () => {
    render(<App />);
    await userEvent.type(screen.getByRole("searchbox"), "struts");
    await waitFor(() => screen.getAllByRole("button").length > 0);
    await userEvent.click(screen.getAllByRole("button")[0]);
    expect(document.querySelector(".detail-panel")).toBeInTheDocument();
  });

  it("closes detail panel when Escape is pressed", async () => {
    render(<App />);
    await userEvent.type(screen.getByRole("searchbox"), "struts");
    await waitFor(() => screen.getAllByRole("button").length > 0);
    await userEvent.click(screen.getAllByRole("button")[0]);
    expect(document.querySelector(".detail-panel")).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    expect(document.querySelector(".detail-panel")).not.toBeInTheDocument();
  });

  it("closes detail panel when close button is clicked", async () => {
    render(<App />);
    await userEvent.type(screen.getByRole("searchbox"), "struts");
    await waitFor(() => screen.getAllByRole("button").length > 0);
    await userEvent.click(screen.getAllByRole("button")[0]);
    await userEvent.click(screen.getByLabelText("Stäng"));
    expect(document.querySelector(".detail-panel")).not.toBeInTheDocument();
  });
});
