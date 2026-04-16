import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect } from "vitest";
import DirectionSelect from "../DirectionSelect.jsx";

describe("DirectionSelect", () => {
  it("renders the Scale Direction label", () => {
    render(<DirectionSelect value="both" onChange={vi.fn()} />);
    expect(screen.getByText(/Scale Direction:/)).toBeInTheDocument();
  });

  it("renders options for Asc. & Desc., Asc. only, and Desc. only", () => {
    render(<DirectionSelect value="both" onChange={vi.fn()} />);
    expect(screen.getByRole("option", { name: "Asc. & Desc." })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Asc. only" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Desc. only" })).toBeInTheDocument();
  });

  it("shows the current value as selected", () => {
    render(<DirectionSelect value="ascending" onChange={vi.fn()} />);
    expect(screen.getByRole("combobox")).toHaveValue("ascending");
  });

  it("calls onChange with 'ascending' when Asc. only is selected", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<DirectionSelect value="both" onChange={onChange} />);
    await user.selectOptions(screen.getByRole("combobox"), "ascending");
    expect(onChange).toHaveBeenCalledWith("ascending");
  });

  it("calls onChange with 'descending' when Desc. only is selected", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<DirectionSelect value="both" onChange={onChange} />);
    await user.selectOptions(screen.getByRole("combobox"), "descending");
    expect(onChange).toHaveBeenCalledWith("descending");
  });

  it("calls onChange with 'both' when Asc. & Desc. is selected", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<DirectionSelect value="ascending" onChange={onChange} />);
    await user.selectOptions(screen.getByRole("combobox"), "both");
    expect(onChange).toHaveBeenCalledWith("both");
  });
});
