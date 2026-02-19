export default function OctaveSelect({ value, onChange }) {
  return (
    // Octave Toggle, 8va, default, or 8vb
    <div className="scale-control">
      <label>
        <b>Octave:{" "}</b>
        <select
          className="amethysta-regular"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="8va">Octave Up</option>
          <option value="current">Current Octave</option>
          <option value="8vb">Octave Down</option>
        </select>
      </label>
    </div>
  );
}

