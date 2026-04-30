import {
  chromaticFlatKeys,
  chromaticSharpKeys,
  majorKeys,
  minorKeys,
  diatonicOrder,
  keySignatures,
} from "./constants.js";

function parseTranspositionToken(token, tonic) {
  if (!token) {
    throw new Error("Invalid transposition");
  }

  //console.log(`Token: ${token}`);

  const regexDirectionSymbol = /[+\-]/;
  const regexInterval = /\d+/;
  const regexKey = /[A-G][b#]?/;

  const directionSymbol = token.match(regexDirectionSymbol);
  const intervalString = token.match(regexInterval).toString();
  const transposedKey = token.match(regexKey).toString();

  //console.log(`Transposed key: ${transposedKey}`);
  let stringDirectionSymbol = "";
  if (directionSymbol) {
    stringDirectionSymbol = directionSymbol.toString();
    //console.log(`Direction Symbol: ${directionSymbol}`);
  }

  let octaveDirection = 0;

  let uppercaseDiatonicOrder = [];
  diatonicOrder.map((note) => {
    uppercaseDiatonicOrder.push(note.toUpperCase());
  });

  //console.log(`Diatonic order: ${uppercaseDiatonicOrder}`);

  const interval = parseInt(intervalString);
  const transposedIndex = uppercaseDiatonicOrder.indexOf(transposedKey[0]);
  const tonicIndex = uppercaseDiatonicOrder.indexOf(tonic[0]);

  //console.log(`Transposed index: ${transposedIndex}`);
  //console.log(`Tonic index: ${tonicIndex}`);

  const indexInterval = Math.abs(tonicIndex - transposedIndex);

  //console.log(`Index interval: ${indexInterval}`);
  //console.log(`Direction Symbol: ${stringDirectionSymbol}`);

  if (
    (diatonicOrder[tonicIndex + indexInterval] == null ||
      indexInterval === 0) &&
    stringDirectionSymbol === "+"
  ) {
    octaveDirection = 1; // wrap from B -> C
  } else if (
    (diatonicOrder[tonicIndex - indexInterval] == null ||
      indexInterval === 0) &&
    stringDirectionSymbol === "-"
  ) {
    octaveDirection = -1; // wrap from C -> B
  } else {
    octaveDirection = 0;
  }

  if (interval == 12 && stringDirectionSymbol === "+") {
    octaveDirection = 1;
  } else if (interval == 12 && stringDirectionSymbol === "-") {
    octaveDirection = -1;
  }

  //console.log(`Octave direction: ${octaveDirection}`);

  return {
    transposedKey,
    octaveDirection,
  };
}

export function transposeTonic(tonic, keyInput, scale) {
  let index = -1;
  let keys = [];

  //console.log(`Input Transposition Key: ${keyInput}`);
  //console.log(`Concert Pitch Tonic: ${tonic}`);

  const { transposedKey, octaveDirection } = parseTranspositionToken(
    keyInput,
    tonic,
  );

  //console.log(`Target key: ${transposedKey}`);
  //console.log(`Octave direction: ${octaveDirection}`);

  //console.log(`Index of key in chromatic flat keys: ${chromaticFlatKeys.indexOf(transposedKey)}`);
  //console.log(`Index of key in chromatic sharp keys: ${chromaticSharpKeys.indexOf(transposedKey)}`);

  if (chromaticFlatKeys.indexOf(tonic) !== -1) {
    index = chromaticFlatKeys.indexOf(tonic);
  } else {
    index = chromaticSharpKeys.indexOf(tonic);
  }

  //console.log(`Original tonic index: ${index}`);

  const transposedKeyIndex =
    chromaticFlatKeys.indexOf(transposedKey) !== -1
      ? chromaticFlatKeys.indexOf(transposedKey)
      : chromaticSharpKeys.indexOf(transposedKey);

  //console.log(`Transposed Key Index: ${transposedKeyIndex}`);

  if (transposedKeyIndex === -1) {
    throw new Error("Invalid transposedKeyIndex");
  }

  const semitoneClassShift = (12 - transposedKeyIndex) % 12;
  const octaveShiftSteps = octaveDirection;

  const newIndex = (index + semitoneClassShift + 12) % 12;

  keys = chromaticFlatKeys;

  if (minorKeys.indexOf(keys[newIndex]) === -1 && scale !== "Major") {
    if (keys === chromaticFlatKeys) {
      keys = chromaticSharpKeys;
    } else {
      keys = chromaticFlatKeys;
    }
  } else if (majorKeys.indexOf(keys[newIndex]) === -1 && scale === "Major") {
    if (keys === chromaticFlatKeys) {
      keys = chromaticSharpKeys;
    } else {
      keys = chromaticFlatKeys;
    }
  }

  //console.log(`New index: ${newIndex}`);
  //console.log(`chromaticFlatKeys[newIndex]: ${chromaticFlatKeys[newIndex]}`);
  //console.log(`chromaticSharpKeys[newIndex]: ${chromaticSharpKeys[newIndex]}`);

  if (
    (majorKeys.indexOf(chromaticFlatKeys[newIndex]) !== -1 &&
      majorKeys.indexOf(chromaticSharpKeys[newIndex]) !== -1 &&
      scale === "Major") ||
    (minorKeys.indexOf(chromaticFlatKeys[newIndex]) !== -1 &&
      minorKeys.indexOf(chromaticSharpKeys[newIndex]) !== -1 &&
      scale !== "Major")
  ) {
    if (
      keySignatures[chromaticFlatKeys[newIndex]].length <
      keySignatures[chromaticSharpKeys[newIndex]].length
    ) {
      keys = chromaticFlatKeys;
    } else if (
      keySignatures[chromaticSharpKeys[newIndex]].length <
      keySignatures[chromaticFlatKeys[newIndex]].length
    ) {
      keys = chromaticSharpKeys;
    } else {
      keys = chromaticFlatKeys;
    }
  }

  //console.log(`Keys: ${keys}`);

  //console.log(`New Tonic: ${keys[newIndex]}`);

  return {
    newTonic: keys[newIndex],
    octaveTranspose: octaveShiftSteps,
  };
}
