import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Scales from "./pages/Scales.jsx";
import Transpose from "./pages/Transpose.jsx";
import Worksheet from "./pages/Worksheet.jsx";
import ScaleHeader from "./components/ui/ScaleHeader.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <ScaleHeader />
        <Link className="navlink" to="/">Scale Viewer</Link>
        <Link className="navlink" to="/transpose">Transpose</Link>
        <Link className="navlink" to="/worksheet-generator">Worksheet Generator</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Scales />} />
        <Route path="/transpose" element={<Transpose />} />
        <Route path="/worksheet-generator" element={<Worksheet />} />
      </Routes>
    </BrowserRouter>
  );
}