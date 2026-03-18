export default function ShowControls({ value, onChange }) {
  return (
    <div className="scale-control">
      {/* Toggle for all scale controls */}
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
