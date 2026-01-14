// for transposing, make a separate array of all 12 pitches, check the pitch against the one in the array to find its pitch class (index)
// do mathmatical operations on that pitch class to shift to a different diatonic mode
// find where the new pitch class is by reversing the process (plug the index in to find the transposed note)
// replace the original note with the transposed note in the string and pass that into the StaveNote object

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
  const modeOperations = ["Ionian", "Dorian", "Phrygian", "Lydian", "Mixolydian", "Aeolian", "Locrian"];

  // React state
  const [selectedScaleName, setSelectedScaleName] = useState("Bb Major");
  const [selectedClef, setSelectedClef] = useState("treble");
  const [selectedMode, setSelectedMode] = useState("Aeolian");

  useEffect(() => {
    let octaveIndex = selectedClef === "treble" ? 2 : 0;

    // Find the scale
    const foundScale = scales.find((scale) => scale.name === selectedScaleName);
    if (!foundScale) return;

    const key = foundScale.key;
    const foundNotes = [...foundScale.notes]; // clone
    const accidentals = [];

    // Transpose the scale if a major diatonic mode is selected
    if (modeOperations.includes(selectedMode)) {
        // shift the notes
        const shiftAmount = modeOperations.indexOf(selectedMode);
        if (shiftAmount > 0) {
          foundNotes.pop();
          for (let i = 0; i < shiftAmount; i++) {
            let removedNote = foundNotes.shift();
            foundNotes.push(removedNote);
          }
          const repeatedNote = foundNotes[0];
          foundNotes.push(repeatedNote);
        }
    }

    // Build notes with accidentals and an octave
    foundNotes.forEach((note, i) => {
      const baseNote = note.split("/")[0];
      accidentals[i] = baseNote[1] ?? "";

      if (baseNote[0] === "c") {
        octaveIndex = Math.min(octaveIndex + 1, octave.length - 1);
      }

      foundNotes[i] = `${baseNote}/${octave[octaveIndex]}`;
    });

    console.log(selectedScaleName + " " + selectedMode + ": "+ foundNotes)

    if (!containerRef.current) return;

    // Clear previous SVG
    containerRef.current.innerHTML = "";

    // Create renderer
    const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
    renderer.resize(1000, 300);
    const context = renderer.getContext();

    // Draw first stave
    const staveMeasure1 = new Stave(0, 20, 500);
    staveMeasure1.addClef(selectedClef).addKeySignature(key).setContext(context).draw();

    const ascending_part1 = foundNotes.map(
      (n, i) =>
        new StaveNote({ keys: [n], duration: "8", clef: selectedClef}).addModifier(
          new Accidental(accidentals[i]),
          0
        )
    );

    const beam1 = new Beam(ascending_part1);
    Formatter.FormatAndDraw(context, staveMeasure1, ascending_part1);

    // Draw second stave (descending)
    const staveMeasure2 = new Stave(staveMeasure1.width + staveMeasure1.x, 20, 480);
    const descending_part1 = [...foundNotes].reverse().map(
      (n, i) =>
        new StaveNote({ keys: [n], duration: "8", clef: selectedClef}).addModifier(
          new Accidental(accidentals[foundNotes.length - 1 - i]),
          0
        )
    );

    const beam2 = new Beam(descending_part1);
    staveMeasure2.setContext(context).draw();
    Formatter.FormatAndDraw(context, staveMeasure2, descending_part1);

    beam1.setContext(context).draw();
    beam2.setContext(context).draw();
  }, [selectedScaleName, , selectedClef, selectedMode]); // 🔑 Re-run effect when scale changes

  return (
    <div style={{ width: "1000px", margin: "auto", padding: "20px" }}>
      {/* Dropdown to select scale */}
      <div style={{ marginBottom: "10px" }}>
        <label>
          Select Scale:{" "}
          <select
            value={selectedScaleName}
            onChange={(e) => setSelectedScaleName(e.target.value)}
          >
            {scales.map((scale) => (
              <option key={scale.name} value={scale.name}>
                {scale.name}
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
      {/* Display key and scale */}
      <div style={{ marginBottom: "10px", fontWeight: "bold" }}>
        {selectedScaleName}
      </div>

      {/* Render sheet music */}
      <div ref={containerRef} />
    </div>
  );
}