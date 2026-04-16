import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect } from "vitest";
import AudioTempoSelect from "../AudioTempoSelect.jsx";

describe("AudioTempoSelect", () => {
  it("renders a combobox (select element)", () => {
    render(<AudioTempoSelect tempo={1} onChange={vi.fn()} />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("renders the standard tempo options", () => {
    render(<AudioTempoSelect tempo={1} onChange={vi.fn()} />);
    expect(screen.getByRole("option", { name: "0.5x" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "0.75x" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "1x" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "1.25x" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "1.5x" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "2x" })).toBeInTheDocument();
  });

  it("shows the current tempo as the selected option", () => {
    render(<AudioTempoSelect tempo={1.5} onChange={vi.fn()} />);
    expect(screen.getByRole("combobox")).toHaveValue("1.5");
  });

  it("calls onChange with a number when a new tempo is selected", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<AudioTempoSelect tempo={1} onChange={onChange} />);
    await user.selectOptions(screen.getByRole("combobox"), "0.5");
    expect(onChange).toHaveBeenCalledWith(0.5);
  });

  it("calls onChange with a number (not a string)", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<AudioTempoSelect tempo={1} onChange={onChange} />);
    await user.selectOptions(screen.getByRole("combobox"), "2");
    expect(typeof onChange.mock.calls[0][0]).toBe("number");
  });

  it("calls onChange exactly once per selection", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<AudioTempoSelect tempo={1} onChange={onChange} />);
    await user.selectOptions(screen.getByRole("combobox"), "1.25");
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
