export default function AudioPlayButton({ onChange, allNotes, tempo, volume }) {
  return (
    <div>
        <button onClick={() => onChange(allNotes, tempo, volume)}>
            Play
        </button>
    </div>
  );
}