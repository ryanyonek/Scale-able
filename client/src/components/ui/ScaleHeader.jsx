import { Link } from "react-router-dom";
import logo from "../../assets/cover-resized.png"

export default function ScaleHeader() {
    return (
        <div>
            <Link to="/"><img className="logo" src={logo} alt="Scale-able Logo" /></Link>
        </div>

    )
}