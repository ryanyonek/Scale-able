export default function AudioVolumeSlider({ volume, onChange }) {
  return (
    <div>
        <label className="volume-slider">
            Volume:{" "}
            <input
            type="range"
            min="-30"
            max="0"
            step="1"
            value={volume}
            onChange={(e) => onChange(Number(e.target.value))}
            />
        </label>
    </div>
  );
}