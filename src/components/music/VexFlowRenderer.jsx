import { useEffect, useRef } from "react";
import { Renderer } from "vexflow";
import { renderScale } from "../../utils/musicTheory";

export default function VexFlowRenderer(props) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = "";

    const renderer = new Renderer(
      containerRef.current,
      Renderer.Backends.SVG
    );

    renderer.resize(1500, 300);
    const context = renderer.getContext();

    renderScale({ context, ...props });
  }, [props]);

  return <div ref={containerRef} />;
}