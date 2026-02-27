import { chromaticFlatKeys, chromaticSharpKeys, transpositionMap, majorKeys, minorKeys } from "./constants.js";

export function transposeTonic(tonic, key, scale) {
  //console.log(`Tonic: ${tonic}`);
  //console.log(`Transposition Key: ${key}`)
  //console.log(`Flat Key Index: ${chromaticFlatKeys.indexOf(tonic)}`);
  //console.log(`Sharp Key Index: ${chromaticSharpKeys.indexOf(tonic)}`);
  //console.log(`Transposing instrument key: ${key}`);
  //console.log(`Concert pitch key: ${tonic}`)
  //console.log(`Scale: ${scale}`)
  
  let index = 0;
  let keys = [];
  let octaveOffset = 0;

  

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

  if (minorKeys.indexOf(keys[newIndex]) === -1 && scale !== "Major") {
    if (keys === chromaticFlatKeys) {
      keys = chromaticSharpKeys;
    } else {
      keys = chromaticFlatKeys
    }
  } else if (majorKeys.indexOf(keys[newIndex]) === -1 && scale === "Major") {
    if (keys === chromaticFlatKeys) {
      keys = chromaticSharpKeys;
    } else {
      keys = chromaticFlatKeys
    }
  }

  return keys[newIndex];
}