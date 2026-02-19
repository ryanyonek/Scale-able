export default function DirectionSelect({ value, onChange }) {
  return (
    // Ascending, Descending, or both
    <div className="scale-control">
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