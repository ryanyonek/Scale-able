import { useEffect, useRef } from "react";
import { Renderer } from "vexflow";
import { renderScale } from "../../../lib/render/vexflowRenderer";

export default function VexFlowRenderer({ scaleData, options }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !scaleData) return;

    containerRef.current.innerHTML = "";

    const renderer = new Renderer(
      containerRef.current,
      Renderer.Backends.SVG
    );

    renderer.resize(1200, 220);
    const context = renderer.getContext();

    renderScale({ context, scaleData, options });
  }, [scaleData, options]);

  return <div ref={containerRef} />;
}