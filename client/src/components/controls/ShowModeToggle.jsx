export default function ShowModeToggle({ value, onChange }) {
  return (
    <div className="scale-control">
      {/* Toggle to show major mode dropdown, only when major scale is selected */}
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