export default function AudioTempoSelect({ tempo, setTempo, stop }) {
  return (
    <div>
      {/* Dropdown to select playback speed */}
      <label>
        <select
          value={tempo}
          onChange={(e) => {
            setTempo(Number(e.target.value));
            stop();
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
