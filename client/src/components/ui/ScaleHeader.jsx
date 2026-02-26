import { NavLink, BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Scale from "../../pages/Scale.jsx";
import Transpose from "../../pages/Transpose.jsx";
import Worksheet from "../../pages/Worksheet.jsx";
import logo from "../../assets/cover-resized.png"

export default function ScaleHeader() {
    return (
        <BrowserRouter>
            <nav className="navbar">
                <Link to="/"><img className="logo" src={logo} alt="Scale-able Logo" /></Link>
                <NavLink className={({ isActive }) => isActive ? "navlink active-link" : "navlink"} to="/">Scale Viewer</NavLink>
                <NavLink className={({ isActive }) => isActive ? "navlink active-link" : "navlink"} to="/transpose">Transpose</NavLink>
                <NavLink className={({ isActive }) => isActive ? "navlink active-link" : "navlink"} to="/worksheet-generator">Worksheet Generator</NavLink>
            </nav>

            <Routes>
                <Route path="/" element={<Scale />} />
                <Route path="/transpose" element={<Transpose />} />
                <Route path="/worksheet-generator" element={<Worksheet />} />
            </Routes>
        </BrowserRouter>
    )
}