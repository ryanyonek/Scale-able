import { chromaticFlatKeys, chromaticSharpKeys, transpositionMap, majorKeys, minorKeys } from "./constants.js";

export function transposeTonic(tonic, key) {
  //console.log(`Flat Key Index: ${chromaticFlatKeys.indexOf(tonic)}`);
  //console.log(`Sharp Key Index: ${chromaticSharpKeys.indexOf(tonic)}`);
  //console.log(`Transposing instrument key: ${key}`);
  //console.log(`Concert pitch key: ${tonic}`)
  
  let index = 0;
  let keys = [];

  // assigning a number to the key
  if (chromaticFlatKeys.indexOf(tonic) !== -1) {
    index = chromaticFlatKeys.indexOf(tonic);
    keys = chromaticFlatKeys;
  } else if (chromaticSharpKeys.indexOf(tonic) !== -1) {
    index = chromaticSharpKeys.indexOf(tonic);
    keys = chromaticSharpKeys;
  }

  //console.log(`Keys after index assignment: ${keys}`)

  // transposing operation
  const interval = transpositionMap[key];

  if (index === -1 || interval === undefined) {
    throw new Error("Invalid transposition");
  }

  const newIndex = (index + interval + 12) % 12;

  if (majorKeys.indexOf(keys[newIndex]) !== -1) {
    keys = chromaticFlatKeys;
  } else if (minorKeys.indexOf(keys[newIndex]) !== -1) {
    keys = chromaticSharpKeys;
  }

  return keys[newIndex];
}