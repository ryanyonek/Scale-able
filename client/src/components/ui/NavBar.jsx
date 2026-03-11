import { BrowserRouter, Routes, Route} from "react-router-dom";
import { useState, useEffect } from "react";
import Scale from "../../pages/Scale.jsx";
import Transpose from "../../pages/Transpose.jsx";
import Worksheet from "../../pages/Worksheet.jsx";
import Logo from "./Logo.jsx";
import Links from "./Links.jsx";
import MobileLinks from "./MobileLinks.jsx";

export default function NavBar() {
    function getWindowWidth() {
        const { innerWidth: width} = window;
        return width
    }

    function toggleNav() {
        if (!toggleMenu) {
            console.log("Menu opened");
            setMobileWidth("100%")
            setMobileDisplay("block");
            setToggleMenu(true);
        } else if (toggleMenu) {
            console.log("Menu closed");
            setMobileWidth("0")
            setMobileDisplay("none");
            setToggleMenu(false);
        }
    }

    const [windowSize, setWindowSize] = useState(getWindowWidth());
    const [toggleMenu, setToggleMenu] = useState(false);
    const [mobileWidth, setMobileWidth] = useState("0");
    const [mobileDisplay, setMobileDisplay] = useState("none");
    const mobileLinksStyle = {
        width: mobileWidth,
        display: mobileDisplay
    }

    useEffect(() => {
        function handleResize() {
            setWindowSize(getWindowWidth());
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <BrowserRouter style={{display: 'contents'}}>
            <nav className="navbar">
                <Logo 
                    onClick={toggleNav}
                    toggleMenu={toggleMenu}
                />
                {windowSize <= 480 && 
                    <span onClick={toggleNav} className="menu">☰</span>
                }
                {windowSize <= 480 && toggleMenu &&
                    <MobileLinks 
                        mobileLinksStyle={mobileLinksStyle}
                        onClick={toggleNav}
                    />
                }
                {windowSize > 480 &&
                    <Links />
                }
                {windowSize > 768 &&
                    <span className="spacer"></span>
                }

            </nav>

            <Routes>
                <Route path="/" element={<Scale />} />
                <Route path="/transpose" element={<Transpose />} />
                <Route path="/worksheet-generator" element={<Worksheet />} />
            </Routes>
        </BrowserRouter>
    )
}