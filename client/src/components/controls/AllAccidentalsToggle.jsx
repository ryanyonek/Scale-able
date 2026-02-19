export default function AllAccidentalsToggle({ value, onChange }) {
  return (
    <div className="scale-control">
      {/* Checkbox for all accidentals toggle */}
      <label>
        <input
          type="checkbox"
          checked={value} // Bind the 'checked' attribute to the state value
          onChange={(e) => onChange(e.target.checked)} // Call the handler function on change
        />
        <b>Show All Accidentals {" "}</b>
      </label>
      {/* <p>Checkbox is currently: {showAllAccidentals ? 'Checked' : 'Unchecked'}</p> */}
    </div>
  );
}