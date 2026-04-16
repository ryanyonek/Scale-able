import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import AudioVolumeSlider from "../AudioVolumeSlider.jsx";

describe("AudioVolumeSlider", () => {
  it("renders the Volume label", () => {
    render(<AudioVolumeSlider volume={-20} onChange={vi.fn()} />);
    expect(screen.getByText(/Volume:/)).toBeInTheDocument();
  });

  it("renders a range input (slider)", () => {
    render(<AudioVolumeSlider volume={-20} onChange={vi.fn()} />);
    expect(screen.getByRole("slider")).toBeInTheDocument();
  });

  it("slider has min -30, max 0, step 1", () => {
    render(<AudioVolumeSlider volume={-20} onChange={vi.fn()} />);
    const slider = screen.getByRole("slider");
    expect(slider).toHaveAttribute("min", "-30");
    expect(slider).toHaveAttribute("max", "0");
    expect(slider).toHaveAttribute("step", "1");
  });

  it("slider reflects the current volume value", () => {
    render(<AudioVolumeSlider volume={-10} onChange={vi.fn()} />);
    expect(screen.getByRole("slider")).toHaveValue("-10");
  });

  it("calls onChange with a number when the slider changes", () => {
    const onChange = vi.fn();
    render(<AudioVolumeSlider volume={-20} onChange={onChange} />);
    fireEvent.change(screen.getByRole("slider"), { target: { value: "-5" } });
    expect(onChange).toHaveBeenCalledWith(-5);
  });

  it("calls onChange with a number (not a string)", () => {
    const onChange = vi.fn();
    render(<AudioVolumeSlider volume={-20} onChange={onChange} />);
    fireEvent.change(screen.getByRole("slider"), { target: { value: "-15" } });
    expect(typeof onChange.mock.calls[0][0]).toBe("number");
  });
});
