export default function CourtesyAccidentalsToggle ({ value, onChange}) {
  return (
      <div className="scale-control">
        {/* Checkbox for couresy accidentals toggle, melodic minor only */}
        <label>
          <input
            type="checkbox"
            checked={value}
            onChange={(e) => onChange(e.target.checked)} 
          />
          <b>Show Courtesy Accidentals {" "}</b>
        </label>
      </div>
  );
}
      