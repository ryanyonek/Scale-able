export default function LyricsSelect({ value, onChange }) {
  return (
    // Lyrics type selector (only when enabled)
    
    <div style={{ marginBottom: "10px" }}>
      <label>
        Note Label:{" "}
        <select
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
    