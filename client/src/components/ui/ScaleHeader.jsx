import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Scale from "../../pages/Scale.jsx";
import Transpose from "../../pages/Transpose.jsx";
import Worksheet from "../../pages/Worksheet.jsx";
import logo from "../../assets/cover-resized.png"

export default function ScaleHeader() {
    return (
        <BrowserRouter>
            <nav className="navbar">
                <Link to="/"><img className="logo" src={logo} alt="Scale-able Logo" /></Link>
                <Link className="navlink" to="/">Scale Viewer</Link>
                <Link className="navlink" to="/transpose">Transpose</Link>
                <Link className="navlink" to="/worksheet-generator">Worksheet Generator</Link>
            </nav>

            <Routes>
                <Route path="/" element={<Scale />} />
                <Route path="/transpose" element={<Transpose />} />
                <Route path="/worksheet-generator" element={<Worksheet />} />
            </Routes>
        </BrowserRouter>
    )
}