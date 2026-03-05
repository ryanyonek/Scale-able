import { NavLink} from "react-router-dom";

export default function Links() {
    return (
        <div className="links">
            <ul>
                <li><NavLink className={({ isActive }) => isActive ? "navlink active-link hover-item" : "navlink hover-item"} to="/">Scale Viewer</NavLink></li>
                <li><NavLink className={({ isActive }) => isActive ? "navlink active-link hover-item" : "navlink hover-item"} to="/transpose">Transpose</NavLink></li>
                <li><NavLink className={({ isActive }) => isActive ? "navlink active-link hover-item" : "navlink hover-item"} to="/worksheet-generator">Worksheet Generator</NavLink></li>
            </ul>
        </div>
    )
}