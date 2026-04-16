import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ScaleNameDisplay from "../ScaleNameDisplay.jsx";

describe("ScaleNameDisplay", () => {
  it("shows tonic and scale when scale is not Major", () => {
    render(
      <ScaleNameDisplay
        selectedScale="Natural Minor"
        selectedTonic="A"
        selectedMode="Ionian"
        showMode={false}
      />
    );
    expect(screen.getByText("A Natural Minor")).toBeInTheDocument();
  });

  it("shows tonic and scale when scale is Major but showMode is false", () => {
    render(
      <ScaleNameDisplay
        selectedScale="Major"
        selectedTonic="C"
        selectedMode="Dorian"
        showMode={false}
      />
    );
    expect(screen.getByText("C Major")).toBeInTheDocument();
    expect(screen.queryByText(/Dorian/)).not.toBeInTheDocument();
  });

  it("shows tonic, scale, and mode when scale is Major and showMode is true", () => {
    render(
      <ScaleNameDisplay
        selectedScale="Major"
        selectedTonic="C"
        selectedMode="Dorian"
        showMode={true}
      />
    );
    expect(screen.getByText("C Major Dorian")).toBeInTheDocument();
  });

  it("mode is not shown for Harmonic Minor even when showMode is true", () => {
    render(
      <ScaleNameDisplay
        selectedScale="Harmonic Minor"
        selectedTonic="A"
        selectedMode="Ionian"
        showMode={true}
      />
    );
    // showMode only applies when scale === "Major"
    expect(screen.getByText("A Harmonic Minor")).toBeInTheDocument();
    expect(screen.queryByText(/Ionian/)).not.toBeInTheDocument();
  });

  it("displays different tonics correctly", () => {
    render(
      <ScaleNameDisplay
        selectedScale="Major"
        selectedTonic="Bb"
        selectedMode="Ionian"
        showMode={false}
      />
    );
    expect(screen.getByText("Bb Major")).toBeInTheDocument();
  });

  it("displays all seven modes when showMode is true", () => {
    const modes = ["Ionian", "Dorian", "Phrygian", "Lydian", "Mixolydian", "Aeolian", "Locrian"];
    modes.forEach((mode) => {
      const { unmount } = render(
        <ScaleNameDisplay
          selectedScale="Major"
          selectedTonic="C"
          selectedMode={mode}
          showMode={true}
        />
      );
      expect(screen.getByText(`C Major ${mode}`)).toBeInTheDocument();
      unmount();
    });
  });
});
