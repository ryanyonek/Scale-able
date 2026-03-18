export default function DirectionSelect({ value, onChange }) {
  return (
    <div className="scale-control">
      {/* Dropdown to select which half of the scale to show, or both */}
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