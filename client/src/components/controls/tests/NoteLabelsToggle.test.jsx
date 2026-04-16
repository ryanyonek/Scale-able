import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect } from "vitest";
import NoteLabelsToggle from "../NoteLabelsToggle.jsx";

describe("NoteLabelsToggle", () => {
  it("renders the Show Note Labels label", () => {
    render(<NoteLabelsToggle value={false} onChange={vi.fn()} />);
    expect(screen.getByText(/Show Note Labels/)).toBeInTheDocument();
  });

  it("renders a checkbox input", () => {
    render(<NoteLabelsToggle value={false} onChange={vi.fn()} />);
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("checkbox is unchecked when value is false", () => {
    render(<NoteLabelsToggle value={false} onChange={vi.fn()} />);
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("checkbox is checked when value is true", () => {
    render(<NoteLabelsToggle value={true} onChange={vi.fn()} />);
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("calls onChange with true when unchecked checkbox is clicked", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<NoteLabelsToggle value={false} onChange={onChange} />);
    await user.click(screen.getByRole("checkbox"));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("calls onChange with false when checked checkbox is clicked", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<NoteLabelsToggle value={true} onChange={onChange} />);
    await user.click(screen.getByRole("checkbox"));
    expect(onChange).toHaveBeenCalledWith(false);
  });
});
