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

      let cleanedUp = false;
      function cleanup() {
        if (cleanedUp) return;
        cleanedUp = true;
        viewportMeta.setAttribute("content", originalViewport);
        setPrintMode(false);
      }

      // On mobile Chrome, window.print() is fully non-blocking: it returns
      // before the print engine captures the DOM, and both onafterprint and
      // matchMedia('print') fire immediately after window.print() returns —
      // not after the print snapshot is taken.  A fixed delay is the only
      // reliable way to keep the 1024px layout in place long enough.
      //
      // On desktop, matchMedia fires correctly (active → inactive when the
      // dialog truly closes), so we use it as an early-exit to avoid leaving
      // the UI stuck in print mode after the dialog is dismissed.  We only
      // honour the matchMedia signal once the print media query has gone
      // active first, and only after a minimum hold that covers mobile
      // Chrome's capture window.
      const PRINT_HOLD_MS = 2500;
      let printHoldExpired = false;
      setTimeout(() => {
        printHoldExpired = true;
      }, PRINT_HOLD_MS);

      // Safety net: always clean up after PRINT_HOLD_MS + 3 s so the UI is
      // never permanently stuck in print mode.
      setTimeout(cleanup, PRINT_HOLD_MS + 3000);

      const mql = window.matchMedia("print");
      let printWentActive = false;
      function onPrintChange(e) {
        if (e.matches) {
          printWentActive = true;
        } else if (printWentActive && printHoldExpired) {
          // Desktop path: print media went active then inactive AND the
          // minimum hold has elapsed — safe to restore.
          mql.removeEventListener("change", onPrintChange);
          cleanup();
        }
      }
      mql.addEventListener("change", onPrintChange);

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
