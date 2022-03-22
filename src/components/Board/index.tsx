import React, { MouseEventHandler, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { NodeBox, InSocket, OutSocket, SocketDirection, NodeColor, InNodeInputValue } from "../NodeBox";
import { WireLine } from "../WireLine";
import style from "./style.module.scss"
import classnames from "classnames"
import { HistoryManager } from "./HistoryManager";
import { NodeProps, WireProps } from "./types"
import shortUUID from "short-uuid";
import { NodeWireManager } from "./NodeWireManger";
import { outputFactories } from "../../definitions/output";
import { Slider } from "@blueprintjs/core";

/**
 * ZOOM configurations
 */
const MAX_ZOOM = 2.5
const MIN_ZOOM = 0.3
const ZOOM_STEP = 0.05

/**
 * Generates a unique id for nodes and wires.
 */
function generateId() {
  return shortUUID.generate()
}

/**
 * Checks if two rect are overlapping.
 */
function hasRectOverlap(r1: Rect, r2: Rect) {
  return !(r1.x + r1.width < r2.x || r1.x > r2.x + r2.width || r1.y + r1.height < r2.y || r1.y > r2.y + r2.height)
}

type DraggingNodeStats = {
  startMouseX: number,
  startMouseY: number,
  nodes: { [id: string]: NodeProps },
  wires: { [key: string]: WireProps },
}

type DrawingRectStats = {
  startX: number,
  startY: number,
  x: number
  y: number
  width: number
  height: number
}

type DrawingWireStats = {
  startNodeId: string,
  startSocketIndex: number,
  startDirection: SocketDirection,
  startX: number,
  startY: number,
  movingX: number,
  movingY: number,
  editExisting: boolean,
}

type DraggingBoardStats = {
  startCenterX: number,
  startCenterY: number,
  startMouseX: number,
  startMouseY: number,
}

type BoardStats = {
  // The position displayed at the cneter of the board svg.
  centerX: number,
  centerY: number,
  // SVG Element DOM size.
  domHeight: number,
  domWidth: number,
  zoom: number,
}

export type NodeBlueprint = {
  color: NodeColor,
  inSockets: InSocket[],
  outSockets: OutSocket[],
  deletable?: boolean,
}

export type NodeFactory = {
  id: string,
  name: string
  factory: () => NodeBlueprint
}

type Rect = {
  x: number,
  y: number,
  width: number,
  height: number,
}

type Props = {
  factories: NodeFactory[]
  onChange: (nodes: NodeProps[], wires: WireProps[]) => void
  onInSocketValueChange: (id: string, index: number, value: InNodeInputValue) => void
}

/**
 * A board to place nodes and wires.
 */
export function Board({
  factories,
  onChange,
  onInSocketValueChange,
}: Props) {
  const svgRootRef = useRef<SVGSVGElement | null>(null)
  const [board, setBoard] = useState<BoardStats>({
    centerX: 0,
    centerY: 0,
    domWidth: 1000,
    domHeight: 1000,
    zoom: 1,
  })
  const [cursorOnBoad, setCursorOnBoard] = useState(false)
  const [draggingBoard, setDraggingBoard] = useState<DraggingBoardStats | null>(null)
  const [drawingWire, setDrawingWire] = useState<DrawingWireStats | null>(null)
  const [draggingNode, setDraggingNode] = useState<DraggingNodeStats | null>(null)
  const [drawingRect, setDrawingRect] = useState<DrawingRectStats | null>(null)
  const [_, setNwUpdate] = useState("")
  const [nodeRects, setNodeRects] = useState<{ [id: string]: Rect }>({})
  // Singletons
  const nwManager = useMemo(() => {
    const m = new NodeWireManager()
    m.setOnUpdate((id) => {
      setNwUpdate(id)
    })
    return m
  }, [])
  const historyManager = useMemo(() => {
    const manager = new HistoryManager()
    return manager
  }, [])
  // Please use this function instead of directly calling `onChange`
  const notifyChange = useCallback(() => {
    const nodes = nwManager.getNodes()
    const wires = nwManager.getWires()
    onChange(nodes, wires)
  }, [onChange])
  // Please usee this function instead of directly calling `historyManger.save()`.
  const saveHistory = useCallback(() => {
    historyManager.save(nwManager.getNodes(), nwManager.getWires())
  }, [])

  useEffect(() => {
    const f = outputFactories[0]
    const n = f.factory()
    const newNodes = [{
      id: f.id + generateId(),
      typeId: f.id,
      x: board.centerX,
      y: board.centerY,
      color: n.color,
      name: f.name,
      selected: true,
      inSockets: n.inSockets,
      outSockets: n.outSockets,
      deletable: n.deletable === undefined ? true : n.deletable,
    } as NodeProps]
    nwManager.updateNodes(newNodes)
    saveHistory()
    notifyChange()
  }, [])

  const goToPrevHistory = () => {
    const history = historyManager.goBack()
    if (!history) {
      console.log("No history to go back to")
      return
    }
    const nodes = Object.values(history.nodes)
    const wires = Object.values(history.wires)
    nwManager.updateNodes(nodes)
    nwManager.updateWires(wires)
    notifyChange()
  }

  const onSocketMouseDown = useCallback((id: string, dir: SocketDirection, i: number, x: number, y: number) => {
    const node = nwManager.getNode(id)
    const zoomedX = x / board.zoom + node.x
    const zoomedY = y / board.zoom + node.y
    if (dir === "out") {
      setDrawingWire({
        startDirection: dir,
        startNodeId: id,
        startSocketIndex: i,
        startX: zoomedX,
        startY: zoomedY,
        movingX: zoomedX,
        movingY: zoomedY,
        editExisting: false,
      })
    } else {
      const wires = nwManager.getWires()
      const existingWire = wires.find(w => w.outNodeId === id && w.outSocketIndex === i)
      if (existingWire) {
        nwManager.updateWires(wires.filter(w => w !== existingWire))
        setDrawingWire({
          startDirection: "out",
          startNodeId: existingWire.inNodeId,
          startSocketIndex: existingWire.inSocketIndex,
          startX: existingWire.inX,
          startY: existingWire.inY,
          movingX: zoomedX,
          movingY: zoomedY,
          editExisting: true,
        })
      } else {
        setDrawingWire({
          startDirection: dir,
          startNodeId: id,
          startSocketIndex: i,
          startX: zoomedX,
          startY: zoomedY,
          movingX: zoomedX,
          movingY: zoomedY,
          editExisting: false,
        })
      }
    }
  }, [board.zoom])

  const onSocketMouseUp = useCallback((id: string, dir: SocketDirection, i: number, x: number, y: number) => {
    if (drawingWire === null || drawingWire.startNodeId === id || drawingWire.startDirection === dir) {
      return
    }
    const node = nwManager.getNode(id)
    const zoomedX = x / board.zoom + node.x
    const zoomedY = y / board.zoom + node.y
    const wires = nwManager.getWires()
    let newWires: WireProps[] = []
    if (drawingWire.startDirection === "in") {
      newWires = [
        ...wires,
        {
          id: "w" + generateId(),
          inNodeId: id,
          inSocketIndex: i,
          outNodeId: drawingWire.startNodeId,
          outSocketIndex: drawingWire.startSocketIndex,
          inX: zoomedX,
          inY: zoomedY,
          outX: drawingWire.startX,
          outY: drawingWire.startY,
        }
      ]
    } else {
      const newWire = {
        id: "w" + generateId(),
        inNodeId: drawingWire.startNodeId,
        inSocketIndex: drawingWire.startSocketIndex,
        outNodeId: id,
        outSocketIndex: i,
        inX: drawingWire.startX,
        inY: drawingWire.startY,
        outX: zoomedX,
        outY: zoomedY,
      }
      const existingWire = wires.find(w => w.outNodeId === id && w.outSocketIndex === i)
      if (existingWire) {
        newWires = wires.filter(w => w !== existingWire).concat(newWire)
      } else {
        newWires = [...wires, newWire]
      }
    }
    nwManager.updateWires(newWires)
    saveHistory()
    notifyChange()
    setDrawingWire(null)
  }, [board.zoom, drawingWire])

  const onNodeDragStart = useCallback((id: string, mouseX: number, mouseY: number) => {
    const nodes = nwManager.getNodes()
    const targetNode = nodes.find(n => n.id === id)
    if (targetNode) {
      // Wheel button
      if (!svgRootRef.current) {
        return
      }
      const svgRect = svgRootRef.current.getBoundingClientRect()
      const mouseOnBoardX = mouseX - svgRect.x
      const mouseOnBoardY = mouseY - svgRect.y
      if (!targetNode.selected) {
        nodes.forEach(n => {
          n.selected = false
        })
      }
      targetNode.selected = true
      const nodesToSave: { [key: string]: NodeProps } = {}
      nodes.forEach(n => {
        nodesToSave[n.id] = {...n}
      })
      const wiresToSave: { [key: string]: WireProps } = {}
      const wires = nwManager.getWires()
      wires.forEach(w => {
        wiresToSave[w.id] = {...w}
      })
      setDraggingNode({
        startMouseX: mouseOnBoardX,
        startMouseY: mouseOnBoardY,
        nodes: nodesToSave,
        wires: wiresToSave,
      })
      const newNodes = [...nodes]
      const newWires = [...wires]
      nwManager.updateNodes(newNodes)
      nwManager.updateWires(newWires)
    }
  }, [svgRootRef.current])

  const onMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRootRef.current) {
      return
    }
    const svgRect = svgRootRef.current.getBoundingClientRect()
    const mouseX = e.clientX - svgRect.x
    const mouseY = e.clientY - svgRect.y
    const boardX = board.centerX + (mouseX- board.domWidth / 2) / board.zoom
    const boardY = board.centerY + (mouseY- board.domHeight / 2) / board.zoom

    if (drawingWire) {
      setDrawingWire({
        ...drawingWire,
        movingX: boardX + (drawingWire.startDirection === "in" ? 1 : -1) * 3 / board.zoom,
        movingY: boardY,
      })
    }

    if (draggingNode) {
      const dMouseX = mouseX - draggingNode.startMouseX
      const dMouseY = mouseY - draggingNode.startMouseY
      const savedNodes = draggingNode.nodes
      const savedWires = draggingNode.wires
      const nodes = nwManager.getNodes()
      const wires = nwManager.getWires()
      const updatedNodes = nodes.map(n => {
        if (!n.selected) {
          return n
        }
        const lastNode = savedNodes[n.id]
        if (!lastNode) {
          throw new Error("no last node ... might be a bug")
        }
        const nx = lastNode.x + dMouseX / board.zoom
        const ny = lastNode.y + dMouseY / board.zoom
        n.x = nx
        n.y = ny
        const nr = nodeRects[n.id]
        nr.x = nx
        nr.y = ny
        wires.forEach(w => {
          const lastWire = savedWires[w.id]
          if (!lastWire) {
            throw new Error("no last wire ... might be a bug")
          }
          if (w.inNodeId === n.id) {
            w.inX = lastWire.inX + dMouseX / board.zoom
            w.inY = lastWire.inY + dMouseY / board.zoom
          }
          if (w.outNodeId === n.id) {
            w.outX = lastWire.outX + dMouseX / board.zoom
            w.outY = lastWire.outY + dMouseY / board.zoom
          }
        })
        return n
      })
      setNodeRects({...nodeRects})
      nwManager.updateNodes(updatedNodes)
      nwManager.updateWires([...wires])
    }
    if (draggingBoard) {
      const x = draggingBoard.startCenterX - (mouseX - draggingBoard.startMouseX) / board.zoom
      const y = draggingBoard.startCenterY - (mouseY - draggingBoard.startMouseY) / board.zoom
      setBoard({
        ...board,
        centerX: x,
        centerY: y,
      })
    }
    if (drawingRect && svgRootRef.current) {
      const { startX, startY } = drawingRect
      setDrawingRect({
        ...drawingRect,
        x: Math.min(startX, boardX),
        y: Math.min(startY, boardY),
        width: Math.abs(startX - boardX),
        height: Math.abs(startY - boardY),
      })
    }
  }, [board.zoom, board.centerX, board.centerY, drawingWire, draggingNode, draggingBoard, drawingRect, svgRootRef.current, nodeRects])

  const onMouseUp = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const nodes = nwManager.getNodes()
    if (drawingWire) {
      setDrawingWire(null)

      // If exiting wire is being edited and removed, notify the change.
      if (drawingWire.editExisting) {
        notifyChange()
      }
    }
    if (draggingNode) {
      saveHistory()
      setDraggingNode(null)
    }
    setDraggingBoard(null)
    if (drawingRect) {
      const newNodes = nodes.map(n => {
        const rect = nodeRects[n.id]
        if (!rect) {
          throw new Error("no rect found for the node. ID: " + n.id)
        }
        if (hasRectOverlap(drawingRect, rect)) {
          n.selected = true
        } else {
          n.selected = false
        }
        return n
      })
      nwManager.updateNodes(newNodes)
      saveHistory()
    } else if (e.target === svgRootRef.current) {
      const newNodes = nodes.map(n => { n.selected = false; return n })
      nwManager.updateNodes(newNodes)
      saveHistory()
    }
    setDrawingRect(null)
  }, [drawingRect, nodeRects, draggingNode, drawingWire])
  
  const onMouseEnter = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    setCursorOnBoard(true)
  }, [])

  const onMouseLeave = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    setCursorOnBoard(false)
    setDrawingWire(null)
    setDraggingNode(null)
    setDraggingBoard(null)
    setDrawingRect(null)
  }, [])

  const onMouseDown = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    // Wheel button
    if (!svgRootRef.current) {
      return
    }
    const svgRect = svgRootRef.current.getBoundingClientRect()
    const mouseX = e.clientX - svgRect.x
    const mouseY = e.clientY - svgRect.y

    // Start dragging board
    // Mouse wheel click or Left click + shift (for trackpad devices like Macbook)
    if (e.button == 1 || (e.button == 0 && e.shiftKey)) {
      setDraggingBoard({
        startCenterX: board.centerX,
        startCenterY: board.centerY,
        startMouseX: mouseX,
        startMouseY: mouseY,
      })
      return
    }

    // Start drawing selection rect
    if (e.button == 0 && svgRootRef.current) {
      const svgRect = svgRootRef.current.getBoundingClientRect()
      const x = board.centerX + (e.clientX - svgRect.x - board.domWidth / 2) / board.zoom
      const y = board.centerY + (e.clientY - svgRect.y - board.domHeight / 2) / board.zoom
      setDrawingRect({
        startX: x,
        startY: y,
        x: x,
        y: y,
        width: 0,
        height: 0,
      })
    }
  }, [board.zoom, board.centerX, board.centerY, board.domWidth, board.domHeight, svgRootRef.current])

  const onNodeResize = useCallback((id: string, rect: DOMRect) => {
    if (!svgRootRef.current) {
      return
    }
    const svgRect = svgRootRef.current.getBoundingClientRect()
    const x = (rect.x - svgRect.x + board.centerX - board.domWidth / 2) / board.zoom
    const y = (rect.y - svgRect.y + board.centerY - board.domHeight / 2) / board.zoom
    nodeRects[id] = {
      x,
      y,
      width: rect.width / board.zoom,
      height: rect.height / board.zoom,
    }
    setNodeRects({ ...nodeRects })
  }, [svgRootRef.current, nodeRects])

  const onNodeAdd: MouseEventHandler<HTMLDivElement> = useCallback((e) => {
    const typeId = e.currentTarget.dataset.nodeTypeId
    const f = factories.find(f => f.id === typeId)
    if (f) {
      const nodes = nwManager.getNodes().map(n => ({...n, selected: false}))
      const n = f.factory()
      const newNodes = [
        ...nodes,
        {
          id: f.id + "_" + generateId(),
          typeId: f.id,
          x: board.centerX,
          y: board.centerY,
          color: n.color,
          name: f.name,
          selected: true,
          inSockets: n.inSockets,
          outSockets: n.outSockets,
          deletable: n.deletable === undefined ? true : n.deletable,
        } as NodeProps
      ]
      nwManager.updateNodes(newNodes)
      saveHistory()
      notifyChange()
    } else {
      throw new Error("No factory found for node type " + typeId)
    }
  }, [factories, nwManager, board.centerX, board.centerY])

  useEffect(() => {
    const keydownListener = (e: KeyboardEvent) => {
      const nodes = nwManager.getNodes()
      const wires = nwManager.getWires()
      if (e.code === "Delete" || e.code === "Backspace") {
        const nodesToKeep = nodes.filter(n => !n.selected || !n.deletable)
        const nodesToRemove = nodes.filter(n => n.selected && n.deletable)
        const wiresToKeep = wires.filter(w => {
          return !nodesToRemove.find(n => {
            return w.inNodeId === n.id || w.outNodeId === n.id
          })
        })
        if (nodesToRemove.length > 0) {
          nwManager.updateNodes(nodesToKeep)
          nwManager.updateWires(wiresToKeep)
          saveHistory()
          notifyChange()
        }
      }
      if (e.code === "Escape") {
        nwManager.updateNodes(nodes.map(n => { n.selected = false; return n }))
      }
      if (e.code === "KeyZ" && e.ctrlKey) {
        goToPrevHistory()
      }
    }
    window.addEventListener("keydown", keydownListener)
    return () => {
      window.removeEventListener("keydown", keydownListener)
    }
  }, [svgRootRef.current])

  // window resize
  useEffect(() => {
    const resizeListener = () => {
      if (svgRootRef.current) {
        setBoard({
          ...board,
          domHeight: svgRootRef.current.clientHeight,
          domWidth: svgRootRef.current.clientWidth,
        })
      }
    }
    window.addEventListener("resize", resizeListener)
    return () => {
      window.removeEventListener("resize", resizeListener)
    }
  }, [board, svgRootRef.current])

  // mouse wheel
  useEffect(() => {
    const mouseWheelListener = (e: WheelEvent) => {
      if (!cursorOnBoad || draggingBoard) {
        return
      }
      const s = Math.sign(e.deltaY)
      if ((s > 0 && board.zoom >= MIN_ZOOM) || (s < 0 && board.zoom <= MAX_ZOOM - ZOOM_STEP)) {
        setBoard({
          ...board,
          zoom: board.zoom - ZOOM_STEP * Math.sign(e.deltaY)
        })
      }
    }
    window.addEventListener("wheel", mouseWheelListener)
    return () => {
      window.removeEventListener("wheel", mouseWheelListener)
    }
  }, [board, cursorOnBoad, draggingBoard])

  const onZoomSliderChange = useCallback((v: number) => {
    setBoard({
      ...board,
      zoom: v,
    })
  }, [board])

  // Initially set the board size.
  useEffect(() => {
    if (svgRootRef.current) {
      setBoard({
        centerX: 0,
        centerY: 0,
        domHeight: svgRootRef.current.clientHeight,
        domWidth: svgRootRef.current.clientWidth,
        zoom: 1
      })
    }
  }, [svgRootRef.current])
  // Fires when socket value is changed in the node UI component.
  const onInSocketValueChangeInternal = useCallback((nodeId: string, index: number, value: InNodeInputValue) => {
    const n = nwManager.getNode(nodeId)
    if (n) {
      const s = n.inSockets[index]
      s.alternativeValue = value
      n.inSockets = [...n.inSockets]
      const newSocket = {...s}
      n.inSockets[index] = newSocket
      nwManager.updateNode(n)
      onInSocketValueChange(nodeId, index, value)
    }
  }
  , [nwManager, onInSocketValueChange])

  // Preparing for rendering.
  const viewBox = useMemo(() => {
    return `${board.centerX - board.domWidth / 2 / board.zoom} ${board.centerY - board.domHeight / 2 / board.zoom} ${board.domWidth / board.zoom} ${board.domHeight / board.zoom}`
  }, [board])
  const nodes = useMemo(() => {
    return nwManager.getNodes()
  }, [nwManager.getUpdateId()])
  const wires = useMemo(() => {
    return nwManager.getWires()
  }, [nwManager.getUpdateId()])

  return (
    <div className={style.frame}>
      <div className={style.nodeSelector}>
        {factories.map(f => (
          <div
            key={f.id}
            className={style.item}
            data-node-type-id={f.id}
            onClick={onNodeAdd}
          >{f.name}</div>
        ))}
      </div>
      <svg
        className={classnames({
          [style.board]: true,
          [style.grabbing]: !!draggingNode || !!draggingBoard,
        })}
        ref={svgRootRef}
        viewBox={viewBox}
        preserveAspectRatio="none"
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseDown={onMouseDown}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
       <defs>
          <linearGradient id="wire-linear" x1="20%" y1="0%" x2="80%" y2="0%" spreadMethod="pad">
            <stop offset="0%"   stopColor="#ddd"/>
            <stop offset="100%" stopColor="#888"/>
          </linearGradient>
          <pattern id="board-background-pattern" viewBox="0 0 24 24" width={"0.02%"} height="0.02%">
            <g className={style.boardPattern} fill="#000000">
              <polygon id="Rectangle-20" points="1.99840144e-15 18 6 18 12 12 12 18 18 18 12 24 3.99680289e-15 24"></polygon>
              <polygon id="Rectangle-20-Copy" points="24 18 24 24 18 24"></polygon>
              <polygon id="Rectangle-20-Copy-2" points="24 1.77635684e-15 18 6 12 6 18 1.77635684e-15"></polygon>
              <polygon id="Rectangle-20-Copy-3" points="12 -4.08562073e-14 12 6 0 18 1.99840144e-15 12 6 6 1.99840144e-15 6 1.99840144e-15 1.11022302e-15"></polygon>
            </g>
          </pattern>
        </defs>
        <circle cx={0} cy={0} r={100000} fill="url(#board-background-pattern)" />
        {wires.map(w => (
          <WireLine key={w.id} x1={w.inX} y1={w.inY} x2={w.outX} y2={w.outY}/>
        ))}
        {nodes.map((n) => (
          <NodeBox
            key={n.id}
            id={n.id}
            name={n.name}
            color={n.color}
            x={n.x}
            y={n.y}
            selected={n.selected}
            inSockets={n.inSockets}
            outSockets={n.outSockets}
            onSocketMouseDown={onSocketMouseDown}
            onSocketMouseUp={onSocketMouseUp}
            onDragStart={onNodeDragStart}
            onInSocketValueChange={onInSocketValueChangeInternal}
            onNodeResize={onNodeResize}
          />
        ))}
        {drawingWire && (drawingWire.startDirection == "in" ? (
          <WireLine x1={drawingWire.movingX} y1={drawingWire.movingY} x2={drawingWire.startX} y2={drawingWire.startY}/>
        ) : (
          <WireLine x1={drawingWire.startX} y1={drawingWire.startY} x2={drawingWire.movingX} y2={drawingWire.movingY}/>
        ))}
        {drawingRect && (
          <rect
            x={drawingRect.x}
            y={drawingRect.y}
            width={drawingRect.width}
            height={drawingRect.height}
            fill="rgba(255, 255, 255, 0.1)"
            stroke="white"
            strokeWidth={2 / board.zoom}
            strokeLinecap="round"
            strokeDasharray={`${4 / board.zoom} ${4 / board.zoom}`}
          />
        )}
      </svg>
      <div className={style.zoomSlider}>
        <Slider
          min={MIN_ZOOM}
          max={MAX_ZOOM}
          stepSize={ZOOM_STEP}
          labelStepSize={10}
          onChange={onZoomSliderChange}
          labelRenderer={(value) => `${(value * 100).toFixed()}%`}
          showTrackFill={false}
          value={board.zoom}
          vertical={true}
        />
      </div>
    </div>
  )
}