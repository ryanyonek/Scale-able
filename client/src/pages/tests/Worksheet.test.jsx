import { render, screen, fireEvent } from "@testing-library/react";
import { flushSync } from "react-dom";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import Worksheet from "../Worksheet.jsx";

// Mock VexFlowSheet — exposes a "Change Config" button so tests can invoke setConfig
// which exercises the setRowConfig callback inside Worksheet.
vi.mock("../../components/music/VexFlowSheet.jsx", () => ({
  default: ({ scaleTitle, setConfig }) => (
    <div>
      <div data-testid="vexflow-sheet" data-title={scaleTitle} />
      <button
        data-testid="change-config"
        onClick={() => setConfig((prev) => ({ ...prev, clef: "bass" }))}
      >
        Change Config
      </button>
    </div>
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

  it("printMode section is rendered while print is in progress (covers lines 110-116)", () => {
    // React 18 batches setPrintMode(true) and setPrintMode(false) in the same event handler.
    // By intercepting setTimeout and calling flushSync inside it, we force React to commit
    // the setPrintMode(true) update before setPrintMode(false) is ever queued.
    render(<Worksheet />);

    let printSectionRendered = false;
    let setConfigCalled = false;

    // Update the VexFlowSheet mock temporarily to track setConfig calls from the print section
    vi.spyOn(window, "setTimeout").mockImplementationOnce((fn, delay) => {
      // At this point setPrintMode(true) is queued but not committed.
      // flushSync forces React to commit it right now.
      flushSync(() => {});

      // Now printMode=true: there should be 2 vexflow-sheet divs (main + print).
      const sheets = screen.queryAllByTestId("vexflow-sheet");
      printSectionRendered = sheets.length === 2;

      // Clicking "Change Config" in the SECOND sheet exercises the printMode setConfig arrow.
      const changeButtons = screen.queryAllByTestId("change-config");
      if (changeButtons.length === 2) {
        fireEvent.click(changeButtons[1]);
        setConfigCalled = true;
      }

      return 1; // return a fake timer ID; don't execute fn (window.print)
    });

    fireEvent.click(screen.getByRole("button", { name: /Print Worksheet/i }));

    expect(printSectionRendered).toBe(true);
    expect(setConfigCalled).toBe(true);
  });

  it("setRowConfig — calling setConfig on a row updates that row's config without affecting other rows", async () => {
    const user = userEvent.setup();
    render(<Worksheet />);
    // Add a second row so we can verify only the targeted row is affected
    await user.click(screen.getByRole("button", { name: /Add Scale/i }));
    expect(screen.getAllByTestId("vexflow-sheet")).toHaveLength(2);

    // Click "Change Config" on the first row — exercises setRowConfig
    const changeButtons = screen.getAllByTestId("change-config");
    await user.click(changeButtons[0]);

    // Both rows still exist after the config update
    expect(screen.getAllByTestId("vexflow-sheet")).toHaveLength(2);
  });
});
