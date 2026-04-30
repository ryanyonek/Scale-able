export default function AudioPlayButton({
  play,
  stop,
  allNotes,
  tempo,
  volume,
  audioError,
  playing,
}) {
  return (
    <div>
      {/* Button to start audio playback */}
      {!playing && (
        <button onClick={() => play(allNotes, tempo, volume)}>▶︎</button>
      )}
      {playing && <button onClick={() => stop()}>❚❚</button>}
      {audioError && <span className="audio-error">{audioError}</span>}
    </div>
  );
}
