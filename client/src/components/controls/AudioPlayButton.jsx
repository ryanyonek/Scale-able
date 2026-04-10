export default function AudioPlayButton({ onChange, allNotes, tempo, volume, audioError }) {
  return (
    <div>
        {/* Button to start audio playback */}
        <button onClick={() => onChange(allNotes, tempo, volume)}>
            Play
        </button>
        {audioError && <span className="audio-error">{audioError}</span>}
    </div>
  );
}