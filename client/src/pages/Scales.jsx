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
    mode: "Ionian",
    showNoteLabels: true,
    lyric: "Note Names",
    octaveShift: "current",
    transpositionKey: "C"
  });

  return (
    <VexFlowSheet
      config={config}
      setConfig={setConfig}
      endpoint="/api/scale"
      variant="original"
    />
  );
}