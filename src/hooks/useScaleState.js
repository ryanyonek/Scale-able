import { useState } from "react";

export function useScaleState() {
  return {
    selectedTonic: useState("C"),
    selectedScale: useState("Major"),
    selectedClef: useState("treble"),
    selectedMode: useState("Ionian"),
    showCourtesyAccidentals: useState(true),
    showAllAccidentals: useState(false),
    showNoteLabels: useState(true),
    selectedLyric: useState("Note Names"),
    octaveShift: useState("current"),
    directionMode: useState("both"),
  };
}