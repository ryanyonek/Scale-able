import volumeIcon from "../../assets/volume.png";

export default function AudioVolumeSlider({ volume, setVolume, stop }) {
  return (
    <div>
      {/* Slider to adjust volume, between playbacks, not during */}
      <label className="volume-slider">
        <img className="volume-icon" src={volumeIcon} alt="Volume Logo" />
        <input
          type="range"
          min="-40"
          max="-10"
          step="1"
          value={volume}
          onChange={(e) => {
            setVolume(Number(e.target.value));
            stop();
          }}
        />
      </label>
    </div>
  );
}
