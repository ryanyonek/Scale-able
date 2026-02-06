export default function ScaleSelect({ value, onChange, scaleTypes }) {
  return (
    <div className="mb-3">
      <label className="form-label">Scale</label>
      <select
        className="form-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {scaleTypes.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>
    </div>
  );
}