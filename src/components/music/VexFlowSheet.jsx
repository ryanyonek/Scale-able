import { useEffect } from "react";
import { useScaleState } from "../../hooks/useScaleState";
import { scaleTypes, majorKeys, minorKeys, modeShifts } from "../../utils/musicTheory"
import VexFlowRenderer from "./VexFlowRenderer";
import ScaleSelect from "../controls/ScaleSelect";
import ClefSelect from "../controls/ClefSelect";
import AllAccidentalsToggle from "../controls/AllAccidentalsToggle";
import CourtesyAccidentalsToggle from "../controls/CourtesyAccidentalsToggle";
import DirectionSelect from "../controls/DirectionSelect";
import ModeSelect from "../controls/ModeSelect";
import LyricsSelect from "../controls/LyricsSelect";
import OctaveToggle from "../controls/OctaveToggle";
import NoteLabelsToggle from "../controls/NoteLabelsToggle";
import TonicSelect from "../controls/TonicSelect";

export default function VexFlowSheet() {
  const state = useScaleState();

  const [selectedScale, setSelectedScale] = state.selectedScale;
  const [selectedClef, setSelectedClef] = state.selectedClef;
  const [showAllAccidentals, setShowAllAccidentals] = state.showAllAccidentals;
  const [showCourtesyAccidentals, setShowCourtesyAccidentals] = state.showCourtesyAccidentals;
  const [directionMode, setDirectionMode] = state.directionMode;
  const [selectedMode, setSelectedMode] = state.selectedMode;
  const [showNoteLabels, setShowNoteLabels] = state.showNoteLabels;
  const [selectedLyric, setSelectedLyric] = state.selectedLyric;
  const [octaveShift, setOctaveShift] = state.octaveShift;
  const [selectedTonic, setSelectedTonic] = state.selectedTonic;

useEffect(() => {
  if (selectedScale === "Major" && !majorKeys.includes(selectedTonic)) {
    setSelectedTonic("C");
  } else if (selectedScale !== "Major" && !minorKeys.includes(selectedTonic)) {
    setSelectedTonic("A");
  }
}, [selectedScale, selectedTonic]);

  return (
    <div className="card p-3 mb-4">
      <TonicSelect 
        value={selectedTonic}
        onChange={setSelectedTonic}
        majorKeys={majorKeys}
        minorKeys={minorKeys}
        selectedScale={selectedScale}
      />
      
      <ScaleSelect
        value={selectedScale}
        onChange={setSelectedScale}
        scaleTypes={scaleTypes}
      />

      {selectedScale === "Major" && (
        <ModeSelect 
          value={selectedMode}
          onChange={setSelectedMode}
          modeShifts={modeShifts}
        />
      )}

      <ClefSelect
        value={selectedClef}
        onChange={setSelectedClef}
      />

      < AllAccidentalsToggle 
        value={showAllAccidentals}
        onChange={setShowAllAccidentals}
      />

      {selectedScale === "Melodic Minor" && (
        < CourtesyAccidentalsToggle 
        value={showCourtesyAccidentals}
        onChange={setShowCourtesyAccidentals}
      />
      )}

      <NoteLabelsToggle 
        value={showNoteLabels}
        onChange={setShowNoteLabels}
      />

      < DirectionSelect
        value={directionMode}
        onChange={setDirectionMode}
      />

      {showNoteLabels && (
        <LyricsSelect
          value={selectedLyric}
          onChange={setSelectedLyric}
        />
      )}

      <OctaveToggle 
        value={octaveShift}
        onChange={setOctaveShift}
      />

      {/* Display key and scale */}
      <div style={{ fontSize: "14pt", marginBottom: "0px", fontWeight: "bold" }}>
        {selectedScale === "Major" && `${selectedTonic} ${selectedScale} ${selectedMode}`}
        {selectedScale !== "Major" && `${selectedTonic} ${selectedScale}`}
      </div>

      <VexFlowRenderer
        selectedTonic={selectedTonic}
        selectedScale={selectedScale}
        selectedClef={selectedClef}
        showAllAccidentals={showAllAccidentals}
        showCourtesyAccidentals={showCourtesyAccidentals}
        directionMode={directionMode}
        selectedMode={selectedMode}
        showNoteLabels={showNoteLabels}
        selectedLyric={selectedLyric}
        octaveShift={octaveShift}
      />
    </div>
  );
}