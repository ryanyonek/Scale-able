import {
  Stave,
  StaveNote,
  Formatter,
  Accidental,
  Barline,
  Annotation,
  Voice
} from "vexflow";
import scales from "../../scales.json";

// paste:
export const octaveLevels = ["2", "3", "4", "5", "6"];
export const diatonicOrder = ["c", "d", "e", "f", "g", "a", "b"];
export const majorKeys = ["C#", "F#", "B", "E", "A", "D", "G", "C", "F",  "Bb", "Eb", "Ab", "Db", "Gb", "Cb"];
export const minorKeys = ["A#", "D#", "G#", "C#","F#","B", "E", "A", "D", "G",  "C", "F", "Bb", "Eb", "Ab"]
export const modeShifts = {
  "Ionian": 0,
  "Dorian": 1,
  "Phrygian": 2,
  "Lydian": 3,
  "Mixolydian": 4,
  "Aeolian": 5,
  "Locrian": 6
};
export const scaleTypes = ["Major", "Natural Minor", "Harmonic Minor", "Melodic Minor"];
export const keySignatures = {
  "C": [],
  "G": ["f#"],
  "D": ["f#", "c#"],
  "A": ["f#", "c#", "g#"],
  "E": ["f#", "c#", "g#", "d#"],
  "B": ["f#", "c#", "g#", "d#", "a#"],
  "F#": ["f#", "c#", "g#", "d#", "a#", "e#"],
  "C#": ["f#", "c#", "g#", "d#", "a#", "e#", "b#"],

  "F": ["bb"],
  "Bb": ["bb", "eb"],
  "Eb": ["bb", "eb", "ab"],
  "Ab": ["bb", "eb", "ab", "db"],
  "Db": ["bb", "eb", "ab", "db", "gb"],
  "Gb": ["bb", "eb", "ab", "db", "gb", "cb"],
  "Cb": ["bb", "eb", "ab", "db", "gb", "cb", "fb"],
};

export const keySignatureMap = {
  "C": {},
  "G": { "f": "#" },
  "D": { "f": "#", "c": "#" },
  "A": { "f": "#", "c": "#", "g": "#" },
  "E": { "f": "#", "c": "#", "g": "#", "d": "#" },
  "B": { "f": "#", "c": "#", "g": "#", "d": "#", "a": "#" },
  "F#": { "f": "#", "c": "#", "g": "#", "d": "#", "a": "#", "e": "#"},
  "C#": { "f": "#", "c": "#", "g": "#", "d": "#", "a": "#", "e": "#", "b": "#"},
  "F": { "b": "b" },
  "Bb": { "b": "b", "e": "b" },
  "Eb": { "b": "b", "e": "b", "a": "b" },
  "Ab": { "b": "b", "e": "b", "a": "b", "d": "b" },
  "Db": { "b": "b", "e": "b", "a": "b", "d": "b", "g": "b"},
  "Gb": { "b": "b", "e": "b", "a": "b", "d": "b", "g": "b", "c": "b"},
  "Cb": { "b": "b", "e": "b", "a": "b", "d": "b", "g": "b", "c": "b", "f": "b"}
};

export const scaleDegrees = ["1", "2", "3", "4", "5", "6", "7", "8", "8", "7", "6", "5", "4", "3", "2", "1"];
export const majorSolfege = ["Do", "Re", "Mi", "Fa", "Sol", "La", "Ti", "Do", "Do", "Ti", "La", "Sol", "Fa", "Mi", "Re", "Do"];
export const naturalMinorSolfege = ["Do", "Re", "Me", "Fa", "Sol", "Le", "Te", "Do", "Do", "Te", "Le", "Sol", "Fa", "Me", "Re", "Do"];
export const harmonicMinorSolfege = ["Do", "Re", "Me", "Fa", "Sol", "Le", "Ti", "Do", "Do", "Ti", "Le", "Sol", "Fa", "Me", "Re", "Do"];
export const melodicMinorSolfege = ["Do", "Re", "Me", "Fa", "Sol", "La", "Ti", "Do", "Do", "Te", "Le", "Sol", "Fa", "Me", "Re", "Do"];
export const LYRIC_Y = 30;

export function renderScale({
  context,
  selectedTonic,
  selectedScale,
  selectedClef,
  selectedMode,
  showAllAccidentals,
  showCourtesyAccidentals,
  octaveShift,
  directionMode,
  selectedLyric,
  showNoteLabels,
}) {
  
  
  // - getNoteParts

    // --- Helpers ---
    const getNoteParts = (note) => {
      const base = note.split("/")[0];
      const match = base.match(/^([a-g])(bb|##|b|#)?$/i);
      if (!match) {
        return { letter: null, accidental: null };
      }

      return {
        letter: match[1].toLowerCase(),
        accidental: match[2] ?? null,
      };
    };

    const accidentalToSymbol = (acc) => acc || "n";

    const needsAccidental = (note, key) => {
      const { letter, accidental } = getNoteParts(note);
      if (!letter) {
        return false;
      }

      const keyAccList = keySignatures[key] ?? [];
      const keyAcc = keyAccList.find(
        (k) => k[0].toLowerCase() === letter
      );

      if (!keyAcc && !accidental) {
        return false;
      } 
      if (!keyAcc && accidental) {
        return true;
      }
      if (keyAcc && !accidental) {
        return true;
      }
      if (keyAcc && accidental) {
        return keyAcc[1] !== accidental;
      }
      return false;
    };

    

    const scaleName = `${selectedTonic} ${selectedScale}`;
    const foundScale = scales.find((s) => s.name === scaleName);
    if (!foundScale) {
      return;
    }

    const key = foundScale.key;
    const notes = [...foundScale.notes];

    // --- Helper: Capitalize note names properly ---
    const capitalizeNoteName = (note) => {
      if (!note) {
        return "";
      }
      return note[0].toUpperCase() + note.slice(1); // keeps b/#/bb/## intact
    };

    // --- Helper: Assign octaves for ascending sequences ---
    const assignOctavesAscending = (notesArray, startingOctave) => {
      let octave = startingOctave;
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
      let octave = startingOctave;
      let lastIndex = null;
      return notesArray.map((note) => {
        const base = note.split("/")[0];
        const pitchIndex = diatonicOrder.indexOf(base[0]);
        if (lastIndex !== null && pitchIndex > lastIndex) octave--; // wrap from C -> B
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
    const shift = modeShifts[selectedMode] || 0;

    let firstMeasureLyrics = [];
    let secondMeasureLyrics = [];

    let firstMeasureNotesRaw = [];
    let secondMeasureNotesRaw = [];

    // Rotate for selected mode
    if (selectedScale === "Major" && selectedMode !== "Ionian") {
      modeNotes = [...modeNotes.slice(shift), ...modeNotes.slice(0, shift)];
    } 

    // --- Prepare first and second measures ---
    // First measure: first 7 notes + repeat first note at end
    firstMeasureNotesRaw = modeNotes.slice(0,7);
    firstMeasureNotesRaw.push(firstMeasureNotesRaw[0]);

    // Second measure: last 7 notes, reversed + repeat first note at end
    if (selectedScale === "Melodic Minor") {
      secondMeasureNotesRaw = notes.slice(-8);
    } else {
      secondMeasureNotesRaw = firstMeasureNotesRaw.slice(0,8).reverse();
    }

        // --- Split lyrics ---
    let baseLyrics = [];
    if (!showNoteLabels) {
      firstMeasureLyrics = [];
      secondMeasureLyrics = [];
    } else if (selectedLyric === "Note Names") {
      firstMeasureLyrics = firstMeasureNotesRaw.map(capitalizeNoteName);
      secondMeasureLyrics = secondMeasureNotesRaw.map(capitalizeNoteName);
    } else if (selectedLyric === "Scale Degrees") {
      baseLyrics = scaleDegrees.slice(0, 7);
      if (selectedScale === "Major" && selectedMode !== "Ionian") {
        baseLyrics = [...baseLyrics.slice(shift), ...baseLyrics.slice(0, shift)];
      } 
      firstMeasureLyrics = baseLyrics.slice(0,7);
      firstMeasureLyrics.push(firstMeasureLyrics[0]);
      secondMeasureLyrics = firstMeasureLyrics.slice(0,8).reverse();
    } else if (selectedLyric === "Solfege") {
      const solfegeMap = {
        "Major": majorSolfege,
        "Natural Minor": naturalMinorSolfege,
        "Harmonic Minor": harmonicMinorSolfege,
        "Melodic Minor": melodicMinorSolfege,
      };
      baseLyrics = solfegeMap[selectedScale].slice(0, 7);
      if (selectedScale === "Major" && selectedMode !== "Ionian") {
        baseLyrics = [...baseLyrics.slice(shift), ...baseLyrics.slice(0, shift)];
      } 
      firstMeasureLyrics = baseLyrics.slice(0,7);
      firstMeasureLyrics.push(firstMeasureLyrics[0]);
      if (selectedScale === "Melodic Minor") {
        secondMeasureLyrics = solfegeMap[selectedScale].slice(-8)
      } else {
        secondMeasureLyrics = firstMeasureLyrics.slice(0,8).reverse();
      }
    }


    // --- Apply direction mode ---
    if (directionMode === "ascending") {
      secondMeasureNotesRaw = [];
      secondMeasureLyrics = [];
    }

    if (directionMode === "descending") {
      firstMeasureNotesRaw = [];
      firstMeasureLyrics = []
    }

    // --- Octave assignment ---
    const octaveOffset = getOctaveOffset();

    const startingOctave = (selectedClef === "treble" ? 2 : 1) + octaveOffset;
    const firstMeasureNotes = assignOctavesAscending(firstMeasureNotesRaw, startingOctave);
    const secondMeasureNotes = assignOctavesDescending(secondMeasureNotesRaw, startingOctave + 1); //



  // - accidental logic

    // --- Accidentals for first measure ---
    const firstMeasureAccidentals = firstMeasureNotesRaw.map((note) => {
      const base = note.split("/")[0];
      if (showAllAccidentals) {
        return accidentalToSymbol(getNoteParts(base).accidental ?? "n");
      }
      if (needsAccidental(base, key)) {
        return accidentalToSymbol(getNoteParts(base).accidental);
      } 
      return null;
    });

    // --- Accidentals for second measure ---
    // NEEDS FIX, melodic minor accidentals, only show courtesy accidentals if in the key signature, use key signature map
    const secondMeasureAccidentals = secondMeasureNotes.map((note, i) => {
      const base = note.split("/")[0];
      const { accidental } = getNoteParts(base);

      if (selectedScale === "Harmonic Minor") {
        const harmonicMinorScale = scales.find(
          (s) => s.name === `${selectedTonic} Harmonic Minor`
        )?.notes;
        if (harmonicMinorScale) {
          const descendingIndex = secondMeasureNotes.length - 1 - i;
          if (descendingIndex === 6) {
            const targetNote = harmonicMinorScale[descendingIndex].split("/")[0];
            const { accidental: targetAcc } = getNoteParts(targetNote);
            return { symbol: accidentalToSymbol(targetAcc ?? "n"), cautionary: false };
          }
        }
      }

      if (selectedScale === "Melodic Minor") {
        const naturalMinorScale = scales.find(
          (s) => s.name === `${selectedTonic} Natural Minor`
        )?.notes;
        if (naturalMinorScale) {
          const descendingIndex = secondMeasureNotes.length - 1 - i;
          if (descendingIndex === 6 || descendingIndex === 5) {
            const targetNote = naturalMinorScale[descendingIndex].split("/")[0];
            const { accidental: targetAcc } = getNoteParts(targetNote);
            if (showCourtesyAccidentals) {
              return { symbol: accidentalToSymbol(targetAcc ?? "n"), cautionary: true };
            } else if (showAllAccidentals) {
              return { symbol: accidentalToSymbol(targetAcc ?? "n"), cautionary: false };
            }
          }
        }
      } 

      if (showAllAccidentals) {
        return { symbol: accidentalToSymbol(accidental ?? "n"), cautionary: false };
      }

      return { symbol: "", cautionary: false };
    });


  // - stave creation
  // - voice formatting
  // --- Render ---
  try {

    let stave1 = null;
    let stave2 = null;

    if (firstMeasureNotesRaw.length > 0) {
      stave1 = new Stave(0, 40, 560);

      // Clef
      stave1.addClef(selectedClef);

      // 🔒 Fixed key signature width (v5 style)
      stave1.addKeySignature(key);

      stave1.setContext(context).draw();
    }

    if (secondMeasureNotesRaw.length > 0) {
      stave2 = new Stave(560, 40, 500);
      stave2.setContext(context).setEndBarType(Barline.type.DOUBLE).draw();
    }

    let notes1VF = [];
    if (firstMeasureNotesRaw.length > 0) {
      notes1VF = firstMeasureNotes.map((n, i) => {
        const note = new StaveNote({ keys: [n], duration: "w", clef: selectedClef });
        note.setStave(stave1); // ✅ now valid

        const acc = firstMeasureAccidentals[i];
        const lyric = firstMeasureLyrics[i];

        if (acc) {
          note.addModifier(new Accidental(acc), 0);
        }
        

        if (lyric) {
          const ann = new Annotation(lyric)
            .setFont("Times", 12)
            .setVerticalJustification(Annotation.VerticalJustify.BOTTOM)
            .setJustification(Annotation.HorizontalJustify.CENTER);

          ann.y = stave1.getYForBottomText() + LYRIC_Y;
          note.addModifier(ann, 0);
        }

        return note;
      });
    }

    let notes2VF = [];
    if (secondMeasureNotesRaw.length > 0) {
      notes2VF = secondMeasureNotes.map((n, i) => {
        const note = new StaveNote({ keys: [n], duration: "w", clef: selectedClef });
        note.setStave(stave2); // ✅ now valid
        note.ignoreKeySignature = true;

        const acc = secondMeasureAccidentals[i];
        const lyric = secondMeasureLyrics[i];

        if (acc && acc.symbol) {
          const accidental = new Accidental(acc.symbol);
          if (acc.cautionary) accidental.setAsCautionary();
          note.addModifier(accidental, 0);
        }

        if (lyric) {
          const ann = new Annotation(lyric)
            .setFont("Times", 12)
            .setVerticalJustification(Annotation.VerticalJustify.BOTTOM)
            .setJustification(Annotation.HorizontalJustify.CENTER);

          ann.y = stave2.getYForBottomText() + LYRIC_Y;
          note.addModifier(ann, 0);
        }

        return note;
      });
    }

    const createVoice = (noteCount) =>
      new Voice({
        num_beats: noteCount * 4,
        beat_value: 4,
      }).setStrict(false);

    if (notes1VF.length > 0 && stave1) {
      const voice1 = createVoice(notes1VF.length);
      voice1.addTickables(notes1VF);
      const formatter = new Formatter();

      formatter.joinVoices([voice1]);
      formatter.formatToStave([voice1], stave1);
      voice1.draw(context, stave1);
    }

    if (notes2VF.length > 0 && stave2) {
      const voice2 = createVoice(notes2VF.length);
      voice2.addTickables(notes2VF);
      const formatter = new Formatter();
      formatter.joinVoices([voice2]);
      formatter.formatToStave([voice2], stave2);
      voice2.draw(context, stave2);
    }

    } catch (e) {
      console.error("VexFlow render error:", e);
  }

}