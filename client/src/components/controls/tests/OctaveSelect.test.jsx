import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect } from "vitest";
import OctaveSelect from "../OctaveSelect.jsx";

describe("OctaveSelect", () => {
  it("renders the Octave label", () => {
    render(<OctaveSelect value="current" onChange={vi.fn()} />);
    expect(screen.getByText(/Octave:/)).toBeInTheDocument();
  });

  it("renders options for Octave Up, Current Octave, and Octave Down", () => {
    render(<OctaveSelect value="current" onChange={vi.fn()} />);
    expect(screen.getByRole("option", { name: "Octave Up" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Current Octave" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Octave Down" })).toBeInTheDocument();
  });

  it("shows the current value as selected", () => {
    render(<OctaveSelect value="8va" onChange={vi.fn()} />);
    expect(screen.getByRole("combobox")).toHaveValue("8va");
  });

  it("calls onChange with '8va' when Octave Up is selected", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<OctaveSelect value="current" onChange={onChange} />);
    await user.selectOptions(screen.getByRole("combobox"), "8va");
    expect(onChange).toHaveBeenCalledWith("8va");
  });

  it("calls onChange with '8vb' when Octave Down is selected", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<OctaveSelect value="current" onChange={onChange} />);
    await user.selectOptions(screen.getByRole("combobox"), "8vb");
    expect(onChange).toHaveBeenCalledWith("8vb");
  });

  it("calls onChange with 'current' when Current Octave is selected", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<OctaveSelect value="8va" onChange={onChange} />);
    await user.selectOptions(screen.getByRole("combobox"), "current");
    expect(onChange).toHaveBeenCalledWith("current");
  });
});
