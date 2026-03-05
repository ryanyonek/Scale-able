import { Link } from "react-router-dom";
import logo from "../../assets/cover-resized-2.png"

export default function Logo() {
    return (
        <div className="logo-container">
            <Link  to="/"><img className="logo" src={logo} alt="Scale-able Logo" /></Link>
        </div>
    )
}