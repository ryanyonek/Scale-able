import { useEffect, useRef } from "react";
import React from "react";
import { Renderer, Stave, StaveNote, Voice, Formatter } from "vexflow";

export default function VexFlowSheet() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear any previous SVG
    containerRef.current.innerHTML = "";

    // Create renderer
    const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
    renderer.resize(500, 200);

    const context = renderer.getContext();

    // Create a stave
    const stave = new Stave(10, 40, 400);
    stave.addClef("treble");
    stave.setContext(context).draw();

    // Notes
    const notes = [
      new StaveNote({ keys: ["c/4"], duration: "8" }),
      new StaveNote({ keys: ["d/4"], duration: "8" }),
      new StaveNote({ keys: ["e/4"], duration: "8" }),
      new StaveNote({ keys: ["f/4"], duration: "8" }),
      new StaveNote({ keys: ["g/4"], duration: "8" }),
      new StaveNote({ keys: ["a/4"], duration: "8" }),
      new StaveNote({ keys: ["b/4"], duration: "8" }),
      new StaveNote({ keys: ["c/5"], duration: "8" }),
    ];

    // Voice
    const voice = new Voice({ num_beats: 4, beat_value: 4 });
    console.log(voice.getTotalTicks());
    voice.addTickables(notes);

    // Format + draw
    new Formatter().joinVoices([voice]).format([voice], 300);
    voice.draw(context, stave);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: "500px", margin: "auto", padding: "20px" }}
    />
  );
}
