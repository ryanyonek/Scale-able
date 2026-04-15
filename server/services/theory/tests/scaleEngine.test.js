import { describe, it, expect } from "vitest";
import { buildScaleData } from "../scaleEngine.js";

const baseConfig = {
  tonic: "C",
  scale: "Major",
  mode: "Ionian",
  clef: "treble",
  octaveShift: "current",
  directionMode: "both",
  octaveTranspose: 0,
};

describe("buildScaleData", () => {
  it("returns undefined for an unknown scale name", () => {
    expect(buildScaleData({ ...baseConfig, tonic: "X" })).toBeUndefined();
  });

  it("C Major treble clef — ascending first measure has correct octave-numbered notes", () => {
    const result = buildScaleData(baseConfig);
    expect(result.firstMeasureNotes).toEqual([
      "c/4", "d/4", "e/4", "f/4", "g/4", "a/4", "b/4", "c/5",
    ]);
  });

  it("C Major treble clef — descending second measure has correct octave-numbered notes", () => {
    const result = buildScaleData(baseConfig);
    expect(result.secondMeasureNotes).toEqual([
      "c/5", "b/4", "a/4", "g/4", "f/4", "e/4", "d/4", "c/4",
    ]);
  });

  it("B→C pitch transition increments the octave number in ascending sequences", () => {
    const result = buildScaleData(baseConfig);
    const notes = result.firstMeasureNotes;
    const bIndex = notes.indexOf("b/4");
    const cRepeat = notes[bIndex + 1];
    expect(cRepeat).toBe("c/5");
  });

  it("C→B pitch transition decrements the octave number in descending sequences", () => {
    const result = buildScaleData(baseConfig);
    const notes = result.secondMeasureNotes;
    const cIndex = notes.indexOf("c/5");
    const bAfter = notes[cIndex + 1];
    expect(bAfter).toBe("b/4");
  });

  it("ascending direction mode — second measure is empty", () => {
    const result = buildScaleData({ ...baseConfig, directionMode: "ascending" });
    expect(result.secondMeasureNotes).toHaveLength(0);
    expect(result.firstMeasureNotes).toHaveLength(8);
  });

  it("descending direction mode — first measure is empty", () => {
    const result = buildScaleData({ ...baseConfig, directionMode: "descending" });
    expect(result.firstMeasureNotes).toHaveLength(0);
    expect(result.secondMeasureNotes).toHaveLength(8);
  });

  it("Dorian mode (shift 1) — D becomes the root of C Major", () => {
    const result = buildScaleData({ ...baseConfig, mode: "Dorian" });
    expect(result.firstMeasureNotes[0]).toBe("d/4");
    expect(result.firstMeasureNotes[7]).toBe("d/5");
  });

  it("Mixolydian mode (shift 4) — G becomes the root of C Major", () => {
    const result = buildScaleData({ ...baseConfig, mode: "Mixolydian" });
    expect(result.firstMeasureNotes[0]).toBe("g/4");
  });

  it("bass clef starts one octave lower than treble clef", () => {
    const treble = buildScaleData(baseConfig);
    const bass = buildScaleData({ ...baseConfig, clef: "bass" });
    expect(treble.firstMeasureNotes[0]).toBe("c/4");
    expect(bass.firstMeasureNotes[0]).toBe("c/3");
  });

  it("8va octave shift raises the starting octave by 1", () => {
    const result = buildScaleData({ ...baseConfig, octaveShift: "8va" });
    expect(result.firstMeasureNotes[0]).toBe("c/5");
  });

  it("8vb octave shift lowers the starting octave by 1", () => {
    const result = buildScaleData({ ...baseConfig, octaveShift: "8vb" });
    expect(result.firstMeasureNotes[0]).toBe("c/3");
  });

  it("returns the correct key signature identifier", () => {
    const result = buildScaleData(baseConfig);
    expect(result.key).toBe("C");
  });

  it("returns the correct mode shift value", () => {
    const ionian = buildScaleData({ ...baseConfig, mode: "Ionian" });
    const dorian = buildScaleData({ ...baseConfig, mode: "Dorian" });
    expect(ionian.shift).toBe(0);
    expect(dorian.shift).toBe(1);
  });

  it("first measure always has 8 notes (7 scale degrees + octave repeat)", () => {
    const result = buildScaleData(baseConfig);
    expect(result.firstMeasureNotes).toHaveLength(8);
  });

  it("second measure always has 8 notes in both direction mode", () => {
    const result = buildScaleData(baseConfig);
    expect(result.secondMeasureNotes).toHaveLength(8);
  });

  it("Melodic Minor uses different descending notes than ascending", () => {
    const result = buildScaleData({
      ...baseConfig,
      tonic: "A",
      scale: "Melodic Minor",
    });
    // Ascending and descending raw notes should differ for Melodic Minor
    const ascNotes = result.firstMeasureNotesRaw.join(",");
    const descNotes = result.secondMeasureNotesRaw.join(",");
    expect(ascNotes).not.toBe(descNotes);
  });

  it("octaveTranspose shifts all notes up by the given number of octaves", () => {
    const normal = buildScaleData(baseConfig);
    const shifted = buildScaleData({ ...baseConfig, octaveTranspose: 1 });
    expect(normal.firstMeasureNotes[0]).toBe("c/4");
    expect(shifted.firstMeasureNotes[0]).toBe("c/5");
  });
});
