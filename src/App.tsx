import style from "./App.module.scss";
import { Board } from "./components/Board";
import { NodeProps, WireProps } from "./components/Board/types";
import { factories } from "./definitions/factories";
import { createGraphFromInputs } from "./backend/createGraphFromInputs";
import { useEffect, useMemo, useRef, useState } from "react";
import { ShaderGraph } from "./backend/ShaderGraph";
import { InNodeInputValue } from "./components/NodeBox";
import { ShaderPreview } from "./components/Preview/ShaderPreview";

export function App() {

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [graph, setGraph] = useState<ShaderGraph | null>(null);
  const [preview, setPreview] = useState<ShaderPreview | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      if (!preview) {
        const preview = new ShaderPreview(canvasRef.current);
        setPreview(preview);
        preview.play()
        console.log("preview", preview);
      }
    }
  }, [canvasRef.current])

  const onChange = (nodes: NodeProps[], wires: WireProps[]) => {
    try {
      const graph = createGraphFromInputs(nodes, wires)
      setGraph(graph)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    if (graph && preview) {
      preview.update(graph);
    }
  }, [graph])

  const onInSocketValueChange = (nodeId: string, socketIndex: number, value: InNodeInputValue) => {
    if (graph) {
      graph.setInputValue(nodeId, socketIndex, value)
      if (preview) {
        preview.render()
      }
    }
  }

  return (
    <>
      <div className={style.board}>
        <Board
          factories={factories}
          onChange={onChange}
          onInSocketValueChange={onInSocketValueChange}
        />
      </div>
      <div className={style.preview}>
        <canvas ref={canvasRef} />
      </div>
    </>
  )
}