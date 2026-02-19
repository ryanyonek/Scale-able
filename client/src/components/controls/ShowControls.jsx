export default function ShowControls({ value, onChange }) {
  return (
    // Toggle scale controls
    <div className="scale-control">
    <label className="big-controls">
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
