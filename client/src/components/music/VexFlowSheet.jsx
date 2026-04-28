import { useEffect, useRef, useState } from "react";
import {
  scaleTypes,
  majorKeys,
  minorKeys,
  modeShifts,
  transpositionKeys,
} from "../../../../server/services/theory/constants.js";

import VexFlowRenderer from "./VexFlowRenderer.jsx";
import ScaleSelect from "../controls/ScaleSelect.jsx";
import ClefSelect from "../controls/ClefSelect.jsx";
import AllAccidentalsToggle from "../controls/AllAccidentalsToggle.jsx";
import CourtesyAccidentalsToggle from "../controls/CourtesyAccidentalsToggle.jsx";
import DirectionSelect from "../controls/DirectionSelect.jsx";
import ModeSelect from "../controls/ModeSelect.jsx";
import LyricsSelect from "../controls/LyricsSelect.jsx";
import NoteLabelsToggle from "../controls/NoteLabelsToggle.jsx";
import TonicSelect from "../controls/TonicSelect.jsx";
import ScaleNameDisplay from "../ui/ScaleNameDisplay";
import TranspositionSelect from "../controls/TranspositionSelect.jsx";
import OctaveSelect from "../controls/OctaveSelect.jsx";
import ShowControls from "../controls/ShowControls.jsx";
import ShowModeToggle from "../controls/ShowModeToggle.jsx";
import { useToneScaleAudio } from "../../hooks/useToneScaleAudio.js";
import AudioVolumeSlider from "../controls/AudioVolumeSlider.jsx";
import AudioTempoSelect from "../controls/AudioTempoSelect.jsx";
import AudioStopButton from "../controls/AudioStopButton.jsx";
import AudioPlayButton from "../controls/AudioPlayButton.jsx";

// Module-level cache so the print section can reuse data already fetched by
// the main section without a second network round-trip (critical on mobile).
const scaleDataCache = new Map();

export default function VexFlowSheet({
  config,
  setConfig,
  endpoint,
  variant,
  scaleTitle,
  renderMode,
}) {
  // scale data state, set after fetching, sent with the renderer
  const [scaleData, setScaleData] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  // scale data config options
  const {
    tonic,
    scale,
    clef,
    showAllAccidentals,
    showCourtesyAccidentals,
    directionMode,
    showMode,
    mode,
    showNoteLabels,
    lyric,
    octaveShift,
    transpositionKey,
    showControls,
    measureSize,
  } = config;

  const options = config;

  // audio controls state
  const { play, stop, audioError } = useToneScaleAudio();
  const [tempo, setTempo] = useState(1);
  const [volume, setVolumeState] = useState(-20); // dB

  // formatting note input for audio playback
  function formatForTone(note) {
    return note.replace("/", "");
  }

  // Fetch scale from server (with module-level cache to avoid redundant
  // network requests when the print section mounts with identical options).
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    async function fetchScale() {
      setFetchError(null);

      // Exclude client-only flags that don't affect the server response
      const { printMode: _ignored, ...fetchOptions } = optionsRef.current;
      const cacheKey = JSON.stringify({ endpoint, ...fetchOptions });

      if (scaleDataCache.has(cacheKey)) {
        setScaleData(scaleDataCache.get(cacheKey));
        return;
      }

      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fetchOptions),
        });

        if (!res.ok) {
          setFetchError(`Could not load scale (server error ${res.status})`);
          return;
        }

        const data = await res.json();
        scaleDataCache.set(cacheKey, data);
        setScaleData(data);
      } catch (err) {
        setFetchError(
          "Could not connect to the server. Check your connection.",
        );
      }
    }

    fetchScale();
  }, [options, endpoint]);

  // From minor, if a non-major tonic is picked from the dropdown, switch to C, vice versa for minor and A
  useEffect(() => {
    if (scale === "Major" && !majorKeys.includes(tonic)) {
      setConfig((prev) => ({
        ...prev,
        tonic: "C",
      }));
    } else if (scale !== "Major" && !minorKeys.includes(tonic)) {
      setConfig((prev) => ({
        ...prev,
        tonic: "A",
      }));
    }
  }, [setConfig, scale, tonic]);

  const allNotes =
    scaleData?.firstMeasure?.notes && scaleData?.secondMeasure?.notes
      ? [...scaleData.firstMeasure.notes, ...scaleData.secondMeasure.notes].map(
          (note) => formatForTone(note),
        )
      : [];

  const isPrintMode = renderMode === "print";

  return (
    <div
      className={measureSize === 480 ? "small-app-container" : "app-container"}
    >
      {!isPrintMode && variant === "original" && (
        <ShowControls
          value={showControls}
          onChange={(value) =>
            setConfig((prev) => ({ ...prev, showControls: value }))
          }
        />
      )}
      {!isPrintMode && variant === "original" && showControls && (
        <div className="controls-container">
          <div className="control-panel">
            <TonicSelect
              value={tonic}
              onChange={(value) =>
                setConfig((prev) => ({ ...prev, tonic: value }))
              }
              majorKeys={majorKeys}
              minorKeys={minorKeys}
              selectedScale={scale}
            />

            <ScaleSelect
              value={scale}
              onChange={(value) =>
                setConfig((prev) => ({ ...prev, scale: value }))
              }
              scaleTypes={scaleTypes}
            />

            <ClefSelect
              value={clef}
              onChange={(value) =>
                setConfig((prev) => ({ ...prev, clef: value }))
              }
            />
          </div>

          <div className="control-panel">
            <AllAccidentalsToggle
              value={showAllAccidentals}
              onChange={(value) =>
                setConfig((prev) => ({ ...prev, showAllAccidentals: value }))
              }
            />

            {scale === "Melodic Minor" && (
              <CourtesyAccidentalsToggle
                value={showCourtesyAccidentals}
                onChange={(value) =>
                  setConfig((prev) => ({
                    ...prev,
                    showCourtesyAccidentals: value,
                  }))
                }
              />
            )}
            {scale === "Major" && (
              <ShowModeToggle
                value={showMode}
                onChange={(value) =>
                  setConfig((prev) => ({ ...prev, showMode: value }))
                }
              />
            )}
            {scale === "Major" && showMode && (
              <ModeSelect
                value={mode}
                onChange={(value) =>
                  setConfig((prev) => ({ ...prev, mode: value }))
                }
                modeShifts={modeShifts}
              />
            )}
          </div>

          <div className="control-panel">
            <NoteLabelsToggle
              value={showNoteLabels}
              onChange={(value) =>
                setConfig((prev) => ({ ...prev, showNoteLabels: value }))
              }
            />

            {showNoteLabels && (
              <LyricsSelect
                value={lyric}
                onChange={(value) =>
                  setConfig((prev) => ({ ...prev, lyric: value }))
                }
              />
            )}
          </div>
          <div className="control-panel">
            <DirectionSelect
              value={directionMode}
              onChange={(value) =>
                setConfig((prev) => ({ ...prev, directionMode: value }))
              }
            />

            <OctaveSelect
              value={octaveShift}
              onChange={(value) =>
                setConfig((prev) => ({ ...prev, octaveShift: value }))
              }
            />
          </div>
        </div>
      )}
      {!isPrintMode && variant === "transpose" && (
        <TranspositionSelect
          value={transpositionKey}
          onChange={(value) =>
            setConfig((prev) => ({ ...prev, transpositionKey: value }))
          }
          keys={transpositionKeys}
        />
      )}

      <h2 className="scale-title">{scaleTitle}</h2>
      <div className="sheet-music-wrapper">
        <div
          className={
            measureSize === 480 ? "small-app-container" : "app-container"
          }
        >
          {!isPrintMode && (
            <div className="scale-name-wrapper">
              <ScaleNameDisplay
                selectedScale={scale}
                selectedTonic={
                  variant === "transpose" ? scaleData?.tonic : tonic
                }
                selectedMode={mode}
                showMode={showMode}
              />
            </div>
          )}
          {fetchError ? (
            <p className="sheet-error">{fetchError}</p>
          ) : (
            <VexFlowRenderer
              scaleData={scaleData}
              options={options}
              forcedWidth={isPrintMode ? 1024 : undefined}
            />
          )}
        </div>
      </div>
      {measureSize === 580 && variant == "original" && (
        <div className="audio-controls">
          <AudioPlayButton
            allNotes={allNotes}
            tempo={tempo}
            volume={volume}
            onChange={play}
            audioError={audioError}
          />
          <AudioStopButton onChange={stop} />

          <AudioTempoSelect tempo={tempo} onChange={setTempo} />
          <AudioVolumeSlider volume={volume} onChange={setVolumeState} />
        </div>
      )}
    </div>
  );
}
