export default function TranspositionSelect({ value, onChange, keys }) {
  return (
    <div className="scale-control">
      {/* Select the tonic/interval of the transposed staff */}
      <label className="big-controls">
        <b>Select Transposition:{" "}</b>
        <select
          className="amethysta-regular"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
        {keys.map((interval) => (
            <option key={interval}>
                {interval}
            </option>
         ))}
        </select>
      </label>
    </div>
  );
}