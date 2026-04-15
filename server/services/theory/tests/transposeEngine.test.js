import { describe, it, expect } from "vitest";
import { transposeTonic } from "../transposeEngine.js";

describe("transposeTonic", () => {
  it("unison (0: C) — returns the same tonic with no octave change", () => {
    const result = transposeTonic("C", "0: C", "Major");
    expect(result.newTonic).toBe("C");
    expect(result.octaveTranspose).toBe(0);
  });

  it("octave up (+12: C) — same tonic, octaveTranspose is +1", () => {
    const result = transposeTonic("C", "+12: C", "Major");
    expect(result.newTonic).toBe("C");
    expect(result.octaveTranspose).toBe(1);
  });

  it("octave down (-12: C) — same tonic, octaveTranspose is -1", () => {
    const result = transposeTonic("C", "-12: C", "Major");
    expect(result.newTonic).toBe("C");
    expect(result.octaveTranspose).toBe(-1);
  });

  it("+7: F (F instrument / french horn) — C concert pitch transposes to G", () => {
    const result = transposeTonic("C", "+7: F", "Major");
    expect(result.newTonic).toBe("G");
    expect(result.octaveTranspose).toBe(0);
  });

  it("+2: Bb (Bb instrument / trumpet) — C concert pitch transposes to D", () => {
    const result = transposeTonic("C", "+2: Bb", "Major");
    expect(result.newTonic).toBe("D");
    expect(result.octaveTranspose).toBe(0);
  });

  it("+3: A (A instrument / clarinet) — C concert pitch transposes to Eb", () => {
    const result = transposeTonic("C", "+3: A", "Major");
    expect(result.newTonic).toBe("Eb");
    expect(result.octaveTranspose).toBe(0);
  });

  it("returns an object with newTonic and octaveTranspose properties", () => {
    const result = transposeTonic("C", "0: C", "Major");
    expect(result).toHaveProperty("newTonic");
    expect(result).toHaveProperty("octaveTranspose");
  });

  it("throws for a null transposition token", () => {
    expect(() => transposeTonic("C", null, "Major")).toThrow("Invalid transposition");
  });

  it("G Major with +7: F transposition — transposes to D", () => {
    const result = transposeTonic("G", "+7: F", "Major");
    expect(result.newTonic).toBe("D");
  });

  it("minor scale uses minor-valid enharmonic (A minor, +2: Bb) → B minor", () => {
    const result = transposeTonic("A", "+2: Bb", "Natural Minor");
    expect(result.newTonic).toBe("B");
  });
});
