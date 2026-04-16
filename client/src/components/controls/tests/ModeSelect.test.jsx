import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect } from "vitest";
import ModeSelect from "../ModeSelect.jsx";

const modeShifts = {
  Ionian: 0,
  Dorian: 1,
  Phrygian: 2,
  Lydian: 3,
  Mixolydian: 4,
  Aeolian: 5,
  Locrian: 6,
};

describe("ModeSelect", () => {
  it("renders the Select Major Mode label", () => {
    render(<ModeSelect value="Ionian" onChange={vi.fn()} modeShifts={modeShifts} />);
    expect(screen.getByText(/Select Major Mode:/)).toBeInTheDocument();
  });

  it("renders an option for each mode in modeShifts", () => {
    render(<ModeSelect value="Ionian" onChange={vi.fn()} modeShifts={modeShifts} />);
    Object.keys(modeShifts).forEach((mode) => {
      expect(screen.getByRole("option", { name: mode })).toBeInTheDocument();
    });
  });

  it("shows the current value as selected", () => {
    render(<ModeSelect value="Dorian" onChange={vi.fn()} modeShifts={modeShifts} />);
    expect(screen.getByRole("combobox")).toHaveValue("Dorian");
  });

  it("calls onChange with the selected mode", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<ModeSelect value="Ionian" onChange={onChange} modeShifts={modeShifts} />);
    await user.selectOptions(screen.getByRole("combobox"), "Phrygian");
    expect(onChange).toHaveBeenCalledWith("Phrygian");
  });

  it("calls onChange exactly once per selection", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<ModeSelect value="Ionian" onChange={onChange} modeShifts={modeShifts} />);
    await user.selectOptions(screen.getByRole("combobox"), "Mixolydian");
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
