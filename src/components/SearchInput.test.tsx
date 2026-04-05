import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchInput } from "./SearchInput";

describe("SearchInput", () => {
  it("renders the search input", () => {
    render(<SearchInput value="" onChange={() => {}} resultCount={0} />);
    expect(screen.getByRole("searchbox")).toBeInTheDocument();
  });

  it("calls onChange when typing", async () => {
    const onChange = vi.fn();
    render(<SearchInput value="" onChange={onChange} resultCount={0} />);
    await userEvent.type(screen.getByRole("searchbox"), "a");
    expect(onChange).toHaveBeenCalled();
  });

  it("displays result count when query is at least 2 chars", () => {
    render(<SearchInput value="ko" onChange={() => {}} resultCount={5} />);
    expect(screen.getByText("5 träffar")).toBeInTheDocument();
  });

  it("displays 50+ when resultCount equals MAX_RESULTS (50)", () => {
    render(<SearchInput value="ko" onChange={() => {}} resultCount={50} />);
    expect(screen.getByText("50+ träffar")).toBeInTheDocument();
  });

  it("hides result count when query is shorter than 2 chars", () => {
    render(<SearchInput value="k" onChange={() => {}} resultCount={5} />);
    expect(screen.queryByText(/träffar/)).not.toBeInTheDocument();
  });

  it("hides result count when query is empty", () => {
    render(<SearchInput value="" onChange={() => {}} resultCount={0} />);
    expect(screen.queryByText(/träffar/)).not.toBeInTheDocument();
  });

  it("reflects the passed value", () => {
    render(<SearchInput value="hello" onChange={() => {}} resultCount={3} />);
    expect(screen.getByRole("searchbox")).toHaveValue("hello");
  });
});
