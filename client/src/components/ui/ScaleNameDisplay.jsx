export default function ScaleNameDisplay({ selectedScale, selectedTonic, selectedMode, showMode }) {
  return (
      // Display key and scale above sheet music
      <div>
        {selectedScale === "Major" && showMode && `${selectedTonic} ${selectedScale} ${selectedMode}`}
        {(selectedScale !== "Major" || !showMode) && `${selectedTonic} ${selectedScale}`}
      </div>
  );
}