export default function ScaleNameDisplay({ selectedScale, selectedTonic, selectedMode, showMode }) {
  return (
      //Display key and scale
      <div style={{ width: "100%", textAlign: "center", backgroundColor: "white", fontSize: "14pt", marginTop: "0.5rem", paddingTop: "0.5rem", fontWeight: "bold" }}>
        {selectedScale === "Major" && showMode && `${selectedTonic} ${selectedScale} ${selectedMode}`}
        {!showMode && `${selectedTonic} ${selectedScale}`}
      </div>
  );
}