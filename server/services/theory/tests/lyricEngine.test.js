import { describe, it, expect } from "vitest";
import { buildLyrics } from "../lyricEngine.js";

const ascNotes = ["c", "d", "e", "f", "g", "a", "b", "c"];
const descNotes = ["c", "b", "a", "g", "f", "e", "d", "c"];

const baseArgs = {
  scale: "Major",
  mode: "Ionian",
  lyric: "Note Names",
  shift: 0,
  showNoteLabels: true,
  directionMode: "both",
  firstMeasureNotesRaw: ascNotes,
  secondMeasureNotesRaw: descNotes,
};

describe("buildLyrics", () => {
  it("Note Names — capitalizes first letter of each note", () => {
    const { firstMeasureLyrics } = buildLyrics(baseArgs);
    expect(firstMeasureLyrics[0]).toBe("C");
    expect(firstMeasureLyrics[4]).toBe("G");
  });

  it("capitalizeNoteName returns empty string for a falsy note (covers defensive branch)", () => {
    // Pass an empty string in the notes array to exercise the !note guard
    const { firstMeasureLyrics } = buildLyrics({
      ...baseArgs,
      firstMeasureNotesRaw: ["", "c", "d"],
      secondMeasureNotesRaw: [],
    });
    expect(firstMeasureLyrics[0]).toBe("");
    expect(firstMeasureLyrics[1]).toBe("C");
  });

  it("showNoteLabels false — both measure lyrics are empty", () => {
    const { firstMeasureLyrics, secondMeasureLyrics } = buildLyrics({
      ...baseArgs,
      showNoteLabels: false,
    });
    expect(firstMeasureLyrics).toHaveLength(0);
    expect(secondMeasureLyrics).toHaveLength(0);
  });

  it("Scale Degrees (Ionian) — degrees 1–7 then 1", () => {
    const { firstMeasureLyrics } = buildLyrics({ ...baseArgs, lyric: "Scale Degrees" });
    expect(firstMeasureLyrics[0]).toBe("1");
    expect(firstMeasureLyrics[6]).toBe("7");
    expect(firstMeasureLyrics[7]).toBe("1");
  });

  it("Scale Degrees with Dorian mode (shift=1) — rotates the degree sequence", () => {
    // Dorian shift=1: degrees start at 2,3,4,5,6,7,1 → wraps to 1 at end
    const { firstMeasureLyrics } = buildLyrics({
      ...baseArgs,
      lyric: "Scale Degrees",
      scale: "Major",
      mode: "Dorian",
      shift: 1,
    });
    expect(firstMeasureLyrics[0]).toBe("2"); // rotated start
    expect(firstMeasureLyrics[6]).toBe("1"); // wrapped around
  });

  it("Solfege (Major Ionian) — first syllable is Do", () => {
    const { firstMeasureLyrics } = buildLyrics({ ...baseArgs, lyric: "Solfege" });
    expect(firstMeasureLyrics[0]).toBe("Do");
    expect(firstMeasureLyrics[2]).toBe("Mi");
  });

  it("Solfege with Dorian mode (shift=1) — rotates solfege syllables", () => {
    const { firstMeasureLyrics } = buildLyrics({
      ...baseArgs,
      lyric: "Solfege",
      scale: "Major",
      mode: "Dorian",
      shift: 1,
    });
    // Dorian shifts by 1: Re becomes the first syllable
    expect(firstMeasureLyrics[0]).toBe("Re");
  });

  it("Solfege with Melodic Minor — descending measure uses natural minor solfege", () => {
    const { secondMeasureLyrics } = buildLyrics({
      ...baseArgs,
      lyric: "Solfege",
      scale: "Melodic Minor",
      mode: "Ionian",
      shift: 0,
    });
    // Melodic Minor descending uses the last 8 entries of melodicMinorSolfege (natural-minor descending)
    expect(secondMeasureLyrics).toHaveLength(8);
    expect(secondMeasureLyrics[0]).toBe("Do"); // top note of descending
  });

  it("ascending directionMode — second measure lyrics are empty", () => {
    const { secondMeasureLyrics } = buildLyrics({
      ...baseArgs,
      directionMode: "ascending",
    });
    expect(secondMeasureLyrics).toHaveLength(0);
  });

  it("descending directionMode — first measure lyrics are empty", () => {
    const { firstMeasureLyrics } = buildLyrics({
      ...baseArgs,
      directionMode: "descending",
    });
    expect(firstMeasureLyrics).toHaveLength(0);
  });
});
