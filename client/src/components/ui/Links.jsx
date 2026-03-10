import { NavLink } from "react-router-dom";

export default function Links() {
    return (
        <div className="links">
            <ul>
                <li><NavLink className={({ isActive }) => isActive ? "navlink active-link" : "navlink"} to="/">Scale Viewer</NavLink></li>
                <li><NavLink className={({ isActive }) => isActive ? "navlink active-link" : "navlink"} to="/transpose">Transpose</NavLink></li>
                <li><NavLink className={({ isActive }) => isActive ? "navlink active-link" : "navlink"} to="/worksheet-generator">Worksheet Generator</NavLink></li>
            </ul>
        </div>
    )
}