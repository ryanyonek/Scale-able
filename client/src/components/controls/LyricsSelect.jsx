export default function LyricsSelect({ value, onChange }) {
  return (
    // Lyrics type selector (only when enabled)
    
    <div className="scale-control">
      <label>
        <b>Note Label:{" "}</b>
        <select
          className="amethysta-regular"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="Note Names">Note Names</option>
          <option value="Scale Degrees">Scale Degrees</option>
          <option value="Solfege">Solfege</option>
        </select>
      </label>
    </div>
  );
}
    