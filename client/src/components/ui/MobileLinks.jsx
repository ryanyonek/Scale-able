import { NavLink} from "react-router-dom";
import "../../styles/main.scss";

export default function MobileLinks(props) {

    return (
        <div>
            <div style={props.mobileLinksStyle} className="mobile-links">
                <ul>
                    <li><NavLink onClick={props.onClick} className={({ isActive }) => isActive ? "mobilelink active-link" : "mobilelink"} to="/">Scale Viewer</NavLink></li>
                    <li><NavLink onClick={props.onClick} className={({ isActive }) => isActive ? "mobilelink" : "mobilelink"} to="/transpose">Transpose</NavLink></li>
                    <li><NavLink onClick={props.onClick} className={({ isActive }) => isActive ? "mobilelink" : "mobilelink"} to="/worksheet-generator">Worksheet Generator</NavLink></li>
                </ul>
            </div>
        </div>

    )
}