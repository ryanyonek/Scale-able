export default function CourtesyAccidentalsToggle ({ value, onChange}) {
  return (
      // Checkbox for courtesy accidentals toggle
      
      <div className="scale-control">
        <label>
          <input
            type="checkbox"
            checked={value} // Bind the 'checked' attribute to the state value
            onChange={(e) => onChange(e.target.checked)} // Call the handler function on change
          />
          <b>Show Courtesy Accidentals {" "}</b>
        </label>
        {/* <p>Checkbox is currently: {showCourtesyAccidentals ? 'Checked' : 'Unchecked'}</p> */}
      </div>
  );
}
      