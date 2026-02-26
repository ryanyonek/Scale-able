import { useEffect, useRef, useState } from "react";
import { Renderer } from "vexflow";
import { renderScale } from "../../../lib/render/vexflowRenderer";

const STAVE_SIDE_PADDING = 20;
const DEFAULT_MIN_MEASURE_WIDTH = 160;
const DEFAULT_MAX_MEASURE_WIDTH = 580;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);


export default function VexFlowRenderer({ scaleData, options }) {
  const containerRef = useRef(null);

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

    containerRef.current.innerHTML = "";

    const renderer = new Renderer(
      containerRef.current,
      Renderer.Backends.SVG
    );

    const minMeasureWidth = options.minMeasureSize ?? DEFAULT_MIN_MEASURE_WIDTH;
    const maxMeasureWidth = options.maxMeasureSize ?? DEFAULT_MAX_MEASURE_WIDTH;
    const availableMeasureWidth = (containerWidth - (STAVE_SIDE_PADDING * 2)) / 2;
    const measureSize = clamp(
      availableMeasureWidth,
      minMeasureWidth,
      maxMeasureWidth
    );

    const requiredSvgWidth = (measureSize * 2) + (STAVE_SIDE_PADDING * 2);
    const svgWidth = Math.max(containerWidth, requiredSvgWidth);

    renderer.resize(svgWidth, 220);
    const context = renderer.getContext();

    renderScale({
      context,
      scaleData,
      options: {
        ...options,
        measureSize
      }
    });
  }, [scaleData, options, containerWidth]);

  return <div ref={containerRef} />;
}