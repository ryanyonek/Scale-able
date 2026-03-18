export default function NoteLabelsToggle({ value, onChange }) {
  return (
    <div className="scale-control">
      {/* Toggle lyrics underneath the notes */}
      <label>
          <input
          className="amethysta-regular"
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          />
          <b>Show Note Labels</b>
      </label>
    </div>
  );
}
