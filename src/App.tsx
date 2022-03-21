import style from "./App.module.scss";
import { Board } from "./components/Board";
import { NodeProps, WireProps } from "./components/Board/types";
import { factories } from "./definitions/factories";
import { createGraphFromInputs } from "./backend/createGraphFromInputs";
import { useState } from "react";
import { ShaderGraph } from "./backend/ShaderGraph";
import { InNodeInputValue } from "./components/NodeBox";
import { PrismLight } from "react-syntax-highlighter"
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Preview } from "./components/Preview";
import { RiNodeTree as NodeIcon } from "react-icons/ri"

export function App() {

  const [graph, setGraph] = useState<ShaderGraph | null>(null);
  const [codeShown, setCodeShown] = useState(false);

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
      <div className={style.sidebar}>
        <div className={style.title}>Three.js Shader Node Editor&nbsp;<NodeIcon/></div>
        <div>
          <Preview graph={graph} />
        </div>
      </div>
      <div className={style.board}>
        <Board
          factories={factories}
          onChange={onChange}
          onInSocketValueChange={onInSocketValueChange}
        />
      </div>
      {codeShown && (
        <div className={style.codeModal}>
          <PrismLight language="typescript" style={dracula}>
            {`
      const uniforms: { [key: string ]: Uniform } = {} 
      const uMap = graph.getUniformValueMap()
      Object.keys(uMap).forEach(name => {
        uniforms[name] = new Uniform(uMap[name])
      })
      const builtIns = graph.getBuiltIns()
      const builtInUniforms: any[] = []
      const useLight = builtIns.includes(BuiltIn.DirectionalLight)
      if (useLight) {
        builtInUniforms.push(UniformsLib.lights)
      }
      graph.getNodes().forEach(n => {
        n.updateOnDraw()
      })

      const m = new ShaderMaterial({
        vertexShader: graph.generateVertCode(),
        fragmentShader: graph.generateFragCode(),
        uniforms: UniformsUtils.merge([
          ...builtInUniforms,
          uniforms, 
        ]),
        lights: useLight,
      })
      this.#mesh.onBeforeRender = () => {
        graph.getNodes().forEach(n => {
          n.updateOnDraw()
        })
        const values = graph.getUniformValueMap()
        Object.keys(values).forEach(name => {
          m.uniforms[name].value = values[name]
        })
      }
          `}
          </PrismLight>
        </div>
      )}
    </>
  )
}