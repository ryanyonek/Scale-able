import { describe, it, expect } from "vitest";
import { generateScale } from "../generateScale.js";

const baseConfig = {
  tonic: "C",
  scale: "Major",
  mode: "Ionian",
  clef: "treble",
  octaveShift: "current",
  directionMode: "both",
  octaveTranspose: 0,
  lyric: "Note Names",
  showNoteLabels: true,
  showAllAccidentals: false,
  showCourtesyAccidentals: false,
};

describe("generateScale", () => {
  it("returns null for an unknown tonic", () => {
    const result = generateScale({ ...baseConfig, tonic: "X" });
    expect(result).toBeNull();
  });

  it("returns an object with key, firstMeasure, and secondMeasure", () => {
    const result = generateScale(baseConfig);
    expect(result).toHaveProperty("key");
    expect(result).toHaveProperty("firstMeasure");
    expect(result).toHaveProperty("secondMeasure");
  });

  it("C Major — key is 'C'", () => {
    const result = generateScale(baseConfig);
    expect(result.key).toBe("C");
  });

  it("each measure has notes, lyrics, and accidentals arrays", () => {
    const result = generateScale(baseConfig);
    expect(Array.isArray(result.firstMeasure.notes)).toBe(true);
    expect(Array.isArray(result.firstMeasure.lyrics)).toBe(true);
    expect(Array.isArray(result.firstMeasure.accidentals)).toBe(true);
  });

  it("C Major ascending first measure has 8 notes", () => {
    const result = generateScale(baseConfig);
    expect(result.firstMeasure.notes).toHaveLength(8);
  });

  it("C Major Note Names — first measure lyrics match capitalized note names", () => {
    const result = generateScale(baseConfig);
    expect(result.firstMeasure.lyrics[0]).toBe("C");
    expect(result.firstMeasure.lyrics[4]).toBe("G");
    expect(result.firstMeasure.lyrics[6]).toBe("B");
    expect(result.firstMeasure.lyrics[7]).toBe("C"); // octave repeat
  });

  it("showNoteLabels false — no lyrics in either measure", () => {
    const result = generateScale({ ...baseConfig, showNoteLabels: false });
    expect(result.firstMeasure.lyrics).toHaveLength(0);
    expect(result.secondMeasure.lyrics).toHaveLength(0);
  });

  it("Scale Degrees lyric mode — degrees 1–7 then 1 again", () => {
    const result = generateScale({ ...baseConfig, lyric: "Scale Degrees" });
    expect(result.firstMeasure.lyrics[0]).toBe("1");
    expect(result.firstMeasure.lyrics[6]).toBe("7");
    expect(result.firstMeasure.lyrics[7]).toBe("1");
  });

  it("Solfege lyric mode — starts with Do", () => {
    const result = generateScale({ ...baseConfig, lyric: "Solfege" });
    expect(result.firstMeasure.lyrics[0]).toBe("Do");
  });

  it("C Major key signature — no accidentals needed (all null) in first measure", () => {
    const result = generateScale(baseConfig);
    expect(result.firstMeasure.accidentals.every((a) => a === null)).toBe(true);
  });

  it("showAllAccidentals true — all first measure accidentals are non-null", () => {
    const result = generateScale({ ...baseConfig, showAllAccidentals: true });
    expect(result.firstMeasure.accidentals.every((a) => a !== null)).toBe(true);
  });

  it("ascending direction mode — second measure has no notes or lyrics", () => {
    const result = generateScale({ ...baseConfig, directionMode: "ascending" });
    expect(result.secondMeasure.notes).toHaveLength(0);
    expect(result.secondMeasure.lyrics).toHaveLength(0);
  });

  it("descending direction mode — first measure has no notes or lyrics", () => {
    const result = generateScale({ ...baseConfig, directionMode: "descending" });
    expect(result.firstMeasure.notes).toHaveLength(0);
    expect(result.firstMeasure.lyrics).toHaveLength(0);
  });

  it("G Major — key is 'G', F# is in the key signature so no explicit accidental is returned", () => {
    const result = generateScale({ ...baseConfig, tonic: "G" });
    expect(result.key).toBe("G");
    // F# is covered by the G Major key signature; the engine returns null for it
    // (explicit accidentals are only returned for notes outside the key signature)
    const fIndex = result.firstMeasure.notes.findIndex((n) => n.startsWith("f"));
    expect(result.firstMeasure.accidentals[fIndex]).toBeNull();
  });

  it("A Natural Minor — key and notes are produced correctly", () => {
    const result = generateScale({ ...baseConfig, tonic: "A", scale: "Natural Minor" });
    expect(result).not.toBeNull();
    expect(result.firstMeasure.notes).toHaveLength(8);
    expect(result.firstMeasure.notes[0]).toBe("a/4");
  });
});
