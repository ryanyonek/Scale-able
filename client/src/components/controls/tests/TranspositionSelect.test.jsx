import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect } from "vitest";
import TranspositionSelect from "../TranspositionSelect.jsx";

const transpositionKeys = [
  "+12: C", "+7: F", "+2: Bb", "0: C", "-2: D", "-7: G", "-12: C",
];

describe("TranspositionSelect", () => {
  it("renders the Select Transposition label", () => {
    render(
      <TranspositionSelect value="0: C" onChange={vi.fn()} keys={transpositionKeys} />
    );
    expect(screen.getByText(/Select Transposition:/)).toBeInTheDocument();
  });

  it("renders an option for every key in the keys array", () => {
    render(
      <TranspositionSelect value="0: C" onChange={vi.fn()} keys={transpositionKeys} />
    );
    transpositionKeys.forEach((key) => {
      expect(screen.getByRole("option", { name: key })).toBeInTheDocument();
    });
  });

  it("shows the current value as selected", () => {
    render(
      <TranspositionSelect value="+7: F" onChange={vi.fn()} keys={transpositionKeys} />
    );
    expect(screen.getByRole("combobox")).toHaveValue("+7: F");
  });

  it("calls onChange with the selected transposition key", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <TranspositionSelect value="0: C" onChange={onChange} keys={transpositionKeys} />
    );
    await user.selectOptions(screen.getByRole("combobox"), "+2: Bb");
    expect(onChange).toHaveBeenCalledWith("+2: Bb");
  });

  it("calls onChange exactly once per selection", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <TranspositionSelect value="0: C" onChange={onChange} keys={transpositionKeys} />
    );
    await user.selectOptions(screen.getByRole("combobox"), "-7: G");
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
