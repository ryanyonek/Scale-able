export default function Worksheets() {

  async function generateWorksheet() {
    const res = await fetch("http://localhost:5000/api/export/worksheet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scales: ["C Major", "G Major"]
      })
    });

    const data = await res.json();
    alert(data.message);
  }

  return (
    <>
      <h2 className="page-title">Worksheet Generator</h2>
      <button onClick={generateWorksheet}>
        Generate Worksheet
      </button>
    </>
  );
}