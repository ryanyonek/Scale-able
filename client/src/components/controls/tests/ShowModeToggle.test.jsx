import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect } from "vitest";
import ShowModeToggle from "../ShowModeToggle.jsx";

describe("ShowModeToggle", () => {
  it("renders the Show Major Modes label", () => {
    render(<ShowModeToggle value={false} onChange={vi.fn()} />);
    expect(screen.getByText(/Show Major Modes/)).toBeInTheDocument();
  });

  it("renders a checkbox input", () => {
    render(<ShowModeToggle value={false} onChange={vi.fn()} />);
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("checkbox is unchecked when value is false", () => {
    render(<ShowModeToggle value={false} onChange={vi.fn()} />);
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("checkbox is checked when value is true", () => {
    render(<ShowModeToggle value={true} onChange={vi.fn()} />);
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("calls onChange with true when unchecked checkbox is clicked", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<ShowModeToggle value={false} onChange={onChange} />);
    await user.click(screen.getByRole("checkbox"));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("calls onChange with false when checked checkbox is clicked", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<ShowModeToggle value={true} onChange={onChange} />);
    await user.click(screen.getByRole("checkbox"));
    expect(onChange).toHaveBeenCalledWith(false);
  });
});
