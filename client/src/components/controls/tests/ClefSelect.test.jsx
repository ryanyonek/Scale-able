import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect } from "vitest";
import ClefSelect from "../ClefSelect.jsx";

describe("ClefSelect", () => {
  it("renders the Select Clef label", () => {
    render(<ClefSelect value="treble" onChange={vi.fn()} />);
    expect(screen.getByText(/Select Clef:/)).toBeInTheDocument();
  });

  it("renders options for Treble, Bass, Alto, and Tenor clefs", () => {
    render(<ClefSelect value="treble" onChange={vi.fn()} />);
    expect(screen.getByRole("option", { name: "Treble" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Bass" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Alto" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Tenor" })).toBeInTheDocument();
  });

  it("shows the current value as selected", () => {
    render(<ClefSelect value="bass" onChange={vi.fn()} />);
    expect(screen.getByRole("combobox")).toHaveValue("bass");
  });

  it("calls onChange with the selected clef value", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<ClefSelect value="treble" onChange={onChange} />);
    await user.selectOptions(screen.getByRole("combobox"), "bass");
    expect(onChange).toHaveBeenCalledWith("bass");
  });

  it("calls onChange exactly once per selection", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<ClefSelect value="treble" onChange={onChange} />);
    await user.selectOptions(screen.getByRole("combobox"), "alto");
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
