import { useState } from "react";
import VexFlowSheet from "../components/music/VexFlowSheet";

export default function Transpose() {
  const [config, setConfig] = useState({
    tonic: "C",
    scale: "Major",
    clef: "treble",
    showAllAccidentals: false,
    showCourtesyAccidentals: true,
    directionMode: "both",
    mode: "Ionian",
    showNoteLabels: true,
    lyric: "Note Names",
    octaveShift: "current",
    transpositionKey: "C"
  });

  return (
    <>
      <h2>Transpose Scales</h2>

      <h3>Sounding Pitch (Concert)</h3>
      <VexFlowSheet
        config={config}
        setConfig={setConfig}
        endpoint="/api/scale"
        variant="original"
      />

      <h3>Written Pitch (Transposed)</h3>
      <VexFlowSheet
        config={config}
        setConfig={setConfig}
        endpoint="/api/transpose"
        variant="transpose"
      />
    </>
  );
}

