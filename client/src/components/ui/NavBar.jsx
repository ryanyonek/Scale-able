import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Scale from "../../pages/Scale.jsx";
import Transpose from "../../pages/Transpose.jsx";
import Worksheet from "../../pages/Worksheet.jsx";
import Logo from "./Logo.jsx";
import Links from "./Links.jsx";
import MobileLinks from "./MobileLinks.jsx";
import ErrorBoundary from "./ErrorBoundary.jsx";

export default function NavBar() {
  function getWindowWidth() {
    const { innerWidth: width } = window;
    //console.log(`Width: ${width}`);
    return width;
  }

  function getViewportScale() {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) return 1;
    const match = viewport
      .getAttribute("content")
      .match(/initial-scale=([\d.]+)/);
    return match ? parseFloat(match[1]) : 1;
  }

  function toggleNav() {
    if (!toggleMenu) {
      //console.log("Menu opened");
      setMobileWidth("100%");
      setMobileDisplay("block");
      setToggleMenu(true);
    } else {
      //console.log("Menu closed");
      setMobileWidth("0");
      setMobileDisplay("none");
      setToggleMenu(false);
    }
  }

  const [windowSize, setWindowSize] = useState(getWindowWidth());
  const [viewportScale, setViewportScale] = useState(1);
  const [toggleMenu, setToggleMenu] = useState(false);
  const [mobileWidth, setMobileWidth] = useState("0");
  const [mobileDisplay, setMobileDisplay] = useState("none");
  const mobileLinksStyle = {
    width: mobileWidth,
    display: mobileDisplay,
  };

  useEffect(() => {
    function handleResize() {
      setWindowSize(getWindowWidth());
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) return;
    const observer = new MutationObserver(() => {
      setViewportScale(getViewportScale());
      console.log(`Viewport scale ${viewportScale}`);
    });
    observer.observe(viewport, {
      attributes: true,
      attributeFilter: ["content"],
    });
    return () => observer.disconnect();
  }, []);

  return (
    <BrowserRouter style={{ display: "contents" }}>
      <nav className="navbar">
        <Logo onClick={toggleNav} toggleMenu={toggleMenu} />
        {windowSize < 430 && (
          <span onClick={toggleNav} className="menu">
            ☰
          </span>
        )}
        {windowSize < 430 && toggleMenu && (
          <MobileLinks
            mobileLinksStyle={mobileLinksStyle}
            onClick={toggleNav}
          />
        )}
        {windowSize >= 430 && <Links />}
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            <ErrorBoundary
              fallback={
                <p className="page-error">Scale Viewer failed to load.</p>
              }
            >
              <Scale />
            </ErrorBoundary>
          }
        />
        <Route
          path="/transpose"
          element={
            <ErrorBoundary
              fallback={
                <p className="page-error">Transpose page failed to load.</p>
              }
            >
              <Transpose />
            </ErrorBoundary>
          }
        />
        <Route
          path="/worksheet"
          element={
            <ErrorBoundary
              fallback={<p className="page-error">Worksheet failed to load.</p>}
            >
              <Worksheet />
            </ErrorBoundary>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
