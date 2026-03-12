import scales from "../../data/scales.json" with { type: "json" };
import { modeShifts, diatonicOrder, octaveLevels } from "./constants.js";

export function buildScaleData({
  tonic,
  scale,
  mode,
  clef,
  octaveShift,
  directionMode,
  octaveTranspose = 0
}) {

    console.log(`Current tonic: ${tonic}`);
    const scaleName = `${tonic} ${scale}`;
    const foundScale = scales.find((s) => s.name === scaleName);
    if (!foundScale) {
        return;
    }

    const key = foundScale.key;
    const notes = [...foundScale.notes];

    // --- Helper: Assign octaves for ascending sequences ---
    const assignOctavesAscending = (notesArray, startingOctave) => {
        let octave = startingOctave + octaveTranspose;
        let lastIndex = null;
        return notesArray.map((note) => {
            const base = note.split("/")[0];
            const pitchIndex = diatonicOrder.indexOf(base[0]);
            if (lastIndex !== null && pitchIndex < lastIndex) {
                octave++; // wrap from B -> C
            }
            lastIndex = pitchIndex;
            return `${base}/${octaveLevels[octave]}`;
        });
    };

    // --- Helper: Assign octaves for descending sequences ---
    const assignOctavesDescending = (notesArray, startingOctave) => {
        let octave = startingOctave + octaveTranspose;
        let lastIndex = null;
        return notesArray.map((note) => {
            const base = note.split("/")[0];
            const pitchIndex = diatonicOrder.indexOf(base[0]);
            if (lastIndex !== null && pitchIndex > lastIndex) {
                octave--; // wrap from C -> B
            }
            lastIndex = pitchIndex;
            return `${base}/${octaveLevels[octave]}`;
        });
    };

    const getOctaveOffset = () => {
        switch (octaveShift) {
        case "8vb":
            return -1;
        case "8va":
            return 1;
        default:
            return 0;
        }
    };

    // --- Apply mode for major scales ---
    let modeNotes = notes.slice(0, 7); // first 7 notes only
    const shift = modeShifts[mode] || 0;

    let firstMeasureNotesRaw = [];
    let secondMeasureNotesRaw = [];

    // Rotate for selected mode
    if (scale === "Major" && mode !== "Ionian") {
        modeNotes = [...modeNotes.slice(shift), ...modeNotes.slice(0, shift)];
    } 

    // --- Prepare first and second measures ---
    // First measure: first 7 notes + repeat first note at end
    firstMeasureNotesRaw = modeNotes.slice(0,7);
    firstMeasureNotesRaw.push(firstMeasureNotesRaw[0]);

    // Second measure: last 7 notes, reversed + repeat first note at end
    if (scale === "Melodic Minor") {
        secondMeasureNotesRaw = notes.slice(-8);
    } else {
        secondMeasureNotesRaw = firstMeasureNotesRaw.slice(0,8).reverse();
    }

    // --- Apply direction mode ---
    if (directionMode === "ascending") {
        secondMeasureNotesRaw = [];
    }

    if (directionMode === "descending") {
        firstMeasureNotesRaw = [];
    }

    // --- Octave assignment ---
    const octaveOffset = getOctaveOffset();

    console.log(`Octave transpose offset: ${octaveTranspose}`);

    const adjustedStartingOctave = (clef === "treble" ? 2 : 1) + octaveOffset;
    const firstMeasureNotes = assignOctavesAscending(firstMeasureNotesRaw, adjustedStartingOctave);
    const secondMeasureNotes = assignOctavesDescending(secondMeasureNotesRaw, adjustedStartingOctave + 1);

    return {
        key,
        shift,
        firstMeasureNotes,
        secondMeasureNotes,
        firstMeasureNotesRaw,
        secondMeasureNotesRaw
    };
}