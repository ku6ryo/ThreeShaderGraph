import style from "./App.module.scss";
import { Board } from "./components/Board";
import { NodeProps, WireProps } from "./components/Board/types";
import { factories } from "./definitions/factories";
import { createGraphFromInputs } from "./backend/createGraphFromInputs";
import { Preview } from "./components/Preview";
import { useEffect, useMemo, useRef, useState } from "react";
import { ShaderGraph } from "./backend/ShaderGraph";
import { InNodeInputValue } from "./components/NodeBox";
import { ShaderPreview } from "./components/Preview/ShaderPreview";

let renderIndex = 0;
export function App() {
  console.log("render index", renderIndex);
  const rederVIndex = renderIndex;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [graph, setGraph] = useState<ShaderGraph | null>(null);
  const [preview, setPreview] = useState<ShaderPreview | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const preview = new ShaderPreview(canvasRef.current);
      setPreview(preview);
    }
  }, [canvasRef.current])

  const onChange = (nodes: NodeProps[], wires: WireProps[]) => {
    try {
      const graph = createGraphFromInputs(nodes, wires)
      setGraph(graph)
      if (preview) {
        console.log("UPDATE")
        preview.update(graph)
        preview.render()
      }
    } catch (e) {
      console.error(e)
    }
  }

  const onInSocketValueChange = (nodeId: string, socketIndex: number, value: InNodeInputValue) => {
    if (graph) {
      console.log("render index v update", rederVIndex);
      graph.setInputValue(nodeId, socketIndex, value)
      if (preview) {
        preview.render()
      }
    }
  }
  renderIndex += 1

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