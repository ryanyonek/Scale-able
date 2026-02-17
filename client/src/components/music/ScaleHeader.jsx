import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import logo from "../../assets/cover.png"

export default function ScaleHeader() {
    return (
        <div>
            <Link to="/"><img src={logo} height="50px" alt="Scale-able Logo" /></Link>
        </div>

    )
}