import { chromaticFlatKeys, chromaticSharpKeys, majorKeys, minorKeys } from "./constants.js";

function parseTranspositionToken(token) {
  const match = token?.match(/^([A-G](?:b|#)?)([+-])?$/);

  if (!match) {
    throw new Error("Invalid transposition");
  }

  const [, targetKey, directionSymbol] = match;

  let octaveDirection = 0;
  if (directionSymbol === "+") {
    octaveDirection = -1;
  } else if (directionSymbol === "-") {
    octaveDirection = 1;
  }

  return {
    targetKey,
    octaveDirection
  };
}

export function transposeTonic(tonic, key, scale) {
  //console.log(`Tonic: ${tonic}`);
  //console.log(`Transposition Key: ${key}`)
  //console.log(`Flat Key Index: ${chromaticFlatKeys.indexOf(tonic)}`);
  //console.log(`Sharp Key Index: ${chromaticSharpKeys.indexOf(tonic)}`);
  //console.log(`Transposing instrument key: ${key}`);
  //console.log(`Concert pitch key: ${tonic}`)
  //console.log(`Scale: ${scale}`)
  
  let index = -1;
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

  if (index === -1) {
    throw new Error("Invalid transposition");
  }

  const { targetKey, octaveDirection } = parseTranspositionToken(key);
  const targetKeyIndex = chromaticFlatKeys.indexOf(targetKey) !== -1
    ? chromaticFlatKeys.indexOf(targetKey)
    : chromaticSharpKeys.indexOf(targetKey);

  if (targetKeyIndex === -1) {
    throw new Error("Invalid transposition");
  }

  const semitoneClassShift = (12 - targetKeyIndex) % 12;
  const octaveShiftSteps = octaveDirection;

  const newIndex = (index + semitoneClassShift + 12) % 12;

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

    return {
    newTonic: keys[newIndex],
    octaveTranspose: octaveShiftSteps
  };
}