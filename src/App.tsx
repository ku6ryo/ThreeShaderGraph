import style from "./App.module.scss";
import { Board } from "./components/Board";
import { NodeProps, WireProps } from "./components/Board/types";
import { factories } from "./definitions/factories";
import { createGraphFromInputs } from "./backend/createGraphFromInputs";
import { Preview } from "./components/Preview";
import { useState } from "react";
import { ShaderGraph } from "./backend/ShaderGraph";

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