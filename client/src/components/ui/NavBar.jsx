import { NavLink, BrowserRouter, Routes, Route} from "react-router-dom";
import Scale from "../../pages/Scale.jsx";
import Transpose from "../../pages/Transpose.jsx";
import Worksheet from "../../pages/Worksheet.jsx";
import Logo from "./Logo.jsx";
import Links from "./Links.jsx";

function openNav() {
    console.log("Menu clicked");
}

export default function NavBar() {
    return (
        <BrowserRouter style={{display: 'contents'}}>
            <nav className="navbar">
                <Logo />
                <Links />
                {/* Empty spacer div to balance the logo's width */}
                <span onClick={openNav()} className="menu">☰</span>
            </nav>

            <Routes>
                <Route path="/" element={<Scale />} />
                <Route path="/transpose" element={<Transpose />} />
                <Route path="/worksheet-generator" element={<Worksheet />} />
            </Routes>
        </BrowserRouter>
    )
}