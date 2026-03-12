import { useMemo,useState } from "react";
import VexFlowSheet from "../components/music/VexFlowSheet";

const defaultScaleConfig = {
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
  measureSize: 480,
  octaveTranspose: 0
};

function createWorksheetScale(id) {
  return {
    id,
    config: { ...defaultScaleConfig },
  };
}


export default function Worksheet() {
  const [worksheetScales, setWorksheetScales] = useState([
    createWorksheetScale(1),
  ]);
  function addScaleRow() {
    const nextId =
      worksheetScales.length > 0
        ? Math.max(...worksheetScales.map(({ id }) => id)) + 1
        : 1;

    setWorksheetScales((prev) => [...prev, createWorksheetScale(nextId)]);
  }

  function removeScaleRow(id) {
    setWorksheetScales((prev) => prev.filter((scaleRow) => scaleRow.id !== id));
  }

  function setRowConfig(id, updater) {
    setWorksheetScales((prev) =>
      prev.map((scaleRow) => {
        if (scaleRow.id !== id) {
          return scaleRow;
        }
        const nextConfig = typeof updater === "function" ? updater(scaleRow.config) : updater;
        return {
          ...scaleRow,
          config: nextConfig,
        };
      })
    );
  }

  return (
    <div className="body-wrapper">
      <div>
        <h1 className="page-title">Worksheet Generator</h1>
        <button onClick={addScaleRow}>Add Scale</button>
      </div>
      {worksheetScales.map((scaleRow) => (
        <div key={scaleRow.id}>
          <button onClick={() => removeScaleRow(scaleRow.id)}>Remove</button>

          <VexFlowSheet
            config={scaleRow.config}
            setConfig={(updater) => setRowConfig(scaleRow.id, updater)}
            endpoint="/api/scale"
            variant="original"
            scaleTitle={`Scale ${scaleRow.id}`}
          />
        </div>
      ))}
      <section className="worksheet-page">
        <div className="worksheet-editor no-print">
          <button type="button" onClick={() => window.print()}>
            Print Worksheet
          </button>
        </div>

        <div className="worksheet-print print-only" aria-hidden="true">
          {worksheetScales.map((row, index) => (
            <section
              key={`${row.id}-print`}
              className={`worksheet-print-row ${index < worksheetScales.length - 1 ? "page-break" : ""}`}
            >
              <VexFlowSheet
                config={row.config}
                setConfig={() => {}}
                endpoint={row.endpoint}
                variant={row.variant}
                scaleTitle={row.title}
                renderMode="print"
              />
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}
