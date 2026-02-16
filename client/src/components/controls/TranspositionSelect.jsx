export default function TranspositionSelect({ value, onChange, keys }) {
  return (
    <div>
      <label>
        <b>Select Key of Transposition:{" "}</b>
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