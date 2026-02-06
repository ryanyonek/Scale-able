export default function ModeSelect({ value, onChange, modeShifts }) {
  return (
  // Dropdown to select major mode

    <div style={{ marginBottom: "10px" }}>
      <label>
        Select Major Mode:{" "}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {Object.keys(modeShifts).map((mode) => (
            <option key={mode} value={mode}>
              {mode}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}


