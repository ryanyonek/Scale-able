export default function AudioTempoSelect({ tempo, onChange }) {
  return (
    <div>
      {/* Dropdown to select playback speed */}
        <label>
          <select
            value={tempo}
            onChange={(e) => {
              const val = Number(e.target.value);
              onChange(val);
            }}
          >
            <option value={0.5}>0.5x</option>
            <option value={0.75}>0.75x</option>
            <option value={1}>1x</option>
            <option value={1.25}>1.25x</option>
            <option value={1.5}>1.5x</option>
            <option value={2}>2x</option>
          </select>
        </label>
    </div>
  );
}