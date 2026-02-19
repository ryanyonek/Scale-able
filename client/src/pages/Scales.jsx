import { useState } from "react";
import VexFlowSheet from "../components/music/VexFlowSheet";

export default function Scale() {
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
    showControls: true,
  });

  return (
    <div>
      <h1 className="page-title">Scale Viewer</h1>

      <VexFlowSheet
        config={config}
        setConfig={setConfig}
        endpoint="/api/scale"
        variant="original"
      />
    </div>

  );
}