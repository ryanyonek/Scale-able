export default function NoteLabelsToggle({ value, onChange }) {
  return (
    // Toggle note labels
    <div style={{ marginBottom: "10px" }}>
    <label>
        <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        />
        {" "}Show Note Labels
    </label>
    </div>
  );
}
