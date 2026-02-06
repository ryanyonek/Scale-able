export default function ClefSelect({ value, onChange }) {
  return (
    // Clef Dropdown
      <div style={{ marginBottom: "10px" }}>
        <label>
          Select Clef:{" "}
          <select
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
