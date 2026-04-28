import { useEffect, useRef, useState } from "react";
import { Renderer } from "vexflow";
import { renderScale } from "../../../lib/render/vexflowRenderer";

export default function VexFlowRenderer({ scaleData, options, forcedWidth }) {
  const containerRef = useRef(null);

  const { directionMode } = options;
  //console.log(`Asc and/or desc: ${directionMode}`);

  // When forcedWidth is provided (e.g. during printing) we skip ResizeObserver
  // entirely and use the target width immediately, avoiding the async
  // layout-then-observe cycle that can miss the window.print() deadline on mobile.
  const [containerWidth, setContainerWidth] = useState(forcedWidth ?? 0);

  // Sync containerWidth whenever forcedWidth is set or cleared.
  // useState only uses the initializer once, so prop changes need an effect.
  useEffect(() => {
    if (forcedWidth !== undefined) {
      setContainerWidth(forcedWidth);
    }
  }, [forcedWidth]);

  // Updating the window width as the size changes (skipped when width is forced)
  useEffect(() => {
    if (forcedWidth !== undefined) return;
    if (!containerRef.current) return;

    const updateContainerWidth = () => {
      if (!containerRef.current) return;

      const computedStyle = window.getComputedStyle(containerRef.current);
      const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0;
      const paddingRight = parseFloat(computedStyle.paddingRight) || 0;
      const innerWidth =
        containerRef.current.clientWidth - paddingLeft - paddingRight;

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
  }, [forcedWidth]);

  // checking initializations
  useEffect(() => {
    if (!containerRef.current || !scaleData || !containerWidth) return;

    //console.log(`Container width: ${containerWidth}`);

    containerRef.current.innerHTML = "";

    const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
    let STAVE_SIDE_PADDING = 20;
    let STAVE_TOP_PADDING = 50;
    let availableMeasureWidth = (containerWidth - STAVE_SIDE_PADDING * 2) / 2;

    // setting the width available for a measure
    if (containerWidth < 880) {
      availableMeasureWidth = containerWidth - STAVE_SIDE_PADDING * 2;
    } else if (containerWidth >= 880) {
      if (directionMode === "both") {
        availableMeasureWidth = (containerWidth - STAVE_SIDE_PADDING * 2) / 2;
      } else if (
        directionMode === "ascending" ||
        directionMode === "descending"
      ) {
        availableMeasureWidth = containerWidth - STAVE_SIDE_PADDING * 2;
      }
    }

    console.log(availableMeasureWidth);
    let scaleFactor = 1.0;
    let measureHeight = 260;
    if (availableMeasureWidth < 420) {
      // need to scale the SVG down
      const svg = renderer.getContext().svg;
      scaleFactor = availableMeasureWidth / 420;
      console.log(`Scale factor: ${scaleFactor}`);
      svg.setAttribute("transform", `scale(${scaleFactor})`);
      svg.setAttribute("transform-origin", "top left");
      // Select the meta tag by its name attribute
      const viewport = document.querySelector('meta[name="viewport"]');
      // Check if it exists, then change the content
      if (viewport) {
        viewport.setAttribute(
          "content",
          `width=device-width, initial-scale=${scaleFactor}`,
        );
      }
      availableMeasureWidth = 420;
      measureHeight = measureHeight * scaleFactor;
      STAVE_TOP_PADDING = STAVE_TOP_PADDING * scaleFactor;
      STAVE_SIDE_PADDING = STAVE_SIDE_PADDING * scaleFactor;
    }
    const measureWidth = availableMeasureWidth;

    //console.log(`Container width before rendering: ${containerWidth}`);
    //console.log(`Measure size: ${measureWidth}`);

    // width and height for two measures, same line, wider window size
    if (containerWidth > 880 && directionMode === "both") {
      const svgWidth = measureWidth * 2 + STAVE_SIDE_PADDING * 2;
      renderer.resize(svgWidth, measureHeight);
    } else if (containerWidth <= 880 && directionMode === "both") {
      // width and height for two measures, two lines, taller window size
      const svgWidth = measureWidth + STAVE_SIDE_PADDING * 2;
      renderer.resize(svgWidth, measureHeight * 2);
    } else {
      // width and height for one measure, one, any window size
      const svgWidth = measureWidth + STAVE_SIDE_PADDING * 2;
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
        STAVE_SIDE_PADDING,
        STAVE_TOP_PADDING,
        scaleFactor,
      },
    });
  }, [scaleData, options, directionMode, containerWidth]);

  return <div ref={containerRef} />;
}
