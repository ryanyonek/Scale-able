import { useEffect, useRef, useState } from "react";
import { Renderer } from "vexflow";
import { renderScale } from "../../../lib/render/vexflowRenderer";

export default function VexFlowRenderer({ scaleData, options }) {
  const containerRef = useRef(null);

  const { directionMode } = options;
  console.log(`Asc and/or desc: ${directionMode}`);

  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateContainerWidth = () => {
      if (!containerRef.current) return;

      const computedStyle = window.getComputedStyle(containerRef.current);
      const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0;
      const paddingRight = parseFloat(computedStyle.paddingRight) || 0;
      const innerWidth = containerRef.current.clientWidth - paddingLeft - paddingRight;

      setContainerWidth(Math.max(0, innerWidth));
    };

    updateContainerWidth();

    const resizeObserver = new ResizeObserver(updateContainerWidth);
    resizeObserver.observe(containerRef.current);

    window.addEventListener("resize", updateContainerWidth);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateContainerWidth);
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current || !scaleData || !containerWidth) return;

    console.log(`Container width: ${containerWidth}`);

    containerRef.current.innerHTML = "";

    const renderer = new Renderer(
      containerRef.current,
      Renderer.Backends.SVG
    );
    let STAVE_SIDE_PADDING = 20;
    let availableMeasureWidth = (containerWidth - (STAVE_SIDE_PADDING * 2)) / 2;

    if (containerWidth < 880) {
        availableMeasureWidth = containerWidth - (STAVE_SIDE_PADDING * 2);
    } else if (containerWidth >= 880) {
      if (directionMode === "both") {
        availableMeasureWidth = (containerWidth - (STAVE_SIDE_PADDING * 2)) / 2;
      } else if (directionMode === "ascending" || directionMode === "descending") {
        availableMeasureWidth = containerWidth - (STAVE_SIDE_PADDING * 2);
      }
    }

    let measureHeight = 220;
    if (availableMeasureWidth < 420) {
      // need to scale the SVG down 
      const svg = renderer.getContext().svg;
      const scaleFactor = availableMeasureWidth / 420;
      console.log(`Scale factor: ${scaleFactor}`);
      svg.setAttribute("transform", `scale(${scaleFactor})`);
      svg.setAttribute("transform-origin", "top left");
      availableMeasureWidth = 420;
      measureHeight = measureHeight * scaleFactor;
      STAVE_SIDE_PADDING = STAVE_SIDE_PADDING * scaleFactor;
    }
    const measureWidth = availableMeasureWidth;

    console.log(`Container width before rendering: ${containerWidth}`);
    console.log(`Measure size: ${measureWidth}`);

    // width and height for two measures, same line, wider window size
    if (containerWidth > 880 && directionMode === "both") {
      const svgWidth = (measureWidth * 2) + (STAVE_SIDE_PADDING * 2);
      console.log(`SVG Width, wide window, two mm: ${svgWidth}`);
      renderer.resize(svgWidth, measureHeight);
    } else if (containerWidth <= 880 && directionMode === "both") {
      // width and height for two measures, two lines, taller window size
      const svgWidth = measureWidth + (STAVE_SIDE_PADDING * 2);
      console.log(`SVG Width, small window, two mm: ${svgWidth}`);
      renderer.resize(svgWidth, measureHeight * 2);      
    } else {
      // width and height for one measure, one, any window size
      const svgWidth = measureWidth + (STAVE_SIDE_PADDING * 2);
      console.log(`SVG Width for one m: ${svgWidth}`);
      renderer.resize(svgWidth, measureHeight);  
    }

    const context = renderer.getContext();

    renderScale({
      context,
      scaleData,
      options: {
        ...options,
        measureWidth,
        containerWidth,
        measureHeight,
        STAVE_SIDE_PADDING
      }
    });
  }, [scaleData, options, directionMode, containerWidth]);

  return <div ref={containerRef} />;
}