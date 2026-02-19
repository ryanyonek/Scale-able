export default function ModeSelect({ value, onChange, modeShifts }) {
  return (
  // Dropdown to select major mode

    <div className="scale-control">
      <label>
        <b>Select Major Mode:{" "}</b>
        <select
          className="amethysta-regular"
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


