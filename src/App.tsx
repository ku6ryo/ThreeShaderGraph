import style from "./App.module.scss";
import { Board } from "./components/Board";
import { NodeProps, WireProps } from "./components/Board/types";
import { factories } from "./definitions/factories";
import { createGraphFromInputs } from "./backend/createGraphFromInputs";
import { Preview } from "./components/Preview";
import { useState } from "react";
import { ShaderGraph } from "./backend/ShaderGraph";
import { InNodeInputValue } from "./components/NodeBox";

export function App() {

  const [graph, setGraph] = useState<ShaderGraph | null>(null);

  const onChange = (nodes: NodeProps[], wires: WireProps[]) => {
    try {
      const graph = createGraphFromInputs(nodes, wires)
      setGraph(graph)
    } catch (e) {
      console.error(e)
    }
  }

  const onInSocketValueChange = (nodeId: string, socketIndex: number, value: InNodeInputValue) => {
    if (graph) {
      graph.setInputValue(nodeId, socketIndex, value)
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
        <Preview graph={graph}/>
      </div>
    </>
  )
}