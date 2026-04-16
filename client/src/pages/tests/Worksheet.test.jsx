import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import Worksheet from "../Worksheet.jsx";

// Mock VexFlowSheet to avoid fetch/VexFlow/Tone.js setup
vi.mock("../../components/music/VexFlowSheet.jsx", () => ({
  default: ({ scaleTitle }) => (
    <div data-testid="vexflow-sheet" data-title={scaleTitle} />
  ),
}));

beforeEach(() => {
  vi.spyOn(window, "print").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe("Worksheet", () => {
  it("renders the Scale-able Worksheet heading", () => {
    render(<Worksheet />);
    expect(
      screen.getByRole("heading", { name: /Scale-able Worksheet/i })
    ).toBeInTheDocument();
  });

  it("renders the Add Scale button", () => {
    render(<Worksheet />);
    expect(
      screen.getByRole("button", { name: /Add Scale/i })
    ).toBeInTheDocument();
  });

  it("renders the Print Worksheet button", () => {
    render(<Worksheet />);
    expect(
      screen.getByRole("button", { name: /Print Worksheet/i })
    ).toBeInTheDocument();
  });

  it("starts with one scale row rendered", () => {
    render(<Worksheet />);
    expect(screen.getAllByTestId("vexflow-sheet")).toHaveLength(1);
  });

  it("Add Scale button shows the current count in its label", () => {
    render(<Worksheet />);
    expect(screen.getByRole("button", { name: /Add Scale \(1\)/i })).toBeInTheDocument();
  });

  it("clicking Add Scale adds a new scale row", async () => {
    const user = userEvent.setup();
    render(<Worksheet />);
    await user.click(screen.getByRole("button", { name: /Add Scale/i }));
    expect(screen.getAllByTestId("vexflow-sheet")).toHaveLength(2);
  });

  it("the Add Scale count updates after adding a row", async () => {
    const user = userEvent.setup();
    render(<Worksheet />);
    await user.click(screen.getByRole("button", { name: /Add Scale/i }));
    expect(screen.getByRole("button", { name: /Add Scale \(2\)/i })).toBeInTheDocument();
  });

  it("each scale row has a Remove button", () => {
    render(<Worksheet />);
    expect(
      screen.getByRole("button", { name: /Remove/i })
    ).toBeInTheDocument();
  });

  it("clicking Remove removes that scale row", async () => {
    const user = userEvent.setup();
    render(<Worksheet />);
    // Add a second row first
    await user.click(screen.getByRole("button", { name: /Add Scale/i }));
    expect(screen.getAllByTestId("vexflow-sheet")).toHaveLength(2);
    // Remove the first row
    const removeButtons = screen.getAllByRole("button", { name: /Remove/i });
    await user.click(removeButtons[0]);
    expect(screen.getAllByTestId("vexflow-sheet")).toHaveLength(1);
  });

  it("removing all scales leaves an empty worksheet", async () => {
    const user = userEvent.setup();
    render(<Worksheet />);
    await user.click(screen.getByRole("button", { name: /Remove/i }));
    expect(screen.queryAllByTestId("vexflow-sheet")).toHaveLength(0);
  });

  it("can add multiple scales and each gets a unique Scale title", async () => {
    const user = userEvent.setup();
    render(<Worksheet />);
    await user.click(screen.getByRole("button", { name: /Add Scale/i }));
    await user.click(screen.getByRole("button", { name: /Add Scale/i }));
    const sheets = screen.getAllByTestId("vexflow-sheet");
    const titles = sheets.map((el) => el.getAttribute("data-title"));
    expect(new Set(titles).size).toBe(sheets.length);
  });

  it("calls window.print when the Print Worksheet button is clicked", () => {
    // Use fake timers so we can advance past the 100 ms setTimeout in handleClick
    vi.useFakeTimers();
    render(<Worksheet />);
    fireEvent.click(screen.getByRole("button", { name: /Print Worksheet/i }));
    vi.advanceTimersByTime(200);
    expect(window.print).toHaveBeenCalled();
  });
});
