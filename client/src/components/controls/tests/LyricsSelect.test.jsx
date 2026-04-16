import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect } from "vitest";
import LyricsSelect from "../LyricsSelect.jsx";

describe("LyricsSelect", () => {
  it("renders the Note Label label", () => {
    render(<LyricsSelect value="Note Names" onChange={vi.fn()} />);
    expect(screen.getByText(/Note Label:/)).toBeInTheDocument();
  });

  it("renders options for Note Names, Scale Degrees, and Solfege", () => {
    render(<LyricsSelect value="Note Names" onChange={vi.fn()} />);
    expect(screen.getByRole("option", { name: "Note Names" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Scale Degrees" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Solfege" })).toBeInTheDocument();
  });

  it("shows the current value as selected", () => {
    render(<LyricsSelect value="Solfege" onChange={vi.fn()} />);
    expect(screen.getByRole("combobox")).toHaveValue("Solfege");
  });

  it("calls onChange with 'Scale Degrees' when selected", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<LyricsSelect value="Note Names" onChange={onChange} />);
    await user.selectOptions(screen.getByRole("combobox"), "Scale Degrees");
    expect(onChange).toHaveBeenCalledWith("Scale Degrees");
  });

  it("calls onChange with 'Solfege' when selected", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<LyricsSelect value="Note Names" onChange={onChange} />);
    await user.selectOptions(screen.getByRole("combobox"), "Solfege");
    expect(onChange).toHaveBeenCalledWith("Solfege");
  });

  it("calls onChange exactly once per selection", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<LyricsSelect value="Note Names" onChange={onChange} />);
    await user.selectOptions(screen.getByRole("combobox"), "Solfege");
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
