import style from "./App.module.scss";
import { Board } from "./components/Board";
import { NodeProps, WireProps } from "./components/Board/types";
import { factories } from "./definitions/factories";
import { createGraphFromInputs } from "./backend/createGraphFromInputs";
import { useCallback, useRef, useState } from "react";
import { CircularReferenceError, IncompatibleSocketConnectionError, ShaderGraph } from "./backend/ShaderGraph";
import { InNodeInputValue } from "./components/NodeBox";
import { PrismLight } from "react-syntax-highlighter"
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Preview } from "./components/Preview";
import { RiNodeTree as NodeIcon } from "react-icons/ri"
import packageJson from "../package.json"
import { REVISION } from "three";
import { Toaster, Position, Button } from "@blueprintjs/core/lib/esm";
import "../node_modules/@blueprintjs/core/lib/css/blueprint.css"
import "../node_modules/@blueprintjs/icons/lib/css/blueprint-icons.css"
import "../node_modules/@blueprintjs/popover2/lib/css/blueprint-popover2.css"
import { UniformValueNotSetError } from "./backend/ShaderNode";
import { getJSDocOverrideTagNoCache } from "typescript";

export function App() {

  const [graph, setGraph] = useState<ShaderGraph | null>(null)
  const [codeShown, setCodeShown] = useState(false)
  const toasterRef = useRef<Toaster>(null)
  const [invalidWireId, setInvalidaWireId] = useState<string | null>(null)
  const version = packageJson.version;

  const onShowCodeClick = useCallback(() => {
    setCodeShown(true)
  }, [])

  const onChange = (nodes: NodeProps[], wires: WireProps[]) => {
    try {
      const graph = createGraphFromInputs(nodes, wires)
      setGraph(graph)
      setInvalidaWireId(null)
      if (invalidWireId) {
        toasterRef.current?.show({
          message: "Well done!",
          icon: "tick",
          intent: "success",
        })
      }
    } catch (e) {
      console.error(e)
      if (toasterRef.current) {
        if (e instanceof CircularReferenceError) {
          toasterRef.current.show({
            message: "Circular reference",
            intent: "danger",
            icon: "refresh"
          })
          setInvalidaWireId(e.wireId)
          return
        }
        if (e instanceof UniformValueNotSetError) {
          toasterRef.current.show({
            message: e.message,
            intent: "danger",
            icon: "error"
          })
          return
        }
        if (e instanceof IncompatibleSocketConnectionError) {
          toasterRef.current.show({
            message: "Incompatible wire. Socket type mismatch.",
            intent: "danger",
            icon: "disable"
          })
          setInvalidaWireId(e.wireId)
          return
        }
        if (e instanceof Error) {
          toasterRef.current.show({
            message: e.message,
            intent: "danger",
            icon: "error"
          })
          return
        }
        toasterRef.current.show({
          message: "Fatal error: non Error thrown",
          intent: "danger",
          icon: "error"
        })
      }
    }
  }

  const onInSocketValueChange = (nodeId: string, socketIndex: number, value: InNodeInputValue) => {
    if (graph && graph.hasNode(nodeId)) {
      graph.setInputValue(nodeId, socketIndex, value)
    }
  }

  return (
    <>
      <div className={style.sidebar}>
        <div className={style.title}>Three.js Shader Graph Editor&nbsp;<NodeIcon/></div>
        <div className={style.versions}>
          <span>{`Editor: v${version}`}</span>
          <span>&nbsp;&nbsp;&nbsp;</span>
          <span>{`Three.js: r${REVISION}`}</span>
        </div>
        <div className={style.preview}>
          <Preview graph={graph} />
        </div>
        <div>
          <Button text="Three.js code" icon="code" disabled={!!invalidWireId} onClick={onShowCodeClick}/>
        </div>
      </div>
      <div className={style.board}>
        <Board
          factories={factories}
          onChange={onChange}
          onInSocketValueChange={onInSocketValueChange}
          invalidWireId={invalidWireId}
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
      <Toaster position={Position.BOTTOM} ref={toasterRef} maxToasts={1}/>
    </>
  )
}