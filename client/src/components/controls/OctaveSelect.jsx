export default function OctaveSelect({ value, onChange }) {
  return (
    <div className="scale-control">
      {/* Dropdown to select octave, current, 8va (up), or 8vb (down) */}
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

