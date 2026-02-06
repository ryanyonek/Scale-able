export default function CourtesyAccidentalsToggle ({ value, onChange}) {
  return (
      // Checkbox for courtesy accidentals toggle
      
      <div style={{ marginBottom: "10px" }}>
        <label>
          <input
            type="checkbox"
            checked={value} // Bind the 'checked' attribute to the state value
            onChange={(e) => onChange(e.target.checked)} // Call the handler function on change
          />
          Show Courtesy Accidentals {" "}
        </label>
        {/* <p>Checkbox is currently: {showCourtesyAccidentals ? 'Checked' : 'Unchecked'}</p> */}
      </div>
  );
}
      