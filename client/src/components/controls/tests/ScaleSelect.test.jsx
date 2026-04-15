import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect } from "vitest";
import ScaleSelect from "../ScaleSelect.jsx";

const scaleTypes = ["Major", "Natural Minor", "Harmonic Minor", "Melodic Minor"];

describe("ScaleSelect", () => {
  it("renders the Scale label", () => {
    render(<ScaleSelect value="Major" onChange={vi.fn()} scaleTypes={scaleTypes} />);
    expect(screen.getByText(/Scale:/)).toBeInTheDocument();
  });

  it("renders an option for each scale type", () => {
    render(<ScaleSelect value="Major" onChange={vi.fn()} scaleTypes={scaleTypes} />);
    scaleTypes.forEach((type) => {
      expect(screen.getByRole("option", { name: type })).toBeInTheDocument();
    });
  });

  it("shows the current value as selected", () => {
    render(
      <ScaleSelect value="Harmonic Minor" onChange={vi.fn()} scaleTypes={scaleTypes} />
    );
    expect(screen.getByRole("combobox")).toHaveValue("Harmonic Minor");
  });

  it("calls onChange with the newly selected scale type", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<ScaleSelect value="Major" onChange={onChange} scaleTypes={scaleTypes} />);
    await user.selectOptions(screen.getByRole("combobox"), "Natural Minor");
    expect(onChange).toHaveBeenCalledWith("Natural Minor");
  });

  it("calls onChange exactly once per selection", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<ScaleSelect value="Major" onChange={onChange} scaleTypes={scaleTypes} />);
    await user.selectOptions(screen.getByRole("combobox"), "Melodic Minor");
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
