export default function DirectionSelect({ value, onChange }) {
  return (
    // Ascending, Descending, or both
    <div style={{ marginBottom: "10px" }}>
      <label>
        <b>Scale Direction:{" "}</b>
        <select
          className="amethysta-regular"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="both">Asc. & Desc.</option>
          <option value="ascending">Asc. only</option>
          <option value="descending">Desc. only</option>
        </select>
      </label>
    </div>
  );
}