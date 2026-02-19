import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Scales from "./pages/Scales.jsx";
import Transpose from "./pages/Transpose.jsx";
import Worksheets from "./pages/Worksheets.jsx";
import ScaleHeader from "./components/ui/ScaleHeader.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <ScaleHeader />
        <Link className="navlink" to="/">Scale Viewer</Link>
        <Link className="navlink" to="/transpose">Transpose</Link>
        <Link className="navlink" to="/worksheets">Worksheets</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Scales />} />
        <Route path="/transpose" element={<Transpose />} />
        <Route path="/worksheets" element={<Worksheets />} />
      </Routes>
    </BrowserRouter>
  );
}