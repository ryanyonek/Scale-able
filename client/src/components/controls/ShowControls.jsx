export default function ShowControls({ value, onChange }) {
  return (
    // Toggle scale controls
    <div style={{ marginBottom: "10px" }}>
    <label>
        <input
        className="amethysta-regular"
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        />
        <b>Show Scale Controls</b>
    </label>
    </div>
  );
}
