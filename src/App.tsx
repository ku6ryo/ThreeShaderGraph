import style from "./App.module.scss";
import { Board } from "./graph/Board";
import { NodeProps, WireProps } from "./graph/Board/types";
import { factories } from "./graph_definitions/definitions/factories";
import { createGraphFromInputs } from "./graph_definitions/createGraphFromInputs";
import { Preview } from "./graph/Preview";
import { useState } from "react";
import { ShaderGraph } from "./materials/graph/ShaderGraph";

export const App = () => {

  const [graph, setGraph] = useState<ShaderGraph | null>(null);

  function onChange(nodes: NodeProps[], wires: WireProps[]) {
    try {
      console.log(nodes)
      const graph = createGraphFromInputs(nodes, wires)
      setGraph(graph)
    } catch (e) {
      console.error(e)
    }
  }
  return (
    <>
      <div className={style.board}>
        <Board factories={factories} onChange={onChange}/>
      </div>
      <div className={style.preview}>
        <Preview graph={graph}/>
      </div>
    </>
  )
}