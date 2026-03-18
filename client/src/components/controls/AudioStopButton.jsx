export default function AudioStopButton({ onChange }) {
  return (
    <div>
        {/* Button to stop audio playback */}
        <button onClick={onChange}>
            Stop
        </button>
    </div>
  );
}