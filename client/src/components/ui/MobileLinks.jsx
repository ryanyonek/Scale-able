import { NavLink} from "react-router-dom";
import { useState } from "react";
import "../../styles/main.scss";

export default function MobileLinks(props) {

    return (
        <div>
            <div style={props.mobileLinksStyle} className="mobile-links">
                <ul>
                    <li><NavLink className={({ isActive }) => isActive ? "navlink active-link hover-item" : "navlink hover-item"} to="/">Scale Viewer</NavLink></li>
                    <li><NavLink className={({ isActive }) => isActive ? "navlink active-link hover-item" : "navlink hover-item"} to="/transpose">Transpose</NavLink></li>
                    <li><NavLink className={({ isActive }) => isActive ? "navlink active-link hover-item" : "navlink hover-item"} to="/worksheet-generator">Worksheet Generator</NavLink></li>
                </ul>
            </div>
        </div>

    )
}