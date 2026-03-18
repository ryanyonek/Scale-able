export default function ScaleSelect({ value, onChange, scaleTypes }) {
  return (
    <div className="scale-control">
      {/* Dropdown to select type of scale: major, 3 minors */}
      <label>
        <b>Scale: </b> 
      </label>
      <select
        className="form-select amethysta-regular"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {scaleTypes.map((s) => (
          <option className="amethysta-regular" key={s}>{s}</option>
        ))}
      </select>
    </div>
  );
}