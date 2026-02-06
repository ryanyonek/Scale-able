export default function OctaveToggle({ value, onChange }) {
  return (
    // Octave Toggle, 8va, default, or 8vb
    <div style={{ marginBottom: "10px" }}>
      <label style={{ fontWeight: "bold" }}>Octave:</label>
      <div>
        <label>
          <input
            type="radio"
            name="octaveShift"
            value="8va"
            checked={value === "8va"}
            onChange={(e) => onChange(e.target.value)}
          />
          8va
        </label>
      </div>
      <div>
        <label>
          <input
            type="radio"
            name="octaveShift"
            value="current"
            checked={value === "current"}
            onChange={(e) => onChange(e.target.value)}
          />
          Current Octave
        </label>
      </div>
      <div>
        <label>
          <input
            type="radio"
            name="octaveShift"
            value="8vb"
            checked={value === "8vb"}
            onChange={(e) => onChange(e.target.value)}
          />
          8vb
        </label>
      </div>
    </div>
  );
}