export default function ScaleSelect({ value, onChange, scaleTypes }) {
  return (
    <div className="scale-control">
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