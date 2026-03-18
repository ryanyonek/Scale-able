export default function TonicSelect({ value, onChange, selectedScale, majorKeys, minorKeys }) {
  return (
    <div className="scale-control">
      {/* Select the tonic of the key (C, D, E, etc.) */}
      <label>
        <b>Select Tonic:{" "}</b>
        <select
          className="amethysta-regular"
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