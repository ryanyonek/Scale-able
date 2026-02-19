export default function ShowModeToggle({ value, onChange }) {
  return (
    // Toggle major modes dropdown
    <div className="scale-control">
    <label>
        <input
        className="amethysta-regular"
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        />
        <b>Show Major Modes</b>
    </label>
    </div>
  );
}