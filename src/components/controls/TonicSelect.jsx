export default function TonicSelect({ value, onChange, selectedScale, majorKeys, minorKeys }) {
  return (
    // Dropdown to select tonic
    <div style={{ marginBottom: "10px" }}>
      <label>
        Select Tonic:{" "}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
        {selectedScale === "Major"
          ? majorKeys.map((tonic) => (
              <option key={tonic} value={tonic}>
                {tonic}
              </option>
            ))
          : minorKeys.map((tonic) => (
              <option key={tonic} value={tonic}>
                {tonic}
              </option>
            ))}
        </select>
      </label>
    </div>
  );
}