// for transposing, make a separate array of all 12 pitches, check the pitch against the one in the array to find its pitch class (index)
// do mathmatical operations on that pitch class to shift to a different diatonic mode
// find where the new pitch class is by reversing the process (plug the index in to find the transposed note)
// replace the original note with the transposed note in the string and pass that into the StaveNote object

import { useEffect, useRef, useState } from "react";
import React from "react";
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
  const clef = "bass";
  const containerRef = useRef(null);
  const octave = ["2", "3", "4", "5", "6"];
  var octaveIndex = 0;

  useEffect(() => {
    var targetName = "B Major";

    const foundScale = scales.find((scale) => scale.name === targetName);
    let key = foundScale.key;
    //key = "C";
    const foundNotes = [...foundScale.notes]; // clone
      console.log(foundNotes);
    const accidentals = [];

    foundNotes.forEach((note, i) => {
      // Remove any existing octave (defensive)
      const baseNote = note.split("/")[0];

      // Accidental
      accidentals[i] = baseNote[1] ?? "";

      // Octave logic
      if (clef === "treble") {
        if (octaveIndex < 2) octaveIndex = 2;
        if (baseNote[0] === "c") octaveIndex++;
      } else if (clef === "bass") {
        if (octaveIndex < 1) octaveIndex = 0;
        if (baseNote[0] === "c") octaveIndex++;
      }

      foundNotes[i] = `${baseNote}/${octave[octaveIndex]}`;
    });
    console.log(accidentals);

    if (!containerRef.current) return;

    // Clear any previous SVG
    containerRef.current.innerHTML = "";

    // Create renderer
    const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
    renderer.resize(1000, 300);

    const context = renderer.getContext();

    // Measure 1
    const staveMeasure1 = new Stave(0, 20, 500);
    staveMeasure1.addClef(clef).addKeySignature(key).setContext(context).draw();

    const ascending_part1 = [
      new StaveNote({
        keys: [foundNotes[0]],
        duration: "8",
        clef: clef,
      }).addModifier(new Accidental(accidentals[0]), 0),
      new StaveNote({
        keys: [foundNotes[1]],
        duration: "8",
        clef: clef,
      }).addModifier(new Accidental(accidentals[1]), 0),
      new StaveNote({
        keys: [foundNotes[2]],
        duration: "8",
        clef: clef,
      }).addModifier(new Accidental(accidentals[2]), 0),
      new StaveNote({
        keys: [foundNotes[3]],
        duration: "8",
        clef: clef,
      }).addModifier(new Accidental(accidentals[3]), 0),
      new StaveNote({
        keys: [foundNotes[4]],
        duration: "8",
        clef: clef,
      }).addModifier(new Accidental(accidentals[4]), 0),
      new StaveNote({
        keys: [foundNotes[5]],
        duration: "8",
        clef: clef,
      }).addModifier(new Accidental(accidentals[5]), 0),
      new StaveNote({
        keys: [foundNotes[6]],
        duration: "8",
        clef: clef,
      }).addModifier(new Accidental(accidentals[6]), 0),
      new StaveNote({
        keys: [foundNotes[7]],
        duration: "8",
        clef: clef,
      }).addModifier(new Accidental(accidentals[7]), 0),
    ];

    const beam1 = new Beam(ascending_part1);

    const ascending = ascending_part1;

    // Helper function to justify and draw a 4/4 voice
    Formatter.FormatAndDraw(context, staveMeasure1, ascending);

    // Measure 2 - second measure is placed adjacent to first measure.
    const staveMeasure2 = new Stave(
      staveMeasure1.width + staveMeasure1.x,
      20,
      480
    );

    const descending_part1 = [
      new StaveNote({
        keys: [foundNotes[7]],
        duration: "8",
        clef: clef,
      }).addModifier(new Accidental(accidentals[7]), 0),
      new StaveNote({
        keys: [foundNotes[6]],
        duration: "8",
        clef: clef,
      }).addModifier(new Accidental(accidentals[6]), 0),
      new StaveNote({
        keys: [foundNotes[5]],
        duration: "8",
        clef: clef,
      }).addModifier(new Accidental(accidentals[5]), 0),
      new StaveNote({
        keys: [foundNotes[4]],
        duration: "8",
        clef: clef,
      }).addModifier(new Accidental(accidentals[4]), 0),
      new StaveNote({
        keys: [foundNotes[3]],
        duration: "8",
        clef: clef,
      }).addModifier(new Accidental(accidentals[3]), 0),
      new StaveNote({
        keys: [foundNotes[2]],
        duration: "8",
        clef: clef,
      }).addModifier(new Accidental(accidentals[2]), 0),
      new StaveNote({
        keys: [foundNotes[1]],
        duration: "8",
        clef: clef,
      }).addModifier(new Accidental(accidentals[1]), 0),
      new StaveNote({
        keys: [foundNotes[0]],
        duration: "8",
        clef: clef,
      }).addModifier(new Accidental(accidentals[0]), 0),
    ];

    // Create the beams for 8th notes in second measure.
    const beam2 = new Beam(descending_part1);

    const descending = descending_part1;

    staveMeasure2.setContext(context).draw();
    Formatter.FormatAndDraw(context, staveMeasure2, descending);

    // Render beams
    beam1.setContext(context).draw();
    beam2.setContext(context).draw();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: "1000px", margin: "auto", padding: "20px" }}
    />
  );
}
