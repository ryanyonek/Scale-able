import React, { useEffect, useRef, useState } from "react";
import {
  Renderer,
  Stave,
  StaveNote,
  Beam,
  Formatter,
  Accidental,
} from "vexflow";
import scales from "./../../scales.json";

export default function VexFlowSheet() {
  const containerRef = useRef(null);
  const octave = ["2", "3", "4", "5", "6"];
  const pitchClasses = ["B#/C", "C#/Db", "D", "D#/Eb", "E/Fb", "E#/F", "F#/Gb", "G", "G#/Ab", "A", "A#/Bb", "B/Cb"];
  const majorKeys = ["C#", "F#", "B", "E", "A", "D", "G", "C", "F",  "Bb", "Eb", "Ab", "Db", "Gb", "Cb"];
  const minorKeys = ["A#", "D#", "G#", "C#","F#","B", "E", "A", "D", "G",  "C", "F", "Bb", "Eb", "Ab"]
  const modeOperations = ["Ionian", "Dorian", "Phrygian", "Lydian", "Mixolydian", "Aeolian", "Locrian"];
  const scaleTypes = ["Major", "Natural Minor", "Harmonic Minor", "Melodic Minor"];

  // React state
  const [selectedScaleName, setSelectedScaleName] = useState("C Major");
  const [selectedTonic, setSelectedTonic] = useState("C");
  const [selectedScale, setSelectedScale] = useState("Major");
  const [selectedClef, setSelectedClef] = useState("treble");
  const [selectedMode, setSelectedMode] = useState("Ionian");
  const [hasAccidentals, setHasAccidentals] = useState(false);

useEffect(() => {
  if (!containerRef.current) return;

  // Update scale name based on tonic + scale
  const scaleName = selectedTonic + " " + selectedScale;
  setSelectedScaleName(scaleName);

  // Find the scale in JSON
  const foundScale = scales.find((scale) => scale.name === scaleName);
  if (!foundScale) return;

  const key = foundScale.key;
  const notes = [...foundScale.notes]; // clone notes array
  const accidentals = [];

  // Transpose the scale if a mode other than Ionian is selected
  if (modeOperations.includes(selectedMode)) {
    const shiftAmount = modeOperations.indexOf(selectedMode);
    if (shiftAmount > 0) {
      notes.pop(); // remove last note
      for (let i = 0; i < shiftAmount; i++) {
        const shifted = notes.shift();
        notes.push(shifted);
      }
      notes.push(notes[0]); // repeat first note
    }
  }

  // Slice into first and second measure
  const firstMeasureNotesRaw = notes.slice(0, 8);
  const secondMeasureNotesRaw = notes.slice(-8);

  const firstMeasureAccidentals = [];
  const secondMeasureAccidentals = [];

  // Octave setup
  const octaveLevels = ["2", "3", "4", "5", "6"];
  let octaveIndex = selectedClef === "treble" ? 2 : 0;
  let prevNote = null;

  // FIRST MEASURE (ascending) — apply octave increase on C
  const firstMeasureNotes = firstMeasureNotesRaw.map((note, i) => {
    const baseNote = note.split("/")[0];

    // Accidentals
    firstMeasureAccidentals[i] = hasAccidentals ? baseNote[1] ?? "n" : "";

    // Increase octave on C if previous note was not C
    if (baseNote[0] === "c" && prevNote !== "c") {
      octaveIndex = Math.min(octaveIndex + 1, octaveLevels.length - 1);
    }

    prevNote = baseNote[0];
    return `${baseNote}/${octaveLevels[octaveIndex]}`;
  });

  // SECOND MEASURE (descending) — keep octave same as last note of first measure
  const secondMeasureNotes = secondMeasureNotesRaw.map((note, i) => {
    const baseNote = note.split("/")[0];
    secondMeasureAccidentals[i] = hasAccidentals ? baseNote[1] ?? "n" : "";

    // NO octave increase here — stay on last octave
    return `${baseNote}/${octaveLevels[octaveIndex]}`;
  });

  console.log(scaleName + " " + selectedMode);
  console.log("Ascending:", firstMeasureNotes);
  console.log("Descending:", secondMeasureNotes);

  // Clear previous SVG
  containerRef.current.innerHTML = "";

  // Renderer
  const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
  renderer.resize(1000, 300);
  const context = renderer.getContext();

  // Draw first measure
  const stave1 = new Stave(0, 20, 500);
  stave1.addClef(selectedClef).addKeySignature(key).setContext(context).draw();

  const notes1 = firstMeasureNotes.map(
    (n, i) =>
      new StaveNote({ keys: [n], duration: "8", clef: selectedClef }).addModifier(
        new Accidental(firstMeasureAccidentals[i]),
        0
      )
  );
  const beam1 = new Beam(notes1);
  Formatter.FormatAndDraw(context, stave1, notes1);

  // Draw second measure
  const stave2 = new Stave(stave1.width + stave1.x, 20, 500);
  stave2.setContext(context).draw();

  const notes2 = secondMeasureNotes.map(
    (n, i) =>
      new StaveNote({ keys: [n], duration: "8", clef: selectedClef }).addModifier(
        new Accidental(secondMeasureAccidentals[i]),
        0
      )
  );
  const beam2 = new Beam(notes2);
  Formatter.FormatAndDraw(context, stave2, notes2);

  beam1.setContext(context).draw();
  beam2.setContext(context).draw();
}, [selectedTonic, selectedScale, selectedClef, selectedMode, hasAccidentals]);


  return (
    <div style={{ width: "1000px", margin: "auto", padding: "20px" }}>
      {/* Dropdown to select scale */}
      <div style={{ marginBottom: "10px" }}>
        <label>
          Select Scale:{" "}
          <select
            value={selectedScale}
            onChange={(e) => setSelectedScale(e.target.value)}
          >
            {scaleTypes.map((scale) => (
              <option key={scale} value={scale}>
                {scale}
              </option>
            ))}
          </select>
        </label>
      </div>
      {/* Dropdown to select tonic */}
      <div style={{ marginBottom: "10px" }}>
        <label>
          Select Tonic:{" "}
          <select
            value={selectedTonic}
            onChange={(e) => setSelectedTonic(e.target.value)}
          >
          {selectedScale === "Major"
            ? majorKeys.map((tonic) => (
                <option key={tonic} value={tonic}>
                  {tonic}
                </option>
              ))
            : minorKeys.map((tonic) => (
                <option key={tonic} value={tonic}>
                  {tonic}
                </option>
              ))}
          </select>
        </label>
      </div>
      {/* Dropdown to select clef */}
      <div style={{ marginBottom: "10px" }}>
        <label>
          Select Clef:{" "}
          <select
            value={selectedClef}
            onChange={(e) => setSelectedClef(e.target.value)}
          >
              <option key={0} value={"treble"}>
                {"Treble"}
              </option>
              <option key={1} value={"bass"}>
                {"Bass"}
              </option>
          </select>
        </label>
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label>
          Select Mode:{" "}
          <select
            value={selectedMode}
            onChange={(e) => setSelectedMode(e.target.value)}
          >
            {modeOperations.map((mode, i) => (
              <option key={mode} value={mode}>
                {mode}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div style={{ marginBottom: "10px" }}>
        {/* Checkbox for accidentals toggle */}
        <label>
          Show Accidentals {" "}
          <input
            type="checkbox"
            checked={hasAccidentals} // Bind the 'checked' attribute to the state value
            onChange={(e) => setHasAccidentals(e.target.checked)} // Call the handler function on change
          />
        </label>
        {/* <p>Checkbox is currently: {hasAccidentals ? 'Checked' : 'Unchecked'}</p> */}
      </div>
      {/* Display key and scale */}
      <div style={{ marginBottom: "10px", fontWeight: "bold" }}>
        {selectedScaleName}
      </div>
      {/* Render sheet music */}
      <div ref={containerRef} />
    </div>
  );
}