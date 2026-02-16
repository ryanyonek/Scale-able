import { chromaticKeys, transpositionMap } from "./constants.js";

export function transposeTonic(tonic, key) {
  const index = chromaticKeys.indexOf(tonic);
  const interval = transpositionMap[key];

  if (index === -1 || interval === undefined) {
    throw new Error("Invalid transposition");
  }

  const newIndex = (index + interval + 120) % 12;

  return chromaticKeys[newIndex];
}