import Scale from "../Scale";
import { render, screen } from "@testing-library/react";
import { debug } from "vitest-preview";

global.ResizeObserver = class {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {
    // You can leave this empty or add any implementation needed for your tests
  }
  unobserve() {
    // You can leave this empty or add any implementation needed for your tests
  }
  disconnect() {
    // You can leave this empty or add any implementation needed for your tests
  }
};

const config = {
  tonic: "C",
  scale: "Major",
  clef: "treble",
  showAllAccidentals: false,
  showCourtesyAccidentals: true,
  directionMode: "both",
  showMode: false,
  mode: "Ionian",
  showNoteLabels: true,
  lyric: "Note Names",
  octaveShift: "current",
  transpositionKey: "0: C",
  showControls: false,
  measureSize: 580,
  octaveTranspose: 0,
  printMode: false,
};

const options = config;

describe("Scale.jsx", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.resetAllMocks();
  });

  it("should render the main scale title text", () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(options),
          }),
      }),
    );
    render(<Scale />);
    debug();
    expect(
      screen.getByRole("heading", { name: "Scale Viewer" }),
    ).toBeInTheDocument();
  });
});
