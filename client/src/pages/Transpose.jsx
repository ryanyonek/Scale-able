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
    showMode: false,
    mode: "Ionian",
    showNoteLabels: true,
    lyric: "Note Names",
    octaveShift: "current",
    transpositionKey: "C",
    showControls: false,
  });

  return (
    <>
      <h1  className="page-title">Transpose Scales</h1>

      <h2 className="scale-title">Sounding Pitch (Concert)</h2>
      <VexFlowSheet
        config={config}
        setConfig={setConfig}
        endpoint="/api/scale"
        variant="original"
      />

      <h2 className="scale-title">Written Pitch (Transposed)</h2>
      <VexFlowSheet
        config={config}
        setConfig={setConfig}
        endpoint="/api/transpose"
        variant="transpose"
      />
    </>
  );
}

