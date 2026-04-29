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
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    const originalViewport = viewportMeta.getAttribute("content");

    // Switch existing renderers to 1024px via renderMode="print" / forcedWidth.
    // This modifies the VISIBLE content so mobile browsers capture it correctly —
    // a separate off-screen section sits in overflow and is missed by mobile
    // Chrome's print engine.
    setPrintMode(true);

    setTimeout(() => {
      // Set viewport to 1024px so mobile browsers lay out at the print width.
      viewportMeta.setAttribute("content", "width=1024");

      // Restore ONLY after the print dialog has finished — not immediately after
      // window.print(). On mobile Chrome, window.print() is non-blocking: it
      // returns before the print engine captures the DOM, so restoring the
      // viewport and clearing printMode synchronously causes the scales to snap
      // back to device width before the snapshot is taken.
      window.onafterprint = () => {
        viewportMeta.setAttribute("content", originalViewport);
        setPrintMode(false);
        window.onafterprint = null;
      };

      // One rAF lets the browser reflow the layout at 1024px before the print
      // dialog captures the page.
      requestAnimationFrame(() => {
        window.print();
      });
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
      <section className="worksheet-page">
        <div className="worksheet-editor no-print">
          <div className="worksheet-button-container">
            <button onClick={addScaleRow}>
              Add Scale ({worksheetScales.length})
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
                renderMode={printMode ? "print" : undefined}
              />
            </ErrorBoundary>
            <div className="remove-button-container no-print">
              <button onClick={() => removeScaleRow(scaleRow.id)}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
