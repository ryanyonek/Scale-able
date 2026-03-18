export default function ModeSelect({ value, onChange, modeShifts }) {
  return (
    <div className="scale-control">
      {/* Dropdown to select the major mode, only when major scale is selected */}
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


