import { useEffect, useRef, useState } from "react";
import { Renderer } from "vexflow";
import { renderScale } from "../../../lib/render/vexflowRenderer";

const STAVE_SIDE_PADDING = 20;
//const DEFAULT_MIN_MEASURE_WIDTH = 420;
//const DEFAULT_MAX_MEASURE_WIDTH = 580;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);


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

    //const minMeasureWidth = options.minMeasureSize ?? DEFAULT_MIN_MEASURE_WIDTH;
    //const maxMeasureWidth = options.maxMeasureSize ?? DEFAULT_MAX_MEASURE_WIDTH;
    let availableMeasureWidth = (containerWidth - (STAVE_SIDE_PADDING * 2)) / 2;

    if (containerWidth < 840) {
        availableMeasureWidth = containerWidth - (STAVE_SIDE_PADDING * 2);
    } else if (containerWidth >= 840) {
      if (directionMode === "both") {
        availableMeasureWidth = (containerWidth - (STAVE_SIDE_PADDING * 2)) / 2;
      } else if (directionMode === "ascending" || directionMode === "descending") {
        availableMeasureWidth = containerWidth - (STAVE_SIDE_PADDING * 2);
      }
    }

    const measureSize = availableMeasureWidth;
    console.log(`Container width before rendering: ${containerWidth}`);
    console.log(`Measure size: ${measureSize}`);

    // width and height for two measures, same line, wider window size
    if (containerWidth > 840 && directionMode === "both") {
      const svgWidth = (measureSize * 2) + (STAVE_SIDE_PADDING * 2);
      console.log(`SVG Width, wide window, two mm: ${svgWidth}`);
      renderer.resize(svgWidth, 220);
    } else if (containerWidth <= 840 && directionMode === "both") {
      // width and height for two measures, two lines, taller window size
      const svgWidth= measureSize + (STAVE_SIDE_PADDING * 2);
      console.log(`SVG Width, small window, two mm: ${svgWidth}`);
      renderer.resize(svgWidth, 420);      
    } else {
      // width and height for one measure, one, any window size
      const svgWidth= measureSize + (STAVE_SIDE_PADDING * 2);
      console.log(`SVG Width for one m: ${svgWidth}`);
      renderer.resize(svgWidth, 220);  
    }

    const context = renderer.getContext();

    renderScale({
      context,
      scaleData,
      options: {
        ...options,
        measureSize,
        containerWidth
      }
    });
  }, [scaleData, options, directionMode, containerWidth]);

  return <div ref={containerRef} />;
}