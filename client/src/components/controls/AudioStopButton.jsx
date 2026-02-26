export default function AudioStopButton({ onChange }) {
  return (
    <div>
        <button onClick={onChange}>
            Stop
        </button>
    </div>
  );
}