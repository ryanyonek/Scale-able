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
  showControls: true,
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
    <>
      <h2 className="page-title">Worksheet Generator</h2>
            <button onClick={addScaleRow}>Add Scale</button>

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

          <div className="worksheet-list">
            {worksheetScales.map((row) => (
              <article key={row.id} className="worksheet-row-card">
                <VexFlowSheet
                  config={row.config}
                  setConfig={(updater) => updateRowConfig(row.id, updater)}
                  endpoint={row.endpoint}
                  variant={row.variant}
                  scaleTitle={row.title}
                  renderMode="print"
                />
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
