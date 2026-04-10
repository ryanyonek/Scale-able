import { Link } from "react-router-dom";
import logo from "../../assets/cover-resized-2.png"

export default function Logo({onClick, toggleMenu}) {
    return (
        <div className="logo-container">
            {/* Scale-able Logo */}
            <Link onClick={toggleMenu && onClick} to="/"><img className="logo" src={logo} alt="Scale-able Logo" /></Link>
        </div>
    )
}