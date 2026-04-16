import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect } from "vitest";
import AudioStopButton from "../AudioStopButton.jsx";

describe("AudioStopButton", () => {
  it("renders a Stop button", () => {
    render(<AudioStopButton onChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: /Stop/i })).toBeInTheDocument();
  });

  it("calls onChange when the Stop button is clicked", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<AudioStopButton onChange={onChange} />);
    await user.click(screen.getByRole("button", { name: /Stop/i }));
    expect(onChange).toHaveBeenCalled();
  });

  it("calls onChange exactly once per click", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<AudioStopButton onChange={onChange} />);
    await user.click(screen.getByRole("button", { name: /Stop/i }));
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
