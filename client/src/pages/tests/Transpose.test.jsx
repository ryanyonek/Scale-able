import { render, screen } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import Transpose from "../Transpose.jsx";

// Mock VexFlowSheet to avoid fetch/VexFlow/Tone.js setup
vi.mock("../../components/music/VexFlowSheet.jsx", () => ({
  default: ({ scaleTitle, endpoint, variant }) => (
    <div
      data-testid="vexflow-sheet"
      data-title={scaleTitle}
      data-endpoint={endpoint}
      data-variant={variant}
    />
  ),
}));

describe("Transpose", () => {
  it("renders the Transpose Scales heading", () => {
    render(<Transpose />);
    expect(
      screen.getByRole("heading", { name: /Transpose Scales/i })
    ).toBeInTheDocument();
  });

  it("renders exactly two VexFlowSheet components", () => {
    render(<Transpose />);
    expect(screen.getAllByTestId("vexflow-sheet")).toHaveLength(2);
  });

  it("renders the original (concert pitch) sheet with correct title", () => {
    render(<Transpose />);
    const sheets = screen.getAllByTestId("vexflow-sheet");
    const concertSheet = sheets.find(
      (el) => el.getAttribute("data-title") === "Sounding Pitch (Concert)"
    );
    expect(concertSheet).toBeDefined();
  });

  it("renders the transposed (written pitch) sheet with correct title", () => {
    render(<Transpose />);
    const sheets = screen.getAllByTestId("vexflow-sheet");
    const transposedSheet = sheets.find(
      (el) => el.getAttribute("data-title") === "Written Pitch (Transposed)"
    );
    expect(transposedSheet).toBeDefined();
  });

  it("original sheet uses the /api/scale endpoint", () => {
    render(<Transpose />);
    const sheets = screen.getAllByTestId("vexflow-sheet");
    const originalSheet = sheets.find(
      (el) => el.getAttribute("data-endpoint") === "/api/scale"
    );
    expect(originalSheet).toBeDefined();
  });

  it("transposed sheet uses the /api/transpose endpoint", () => {
    render(<Transpose />);
    const sheets = screen.getAllByTestId("vexflow-sheet");
    const transposedSheet = sheets.find(
      (el) => el.getAttribute("data-endpoint") === "/api/transpose"
    );
    expect(transposedSheet).toBeDefined();
  });

  it("original sheet uses the 'original' variant", () => {
    render(<Transpose />);
    const sheets = screen.getAllByTestId("vexflow-sheet");
    const originalSheet = sheets.find(
      (el) => el.getAttribute("data-variant") === "original"
    );
    expect(originalSheet).toBeDefined();
  });

  it("transposed sheet uses the 'transpose' variant", () => {
    render(<Transpose />);
    const sheets = screen.getAllByTestId("vexflow-sheet");
    const transposedSheet = sheets.find(
      (el) => el.getAttribute("data-variant") === "transpose"
    );
    expect(transposedSheet).toBeDefined();
  });
});
