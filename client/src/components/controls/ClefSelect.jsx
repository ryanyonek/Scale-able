export default function ClefSelect({ value, onChange }) {
  return (
      <div className="scale-control">
        {/* Dropdown to select a clef */}
        <label>
          <b>Select Clef:{" "}</b>
          <select
          className="amethysta-regular"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          >
              <option key={0} value={"treble"}>
                {"Treble"}
              </option>
              <option key={1} value={"bass"}>
                {"Bass"}
              </option>
              <option key={2} value={"alto"}>
                {"Alto"}
              </option>
              <option key={3} value={"tenor"}>
                {"Tenor"}
              </option>
          </select>
        </label>
      </div>
  );
}
