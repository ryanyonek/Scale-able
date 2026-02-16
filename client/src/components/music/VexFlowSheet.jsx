import { useEffect, useState } from "react";
import {
  scaleTypes,
  majorKeys,
  minorKeys,
  modeShifts,
  transpositionKeys
} from "../../../../server/services/theory/constants.js";

import VexFlowRenderer from "./VexFlowRenderer";
import ScaleSelect from "../controls/ScaleSelect";
import ClefSelect from "../controls/ClefSelect";
import AllAccidentalsToggle from "../controls/AllAccidentalsToggle";
import CourtesyAccidentalsToggle from "../controls/CourtesyAccidentalsToggle";
import DirectionSelect from "../controls/DirectionSelect";
import ModeSelect from "../controls/ModeSelect";
import LyricsSelect from "../controls/LyricsSelect";
import NoteLabelsToggle from "../controls/NoteLabelsToggle";
import TonicSelect from "../controls/TonicSelect";
import ScaleNameDisplay from "../ui/ScaleNameDisplay";
import TranspositionSelect from "../controls/transpositionSelect";
import OctaveSelect from "../controls/OctaveSelect";

export default function VexFlowSheet({ config, setConfig, endpoint, variant }) {

  // ✅ scaleData state INSIDE component
  const [scaleData, setScaleData] = useState(null);

  // ✅ Build options INSIDE component
  const {
    tonic,
    scale,
    clef,
    showAllAccidentals,
    showCourtesyAccidentals,
    directionMode,
    mode,
    showNoteLabels,
    lyric,
    octaveShift,
    transpositionKey
  } = config ;

  const options = config;

  // ✅ Fetch scale from backend
  useEffect(() => {
    async function fetchScale() {
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(options),
        });

        if (!res.ok) {
          console.error("Scale API error:", res.status);
          return;
        }

        const data = await res.json();
        console.log(`Scale Data: ${res}`)

        setScaleData(data);

      } catch (err) {
        console.error("Fetch failed:", err);
      }
    }

    fetchScale();
  }, [config, endpoint]);

  useEffect(() => {
  console.log("TRANS KEY:", transpositionKey);
}, [transpositionKey]);

useEffect(() => {
  if (scale === "Major" && !majorKeys.includes(tonic)) {
    setConfig(prev => ({
      ...prev,
      tonic: "C"
    }));
  } else if (scale !== "Major" && !minorKeys.includes(tonic)) {
    setConfig(prev => ({
      ...prev,
      tonic: "A"
    }));
  }
}, [scale, tonic]);

  return (
        <div className="app-container">
      {variant === "original" && (
      <div className="control-wrapper">
      
        <div className="control-panel">
          <TonicSelect 
            value={tonic}
            onChange={(value) =>
              setConfig(prev => ({ ...prev, tonic: value }))
            }
            majorKeys={majorKeys}
            minorKeys={minorKeys}
            selectedScale={scale}
          />
        
          <ScaleSelect
            value={scale}
            onChange={(value) =>
              setConfig(prev => ({ ...prev, scale: value }))
            }
            scaleTypes={scaleTypes}
          />

          <ClefSelect
            value={clef}
            onChange={(value) =>
              setConfig(prev => ({ ...prev, clef: value }))
            }
          />

          {scale === "Major" && (
            <ModeSelect 
              value={mode}
            onChange={(value) =>
              setConfig(prev => ({ ...prev, mode: value }))
            }
              modeShifts={modeShifts}
            />
          )}
        </div>

        <div className="control-panel">
          <AllAccidentalsToggle 
            value={showAllAccidentals}
            onChange={(value) =>
              setConfig(prev => ({ ...prev, showAllAccidentals: value }))
            }
          />

          {scale === "Melodic Minor" && (
            <CourtesyAccidentalsToggle 
              value={showCourtesyAccidentals}
              onChange={(value) =>
                setConfig(prev => ({ ...prev, showCourtesyAccidentals: value }))
              }
            />
          )}
        </div>

        <div className="control-panel">
          <NoteLabelsToggle 
            value={showNoteLabels}
            onChange={(value) =>
              setConfig(prev => ({ ...prev, showNoteLabels: value }))
            }
          />

          {showNoteLabels && (
            <LyricsSelect
              value={lyric}
              onChange={(value) =>
                setConfig(prev => ({ ...prev, lyric: value }))
              }
            />
          )}

        </div>
        <div className="control-panel">
          <DirectionSelect
            value={directionMode}
            onChange={(value) =>
              setConfig(prev => ({ ...prev, directionMode: value }))
            }
          />

          <OctaveSelect 
            value={octaveShift}
            onChange={(value) =>
              setConfig(prev => ({ ...prev, octaveShift: value }))
            }
          />
        </div>
        
      </div> )}

      {variant === "transpose" && (
        <TranspositionSelect 
        value={transpositionKey}
        onChange={(value) =>
          setConfig(prev => ({ ...prev, transpositionKey: value }))
        }
        keys={transpositionKeys}
      />)}

      <div className="scale-name-wrapper">
        <ScaleNameDisplay 
          selectedScale={scale}
          selectedTonic={
            variant === "transpose"
              ? scaleData?.tonic
              : tonic
          }
          selectedMode={mode}
        />
      </div>
        <VexFlowRenderer
          scaleData={scaleData}
          options={options}
        />
    </div>
  );
}