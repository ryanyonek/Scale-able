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
    measureSize: 580
  });

  return (
    <div className="body-wrapper">
      <h1  className="page-title">Transpose Scales</h1>

      <VexFlowSheet
        config={config}
        setConfig={setConfig}
        endpoint="/api/scale"
        variant="original"
        scaleTitle="Sounding Pitch (Concert)"
      />

      
      <VexFlowSheet
        config={config}
        setConfig={setConfig}
        endpoint="/api/transpose"
        variant="transpose"
        scaleTitle="Written Pitch (Transposed)"
      />
    </div>
  );
}

