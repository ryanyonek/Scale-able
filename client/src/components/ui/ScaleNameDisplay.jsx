export default function ScaleNameDisplay({ selectedScale, selectedTonic, selectedMode, showMode }) {
  return (
      //Display key and scale
      <div>
        {selectedScale === "Major" && showMode && `${selectedTonic} ${selectedScale} ${selectedMode}`}
        {!showMode && `${selectedTonic} ${selectedScale}`}
      </div>
  );
}