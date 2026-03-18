export default function AudioVolumeSlider({ volume, onChange }) {
  return (
    <div>
        {/* Slider to adjust volume, between playbacks, not during */}
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