import { useState } from "react";
import VexFlowSheet from "../components/music/VexFlowSheet";
import ErrorBoundary from "../components/ui/ErrorBoundary.jsx";

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
  transpositionKey: "0: C",
  showControls: false,
  measureSize: 480,
  octaveTranspose: 0,
  printMode: false,
};

function createWorksheetScale(id) {
  return {
    id,
    config: { ...defaultScaleConfig },
  };
}

// Worksheet Generator page
export default function Worksheet() {
  const [worksheetScales, setWorksheetScales] = useState([
    createWorksheetScale(1),
  ]);

  const [printMode, setPrintMode] = useState(false);

  function handleClick() {
    setPrintMode(true);
    // Wait for React to commit the print section and VexFlow to render at 1024px
    setTimeout(() => {
      window.print();
      setPrintMode(false);
    }, 500);
  }

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
        const nextConfig =
          typeof updater === "function" ? updater(scaleRow.config) : updater;
        return {
          ...scaleRow,
          config: nextConfig,
        };
      }),
    );
  }

  return (
    <div className="body-wrapper">
      <h1 className="page-title">Scale-able Worksheet</h1>
      <section className="worksheet-page no-print">
        <div className="worksheet-editor">
          <div className="worksheet-button-container">
            <button onClick={addScaleRow}>
              Add Scale ({worksheetScales.length}
              {/*`Scale${worksheetScales.length > 1 ? "s" : ""}`*/})
            </button>
            <button type="button" onClick={() => handleClick()}>
              Print Worksheet
            </button>
          </div>
        </div>
        {worksheetScales.map((scaleRow) => (
          <div key={scaleRow.id}>
            <ErrorBoundary
              fallback={
                <p className="sheet-error">
                  Scale {scaleRow.id} could not be displayed.
                </p>
              }
            >
              <VexFlowSheet
                config={scaleRow.config}
                setConfig={(updater) => setRowConfig(scaleRow.id, updater)}
                endpoint="/api/scale"
                variant="original"
                scaleTitle={`Scale ${scaleRow.id}`}
              />
            </ErrorBoundary>
            <div className="remove-button-container">
              <button onClick={() => removeScaleRow(scaleRow.id)}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </section>
      {printMode && (
        <section className="worksheet-page" style={{ width: "1024px" }}>
          {worksheetScales.map((scaleRow) => (
            <div key={scaleRow.id}>
              <ErrorBoundary
                fallback={
                  <p className="sheet-error">
                    Scale {scaleRow.id} could not be displayed.
                  </p>
                }
              >
                <VexFlowSheet
                  config={scaleRow.config}
                  setConfig={(updater) => setRowConfig(scaleRow.id, updater)}
                  endpoint="/api/scale"
                  variant="original"
                  scaleTitle={`Scale ${scaleRow.id}`}
                  renderMode="print"
                />
              </ErrorBoundary>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
