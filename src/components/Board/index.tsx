import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { NodeBlock } from "./NodeBlock";
import { SocketDirection } from "./NodeBlock/types";
import { WireLine } from "../WireLine";
import style from "./style.module.scss"
import classnames from "classnames"
import { HistoryManager } from "./HistoryManager";
import { NodeProps, WireProps } from "./types"
import shortUUID from "short-uuid";
import { NodeWireManager } from "./NodeWireManger";
import { outputDefs } from "../../definitions/output";
import { Slider } from "@blueprintjs/core";
import { NodeSelector } from "./NodeSelector";
import { NodeDefinition, NodeInputValue } from "../../definitions/types";
import { NodeRectsManager } from "./NodeRectsManger";

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
  domX: number,
  domY: number,
  domHeight: number,
  domWidth: number,
  zoom: number,
}

/**
 * Considering the current zoom level and the center of the board, calculates the position of the geometries. 
 * Arguments x, y, width, height must be client coordinates (getBoundingClientRect()).
 */
const calcGeoOnBoard = (board: BoardStats, x: number, y: number, width: number, height: number) => {
  const { centerX, centerY, zoom, domX, domY, domHeight, domWidth } = board
  const newX = (x - domX - domWidth / 2) / zoom + centerX
  const newY = (y - domY - domHeight / 2) / zoom + centerY
  const newW = width / zoom
  const newH = height / zoom
  return {
    x: newX,
    y: newY,
    width: newW,
    height: newH,
  }
}

type Props = {
  nodeDefinitions: NodeDefinition[],
  onChange: (nodes: NodeProps[], wires: WireProps[]) => void
  onInSocketValueChange: (id: string, index: number, value: NodeInputValue) => void
  invalidWireId: string | null
}

/**
 * A board to place nodes and wires.
 */
export function Board({
  nodeDefinitions,
  onChange,
  onInSocketValueChange,
  invalidWireId,
}: Props) {
  const svgRootRef = useRef<SVGSVGElement | null>(null)
  const [board, setBoard] = useState<BoardStats>({
    centerX: 0,
    centerY: 0,
    domX: 0,
    domY: 0,
    domWidth: 1000,
    domHeight: 1000,
    zoom: 1,
  })
  const [draggingBoard, setDraggingBoard] = useState<DraggingBoardStats | null>(null)
  const [drawingWire, setDrawingWire] = useState<DrawingWireStats | null>(null)
  const [draggingNode, setDraggingNode] = useState<DraggingNodeStats | null>(null)
  const [drawingRect, setDrawingRect] = useState<DrawingRectStats | null>(null)
  const [nodeIdToGeoUpdate, setNodeIdToGeoUpdate] = useState<string | null>(null)
  const [_, setNwUpdate] = useState("")
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
  const rectsManager = useMemo(() => {
    return new NodeRectsManager()
  }, [])
  // Please use this function instead of directly calling `onChange`
  const notifyChange = useCallback(() => {
    onChange(nwManager.getNodes(), nwManager.getWires())
  }, [onChange])
  // Please usee this function instead of directly calling `historyManger.save()`.
  const saveHistory = useCallback(() => {
    historyManager.save(nwManager.getNodes(), nwManager.getWires())
  }, [])
  // Initialize the board
  useEffect(() => {
    const d = outputDefs[0]
    nwManager.addNode(d, board.centerX, board.centerY)
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
    const { x: zoomedX, y: zoomedY } = calcGeoOnBoard(board, x, y, 0, 0)
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
        setNodeIdToGeoUpdate(id)
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
        const n = nwManager.getNode(id)
        n.inSockets[i].connected = false
        nwManager.updateNode(n)
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
  }, [board])

  const onSocketMouseUp = useCallback((
    id: string,
    dir: SocketDirection,
    i: number,
    x: number,
    y: number
  ) => {
    if (drawingWire === null || drawingWire.startNodeId === id || drawingWire.startDirection === dir) {
      setDrawingWire(null)
      return
    }
    const { x: zoomedX, y: zoomedY } = calcGeoOnBoard(board, x, y, 0, 0)
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
      const startNode = nwManager.getNode(drawingWire.startNodeId)
      startNode.inSockets[drawingWire.startSocketIndex].connected = true
      setNodeIdToGeoUpdate(drawingWire.startNodeId)
      nwManager.updateNode(startNode)
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
      const startNode = nwManager.getNode(id)
      startNode.inSockets[i].connected = true
      nwManager.updateNode(startNode)
      const existingWire = wires.find(w => w.outNodeId === id && w.outSocketIndex === i)
      setNodeIdToGeoUpdate(id)
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
  }, [board, drawingWire, setDrawingWire])

  const onNodeDragStart = useCallback((id: string, mouseX: number, mouseY: number) => {
    const nodes = nwManager.getNodes()
    const targetNode = nwManager.getNode(id)
    const mouseOnBoardX = mouseX - board.domX
    const mouseOnBoardY = mouseY - board.domY
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
    nwManager.updateNode(targetNode)
  }, [board])

  const onMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const mouseX = e.clientX - board.domX
    const mouseY = e.clientY - board.domY
    const { x: boardX, y: boardY } = calcGeoOnBoard(board, e.clientX, e.clientY, 0, 0)

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
      nodes.forEach(n => {
        if (!n.selected) {
          return
        }
        const lastNode = savedNodes[n.id]
        if (!lastNode) {
          return
        }
        const nx = lastNode.x + dMouseX / board.zoom
        const ny = lastNode.y + dMouseY / board.zoom
        n.x = nx
        n.y = ny

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
      nwManager.updateNodes([...nodes])
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
    if (drawingRect) {
      const { startX, startY } = drawingRect
      setDrawingRect({
        ...drawingRect,
        x: Math.min(startX, boardX),
        y: Math.min(startY, boardY),
        width: Math.abs(startX - boardX),
        height: Math.abs(startY - boardY),
      })
    }
  }, [board, drawingWire, draggingNode, draggingBoard, drawingRect])

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
    if (draggingBoard) {
      setDraggingBoard(null)
    }
    if (drawingRect) {
      const newNodes = nodes.map(n => {
        if (rectsManager.isOverlapped(n.id, drawingRect)) {
          n.selected = true
        } else {
          n.selected = false
        }
        return n
      })
      nwManager.updateNodes(newNodes)
      saveHistory()
      setDrawingRect(null)
    }
  }, [drawingRect, draggingNode, drawingWire, draggingBoard])

  const onMouseLeave = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    setDrawingWire(null)
    setDraggingNode(null)
    setDraggingBoard(null)
    setDrawingRect(null)
  }, [])

  const onMouseDown = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const mouseX = e.clientX - board.domX
    const mouseY = e.clientY - board.domY

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
      const { x, y } = calcGeoOnBoard(board, e.clientX, e.clientY, 0, 0)
      setDrawingRect({
        startX: x,
        startY: y,
        x: x,
        y: y,
        width: 0,
        height: 0,
      })
    }
  }, [board])

  // On a node is selected by the selector.
  const onNodeAdd = useCallback((typeId: string) => {
    const d = nodeDefinitions.find(d => d.id === typeId)
    if (!d) {
      throw new Error("No factory found for node type " + typeId)
    }
    nwManager.unselectAll()
    nwManager.addNode(d, board.centerX, board.centerY)
    saveHistory()
  }, [nodeDefinitions, nwManager, board.centerX, board.centerY])

  useEffect(() => {
    const keydownListener = (e: KeyboardEvent) => {
      if (e.code === "Delete" || e.code === "Backspace") {
        const removed = nwManager.removeSelected()
        if (removed) {
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
      if (e.code === "KeyD" && e.ctrlKey) {
        e.preventDefault()
        const duplicated = nwManager.duplicateSelected()
        if (duplicated) {
          saveHistory()
          notifyChange()
        }
      }
    }
    window.addEventListener("keydown", keydownListener)
    return () => {
      window.removeEventListener("keydown", keydownListener)
    }
  }, [svgRootRef.current])

  const onZoomSliderChange = useCallback((v: number) => {
    setBoard({
      ...board,
      zoom: v,
    })
  }, [board])

  // Initially set the board size.
  useEffect(() => {
    if (svgRootRef.current) {
      const rect = svgRootRef.current.getBoundingClientRect()
      setBoard({
        centerX: 0,
        centerY: 0,
        domX: rect.x,
        domY: rect.y,
        domHeight: rect.height,
        domWidth: rect.width,
        zoom: 1
      })
    }
  }, [svgRootRef.current])

  // window resize
  useEffect(() => {
    const resizeListener = () => {
      if (svgRootRef.current) {
        const rect = svgRootRef.current.getBoundingClientRect()
        setBoard({
          ...board,
          domX: rect.x,
          domY: rect.y,
          domHeight: rect.height,
          domWidth: rect.width,
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
      if (draggingBoard) {
        return
      }
      const s = Math.sign(e.deltaY)
      if ((s > 0 && board.zoom >= MIN_ZOOM) || (s < 0 && board.zoom <= MAX_ZOOM - ZOOM_STEP)) {
        const nextZoom = board.zoom - ZOOM_STEP * Math.sign(e.deltaY)
        setBoard({
          ...board,
          zoom: nextZoom
        })
      }
    }
    svgRootRef.current?.addEventListener("wheel", mouseWheelListener)
    return () => {
      svgRootRef.current?.removeEventListener("wheel", mouseWheelListener)
    }
  }, [board, draggingBoard])
  // Fires when socket value is changed in the node UI component.
  const onInSocketValueChangeInternal = useCallback((nodeId: string, index: number, value: NodeInputValue) => {
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

  const nodeGeoMap = useMemo(() => {
    return new Map<string, {
      id: string,
      nodeRect: DOMRect,
      inRects: (DOMRect | undefined)[]
      outRects: (DOMRect | undefined)[]
    }>()
  }, [])
  const onNodeGeometryUpdate = useCallback((g: { 
    id: string,
    nodeRect: DOMRect,
    // If socket is hidden, rect is undefined.
    inRects: (DOMRect | undefined)[]
    outRects: (DOMRect | undefined)[]
  }) => {
    nodeGeoMap.set(g.id, g)
    const nodeX = (g.nodeRect.x - board.domX - board.domWidth / 2) / board.zoom + board.centerX
    const nodeY = (g.nodeRect.y - board.domY - board.domHeight / 2) / board.zoom + board.centerY
    rectsManager.set(g.id, {
      x: nodeX,
      y: nodeY,
      width: g.nodeRect.width / board.zoom,
      height: g.nodeRect.height / board.zoom,
    })
    if (nodeIdToGeoUpdate === g.id) {
      const newWires = nwManager.getWires().map(w => {
        if (w.inNodeId === g.id) {
          const r = g.outRects[w.inSocketIndex]
          if (r) {
            const cx = r.x + r.width / 2
            const cy = r.y + r.height / 2
            const { x, y } = calcGeoOnBoard(board, cx, cy, 0, 0)
            w.inX = x
            w.inY = y
          }
        }
        if (w.outNodeId === g.id) {
          const r = g.inRects[w.outSocketIndex]
          if (r) {
            const cx = r.x + r.width / 2
            const cy = r.y + r.height / 2
            const { x, y } = calcGeoOnBoard(board, cx, cy, 0, 0)
            w.outX = x
            w.outY = y
          }
        }
        return w
      })
      setNodeIdToGeoUpdate(null)
      nwManager.updateWires(newWires)
    }
  }, [nodeIdToGeoUpdate, setNodeIdToGeoUpdate, board, nwManager])

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
        onMouseLeave={onMouseLeave}
      >
        <defs>
          <linearGradient id="wire-linear" x1="20%" y1="0%" x2="80%" y2="0%" spreadMethod="pad">
            <stop offset="0%"   stopColor="#ddd"/>
            <stop offset="100%" stopColor="#888"/>
          </linearGradient>
          <pattern id="board-background-pattern" viewBox="0 0 24 24" width={"0.02%"} height="0.02%">
            <g className={style.boardPattern} fill="#000000">
              <polygon points="0 18 6 18 12 12 12 18 18 18 12 24 0 24"/>
              <polygon points="24 18 24 24 18 24"/>
              <polygon points="24 0 18 6 12 6 18 0"/>
              <polygon points="12 0 12 6 0 18 0 12 6 6 0 0"/>
            </g>
          </pattern>
        </defs>
        <circle cx={0} cy={0} r={100000} fill="url(#board-background-pattern)" />
        {wires.map(w => (
          <WireLine key={w.id} x1={w.inX} y1={w.inY} x2={w.outX} y2={w.outY} valid={w.id !== invalidWireId}/>
        ))}
        {nodes.map((n) => (
          <NodeBlock
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
            onGeometryUpdate={onNodeGeometryUpdate}
          />
        ))}
        {drawingWire && (drawingWire.startDirection == "in" ? (
          <WireLine x1={drawingWire.movingX} y1={drawingWire.movingY} x2={drawingWire.startX} y2={drawingWire.startY} valid={true}/>
        ) : (
          <WireLine x1={drawingWire.startX} y1={drawingWire.startY} x2={drawingWire.movingX} y2={drawingWire.movingY} valid={true}/>
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
      <div className={style.nodeSelector}>
        <NodeSelector definitions={nodeDefinitions} onSelected={onNodeAdd} />
      </div>
      <div className={style.zoomSlider}>
        <Slider
          min={MIN_ZOOM}
          max={MAX_ZOOM}
          stepSize={ZOOM_STEP}
          labelStepSize={10}
          onChange={onZoomSliderChange}
          labelRenderer={(value: any) => `${(value * 100).toFixed()}%`}
          showTrackFill={false}
          value={board.zoom}
          vertical={true}
        />
      </div>
    </div>
  )
}