import style from "./App.module.scss";
import { Board } from "./components/Board";
import { NodeProps, WireProps } from "./components/Board/types";
import { definitions } from "./definitions";
import { createGraphFromInputs } from "./backend/createGraphFromInputs";
import { useCallback, useRef, useState } from "react";
import { CircularReferenceError, IncompatibleSocketConnectionError, ShaderGraph } from "./backend/ShaderGraph";
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
import { NodeInputValue } from "./definitions/types";

export function App() {

  const [graph, setGraph] = useState<ShaderGraph | null>(null)
  const [jsCode, setJsCode] = useState<string>("")
  const [codeShown, setCodeShown] = useState(false)
  const toasterRef = useRef<Toaster>(null)
  const [invalidWireId, setInvalidaWireId] = useState<string | null>(null)
  const version = packageJson.version;

  const onShowCodeClick = useCallback(() => {
    setCodeShown(true)
    if (graph) {
      setJsCode(graph.js())
    }
  }, [graph])

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

  const onInSocketValueChange = (nodeId: string, socketIndex: number, value: NodeInputValue) => {
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
          <Button
            text="Three.js code"
            icon="code"
            disabled={!!invalidWireId && !jsCode}
            onClick={onShowCodeClick}
          />
        </div>
      </div>
      <div className={style.board}>
        <Board
          nodeDefinitions={definitions}
          onChange={onChange}
          onInSocketValueChange={onInSocketValueChange}
          invalidWireId={invalidWireId}
        />
      </div>
      {codeShown && (
        <div className={style.codeModal} onClick={() => setCodeShown(false)}>
          <div onClick={e => e.stopPropagation()} className={style.codeContainer}>
            <PrismLight language="typescript" style={dracula}>
              {jsCode}
            </PrismLight>
          </div>
        </div>
      )}
      <Toaster position={Position.BOTTOM} ref={toasterRef} maxToasts={1}/>
    </>
  )
}