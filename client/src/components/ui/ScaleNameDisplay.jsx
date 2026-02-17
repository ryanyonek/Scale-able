export default function ScaleNameDisplay({ selectedScale, selectedTonic, selectedMode }) {
  return (
      //Display key and scale
      <div style={{ width: "100%", textAlign: "center", backgroundColor: "white", fontSize: "14pt", marginBottom: "0px", fontWeight: "bold" }}>
        {selectedScale === "Major" && `${selectedTonic} ${selectedScale} ${selectedMode}`}
        {selectedScale !== "Major" && `${selectedTonic} ${selectedScale}`}
      </div>
  );
}