import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { useState } from "react";
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

  // --- Control onChange handlers (cover inline setConfig callbacks) ---

  // A stateful wrapper so the setConfig updater functions are actually invoked
  function StatefulWrapper({ initialConfig, endpoint, variant }) {
    const [config, setConfig] = useState(initialConfig);
    return (
      <VexFlowSheet
        config={config}
        setConfig={setConfig}
        endpoint={endpoint}
        variant={variant}
      />
    );
  }

  function renderWithControls(overrides = {}) {
    return render(
      <StatefulWrapper
        initialConfig={{ ...defaultConfig, showControls: true, ...overrides }}
        endpoint="http://localhost:5000/api/scale"
        variant="original"
      />
    );
  }

  it("ShowControls onChange — toggling Show Scale Controls updates showControls state", async () => {
    const user = userEvent.setup();
    render(
      <StatefulWrapper
        initialConfig={{ ...defaultConfig, showControls: false }}
        endpoint="http://localhost:5000/api/scale"
        variant="original"
      />
    );
    // ShowControls checkbox is always visible
    const checkbox = screen.getByRole("checkbox", { name: /Show Scale Controls/i });
    await user.click(checkbox);
    // After toggling, the controls panel should appear
    expect(screen.getByText(/Scale:/)).toBeInTheDocument();
  });

  it("TonicSelect onChange — selecting a tonic updates the config", async () => {
    const user = userEvent.setup();
    renderWithControls({ tonic: "C" });
    const tonicSelect = screen.getByRole("combobox", { name: /Select Tonic/i });
    await user.selectOptions(tonicSelect, "G");
    expect(tonicSelect.value).toBe("G");
  });

  it("ScaleSelect onChange — selecting a scale type updates the config", async () => {
    const user = userEvent.setup();
    renderWithControls();
    // ScaleSelect's <label> is not wrapping the <select>, so query by current display value
    const scaleSelect = screen.getByDisplayValue("Major");
    await user.selectOptions(scaleSelect, "Natural Minor");
    expect(scaleSelect.value).toBe("Natural Minor");
  });

  it("ClefSelect onChange — selecting bass clef updates the config", async () => {
    const user = userEvent.setup();
    renderWithControls();
    const clefSelect = screen.getByRole("combobox", { name: /Select Clef/i });
    await user.selectOptions(clefSelect, "bass");
    expect(clefSelect.value).toBe("bass");
  });

  it("AllAccidentalsToggle onChange — toggling Show All Accidentals updates the config", async () => {
    const user = userEvent.setup();
    renderWithControls({ showAllAccidentals: false });
    const toggle = screen.getByRole("checkbox", { name: /Show All Accidentals/i });
    await user.click(toggle);
    expect(toggle).toBeChecked();
  });

  it("NoteLabelsToggle onChange — toggling Show Note Labels updates the config", async () => {
    const user = userEvent.setup();
    renderWithControls({ showNoteLabels: true });
    const toggle = screen.getByRole("checkbox", { name: /Show Note Labels/i });
    await user.click(toggle);
    expect(toggle).not.toBeChecked();
  });

  it("LyricsSelect onChange — selecting a lyric type updates the config", async () => {
    const user = userEvent.setup();
    renderWithControls({ showNoteLabels: true });
    const lyricsSelect = screen.getByRole("combobox", { name: /Note Label/i });
    await user.selectOptions(lyricsSelect, "Scale Degrees");
    expect(lyricsSelect.value).toBe("Scale Degrees");
  });

  it("DirectionSelect onChange — selecting ascending-only updates the config", async () => {
    const user = userEvent.setup();
    renderWithControls({ directionMode: "both" });
    const dirSelect = screen.getByRole("combobox", { name: /Scale Direction/i });
    await user.selectOptions(dirSelect, "ascending");
    expect(dirSelect.value).toBe("ascending");
  });

  it("OctaveSelect onChange — selecting 8va updates the config", async () => {
    const user = userEvent.setup();
    renderWithControls({ octaveShift: "current" });
    const octaveSelect = screen.getByRole("combobox", { name: /^Octave/i });
    await user.selectOptions(octaveSelect, "8va");
    expect(octaveSelect.value).toBe("8va");
  });

  it("ShowModeToggle onChange — enabling Show Major Modes reveals ModeSelect", async () => {
    const user = userEvent.setup();
    renderWithControls({ scale: "Major", showMode: false });
    const modeToggle = screen.getByRole("checkbox", { name: /Show Major Modes/i });
    await user.click(modeToggle);
    expect(screen.getByRole("combobox", { name: /Select Major Mode/i })).toBeInTheDocument();
  });

  it("ModeSelect onChange — selecting Dorian updates the config", async () => {
    const user = userEvent.setup();
    renderWithControls({ scale: "Major", showMode: true });
    const modeSelect = screen.getByRole("combobox", { name: /Select Major Mode/i });
    await user.selectOptions(modeSelect, "Dorian");
    expect(modeSelect.value).toBe("Dorian");
  });

  it("CourtesyAccidentalsToggle onChange — toggling updates the config", async () => {
    const user = userEvent.setup();
    renderWithControls({ scale: "Melodic Minor", tonic: "A", showCourtesyAccidentals: true });
    const toggle = screen.getByRole("checkbox", { name: /Show Courtesy Accidentals/i });
    await user.click(toggle);
    expect(toggle).not.toBeChecked();
  });

  it("TranspositionSelect onChange — selecting a transposition key updates the config", async () => {
    const user = userEvent.setup();
    render(
      <StatefulWrapper
        initialConfig={{ ...defaultConfig, transpositionKey: "0: C" }}
        endpoint="http://localhost:5000/api/transpose"
        variant="transpose"
      />
    );
    const transSelect = screen.getByRole("combobox", { name: /Select Transposition/i });
    await user.selectOptions(transSelect, "+2: Bb");
    expect(transSelect.value).toBe("+2: Bb");
  });

  it("AudioTempoSelect onChange — changing tempo updates state", async () => {
    const user = userEvent.setup();
    renderWithControls({ measureSize: 580 });
    // AudioTempoSelect has no label text — identify it by its unique "2x" option
    const tempoSelect = screen.getByRole("option", { name: "2x" }).closest("select");
    await user.selectOptions(tempoSelect, "2");
    expect(tempoSelect.value).toBe("2");
  });

  it("AudioVolumeSlider onChange — adjusting slider updates volume state", () => {
    renderWithControls({ measureSize: 580 });
    const slider = screen.getByRole("slider");
    fireEvent.change(slider, { target: { value: "-10" } });
    expect(slider.value).toBe("-10");
  });
});
