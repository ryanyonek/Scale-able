export default function AudioPlayButton({ onChange, allNotes, tempo, volume }) {
  return (
    <div>
        {/* Button to start audio playback */}
        <button onClick={() => onChange(allNotes, tempo, volume)}>
            Play
        </button>
    </div>
  );
}