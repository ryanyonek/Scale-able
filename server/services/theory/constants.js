// music theory constants
// scales, keys, modes, lyrics, octaves, transposing
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

export const chromaticFlatKeys = [
  "C","Db","D","Eb","E","F",
  "Gb","G","Ab","A","Bb","Cb"
];

export const chromaticSharpKeys = [
  "C","C#","D","D#","E","F",
  "F#","G","G#","A","A#","B"
];

export const transpositionKeys = ["C+", "B+", "Bb+", "A+", "Ab+", "G+", "Gb+", "F+", "E+", "Eb+", "D+", "Db+", "C", "B", "Bb-", "A-", "Ab-", "G-", "Gb-", "F-", "E-", "Eb-", "D-", "Db-", "C-", "B-"];
export const transpositionMap = {
  "C+": -12,
  "B+": -11,
  "Bb+": -10,
  "A+": -9,
  "Ab+": -8,
  "G+": -7,
  "Gb+": -6,
  "F+": -5,
  "E+": -4,
  "Eb+": -3,
  "D+": -2,
  "Db+": -1,
  "C": 0,
  "H": 1,
  "Bb-": 2,
  "A-": 3,
  "Ab-": 4,
  "G-": 5,
  "Gb-": 6,
  "F-": 7,
  "E-": 8,
  "Eb-": 9,
  "D-": 10,
  "Db-": 11,
  "C-": 12,
  "B-": 13
};

export const scaleDegrees = ["1", "2", "3", "4", "5", "6", "7", "8", "8", "7", "6", "5", "4", "3", "2", "1"];
export const majorSolfege = ["Do", "Re", "Mi", "Fa", "Sol", "La", "Ti", "Do", "Do", "Ti", "La", "Sol", "Fa", "Mi", "Re", "Do"];
export const naturalMinorSolfege = ["Do", "Re", "Me", "Fa", "Sol", "Le", "Te", "Do", "Do", "Te", "Le", "Sol", "Fa", "Me", "Re", "Do"];
export const harmonicMinorSolfege = ["Do", "Re", "Me", "Fa", "Sol", "Le", "Ti", "Do", "Do", "Ti", "Le", "Sol", "Fa", "Me", "Re", "Do"];
export const melodicMinorSolfege = ["Do", "Re", "Me", "Fa", "Sol", "La", "Ti", "Do", "Do", "Te", "Le", "Sol", "Fa", "Me", "Re", "Do"];
export const LYRIC_Y = 30;