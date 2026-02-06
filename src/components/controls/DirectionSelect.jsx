export default function DirectionSelect({ value, onChange }) {
  return (
    // Ascending, Descending, or both
    <div style={{ marginBottom: "10px" }}>
      <label style={{ fontWeight: "bold" }}>Scale Direction:</label>
      <div>
        <label>
          <input
            type="radio"
            name="direction"
            value="both"
            checked={value === "both"}
            onChange={(e) => onChange(e.target.value)}
          />
          Ascending & Descending
        </label>
      </div>
      <div>
        <label>
          <input
            type="radio"
            name="direction"
            value="ascending"
            checked={value === "ascending"}
            onChange={(e) => onChange(e.target.value)}
          />
          Ascending only
        </label>
      </div>
      <div>
        <label>
          <input
            type="radio"
            name="direction"
            value="descending"
            checked={value === "descending"}
            onChange={(e) => onChange(e.target.value)}
          />
          Descending only
        </label>
      </div>
    </div>
  );
}