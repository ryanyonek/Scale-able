import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach } from "vitest";
import VexFlowSheet from "../VexFlowSheet.jsx";

// Mock VexFlowRenderer so VexFlow doesn't try to render canvas/SVG in jsdom
vi.mock("../VexFlowRenderer.jsx", () => ({
  default: ({ scaleData }) => (
    <div
      data-testid="vexflow-renderer"
      data-has-scale={scaleData ? "true" : "false"}
    />
  ),
}));

// Mock the Tone.js audio hook so the Web Audio API isn't required in jsdom
vi.mock("../../../hooks/useToneScaleAudio.js", () => ({
  useToneScaleAudio: () => ({ play: vi.fn(), stop: vi.fn(), audioError: null }),
}));

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

const mockScaleData = {
  key: "C",
  firstMeasure: {
    notes: ["c/4", "d/4", "e/4", "f/4", "g/4", "a/4", "b/4", "c/5"],
    lyrics: ["C", "D", "E", "F", "G", "A", "B", "C"],
    accidentals: [null, null, null, null, null, null, null, null],
  },
  secondMeasure: {
    notes: ["c/5", "b/4", "a/4", "g/4", "f/4", "e/4", "d/4", "c/4"],
    lyrics: ["C", "B", "A", "G", "F", "E", "D", "C"],
    accidentals: [],
  },
};

const defaultConfig = {
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

describe("VexFlowSheet", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockScaleData),
    });
  });

  // --- Fetch behavior ---

  it("calls fetch with the correct endpoint and config body on mount", async () => {
    render(
      <VexFlowSheet
        config={defaultConfig}
        setConfig={vi.fn()}
        endpoint="http://localhost:5000/api/scale"
        variant="original"
      />
    );
    await waitFor(() =>
      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:5000/api/scale",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(defaultConfig),
        })
      )
    );
  });

  it("passes scaleData to VexFlowRenderer after a successful fetch", async () => {
    render(
      <VexFlowSheet
        config={defaultConfig}
        setConfig={vi.fn()}
        endpoint="http://localhost:5000/api/scale"
        variant="original"
      />
    );
    await waitFor(() =>
      expect(screen.getByTestId("vexflow-renderer")).toHaveAttribute(
        "data-has-scale",
        "true"
      )
    );
  });

  it("re-fetches when the config prop changes", async () => {
    const { rerender } = render(
      <VexFlowSheet
        config={defaultConfig}
        setConfig={vi.fn()}
        endpoint="http://localhost:5000/api/scale"
        variant="original"
      />
    );
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    rerender(
      <VexFlowSheet
        config={{ ...defaultConfig, tonic: "G" }}
        setConfig={vi.fn()}
        endpoint="http://localhost:5000/api/scale"
        variant="original"
      />
    );
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
  });

  // --- Error states ---

  it("shows a server error message when fetch responds with a non-OK status", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500 });
    render(
      <VexFlowSheet
        config={defaultConfig}
        setConfig={vi.fn()}
        endpoint="http://localhost:5000/api/scale"
        variant="original"
      />
    );
    await waitFor(() =>
      expect(
        screen.getByText(/Could not load scale \(server error 500\)/)
      ).toBeInTheDocument()
    );
  });

  it("shows a network error message when fetch throws", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Network Error"));
    render(
      <VexFlowSheet
        config={defaultConfig}
        setConfig={vi.fn()}
        endpoint="http://localhost:5000/api/scale"
        variant="original"
      />
    );
    await waitFor(() =>
      expect(
        screen.getByText(/Could not connect to the server/)
      ).toBeInTheDocument()
    );
  });

  // --- Control panel visibility ---

  it("control panel is hidden when showControls is false", () => {
    render(
      <VexFlowSheet
        config={{ ...defaultConfig, showControls: false }}
        setConfig={vi.fn()}
        endpoint="http://localhost:5000/api/scale"
        variant="original"
      />
    );
    expect(screen.queryByText(/Scale:/)).not.toBeInTheDocument();
  });

  it("control panel renders scale controls when showControls is true", () => {
    render(
      <VexFlowSheet
        config={{ ...defaultConfig, showControls: true }}
        setConfig={vi.fn()}
        endpoint="http://localhost:5000/api/scale"
        variant="original"
      />
    );
    expect(screen.getByText(/Scale:/)).toBeInTheDocument();
  });

  // --- Conditional controls ---

  it("CourtesyAccidentalsToggle does not render for non-Melodic Minor scales", () => {
    render(
      <VexFlowSheet
        config={{ ...defaultConfig, showControls: true, scale: "Major" }}
        setConfig={vi.fn()}
        endpoint="http://localhost:5000/api/scale"
        variant="original"
      />
    );
    expect(
      screen.queryByText(/Show Courtesy Accidentals/)
    ).not.toBeInTheDocument();
  });

  it("CourtesyAccidentalsToggle renders only for Melodic Minor", () => {
    render(
      <VexFlowSheet
        config={{ ...defaultConfig, showControls: true, scale: "Melodic Minor" }}
        setConfig={vi.fn()}
        endpoint="http://localhost:5000/api/scale"
        variant="original"
      />
    );
    expect(screen.getByText(/Show Courtesy Accidentals/)).toBeInTheDocument();
  });

  it("ShowModeToggle does not render for minor scales", () => {
    render(
      <VexFlowSheet
        config={{ ...defaultConfig, showControls: true, scale: "Natural Minor" }}
        setConfig={vi.fn()}
        endpoint="http://localhost:5000/api/scale"
        variant="original"
      />
    );
    expect(screen.queryByText(/Show Major Modes/)).not.toBeInTheDocument();
  });

  it("ShowModeToggle renders only when scale is Major", () => {
    render(
      <VexFlowSheet
        config={{ ...defaultConfig, showControls: true, scale: "Major" }}
        setConfig={vi.fn()}
        endpoint="http://localhost:5000/api/scale"
        variant="original"
      />
    );
    expect(screen.getByText(/Show Major Modes/)).toBeInTheDocument();
  });

  // --- Audio controls ---

  it("audio controls render at the default measureSize of 580", () => {
    render(
      <VexFlowSheet
        config={{ ...defaultConfig, measureSize: 580 }}
        setConfig={vi.fn()}
        endpoint="http://localhost:5000/api/scale"
        variant="original"
      />
    );
    expect(screen.getByRole("button", { name: /Play/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Stop/i })).toBeInTheDocument();
  });

  it("audio controls do not render at measureSize 480", () => {
    render(
      <VexFlowSheet
        config={{ ...defaultConfig, measureSize: 480 }}
        setConfig={vi.fn()}
        endpoint="http://localhost:5000/api/scale"
        variant="original"
      />
    );
    expect(screen.queryByRole("button", { name: /Play/i })).not.toBeInTheDocument();
  });

  it("audio controls do not render for the transpose variant even at measureSize 580", () => {
    render(
      <VexFlowSheet
        config={{ ...defaultConfig, measureSize: 580 }}
        setConfig={vi.fn()}
        endpoint="http://localhost:5000/api/transpose"
        variant="transpose"
      />
    );
    expect(screen.queryByRole("button", { name: /Play/i })).not.toBeInTheDocument();
  });

  // --- Tonic auto-reset ---

  it("calls setConfig to reset tonic to C when Major scale has a non-major tonic", () => {
    const setConfig = vi.fn();
    // A# is not in majorKeys
    render(
      <VexFlowSheet
        config={{ ...defaultConfig, scale: "Major", tonic: "A#" }}
        setConfig={setConfig}
        endpoint="http://localhost:5000/api/scale"
        variant="original"
      />
    );
    const updaterCall = setConfig.mock.calls.find(
      (call) => typeof call[0] === "function"
    );
    expect(updaterCall).toBeDefined();
    const updated = updaterCall[0]({ ...defaultConfig, scale: "Major", tonic: "A#" });
    expect(updated.tonic).toBe("C");
  });

  it("calls setConfig to reset tonic to A when a minor scale has a non-minor tonic", () => {
    const setConfig = vi.fn();
    // Db is not in minorKeys
    render(
      <VexFlowSheet
        config={{ ...defaultConfig, scale: "Natural Minor", tonic: "Db" }}
        setConfig={setConfig}
        endpoint="http://localhost:5000/api/scale"
        variant="original"
      />
    );
    const updaterCall = setConfig.mock.calls.find(
      (call) => typeof call[0] === "function"
    );
    expect(updaterCall).toBeDefined();
    const updated = updaterCall[0]({
      ...defaultConfig,
      scale: "Natural Minor",
      tonic: "Db",
    });
    expect(updated.tonic).toBe("A");
  });

  it("does not reset tonic when scale and tonic are already compatible", () => {
    const setConfig = vi.fn();
    render(
      <VexFlowSheet
        config={defaultConfig}
        setConfig={setConfig}
        endpoint="http://localhost:5000/api/scale"
        variant="original"
      />
    );
    // setConfig should not have been called with a function updater
    const updaterCall = setConfig.mock.calls.find(
      (call) => typeof call[0] === "function"
    );
    expect(updaterCall).toBeUndefined();
  });
});
