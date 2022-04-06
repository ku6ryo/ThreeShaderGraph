import { MouseEventHandler, useRef, memo, useCallback, useEffect, useMemo } from "react"
import style from "./style.module.scss"
import classnames from "classnames"
import { NodeInputValue, NodeColor } from "../../../definitions/types"
import { InSocketProps, OutSocketProps } from "../types"
import { SocketDirection } from "./types"
import { SocketRow } from "./SocketRow"

type Props = {
  id: string,
  color: NodeColor,
  name: string,
  x: number,
  y: number,
  inSockets: InSocketProps[],
  outSockets: OutSocketProps[],
  selected: boolean,
  onSocketMouseUp: (id: string, direction: SocketDirection, i: number, x: number, y: number) => void,
  onSocketMouseDown: (id: string, direction: SocketDirection, i: number, x: number, y: number) => void,
  onDragStart: (id: string, x: number, y: number) => void,
  onInSocketValueChange: (id: string, i: number, value: NodeInputValue) => void,
  onGeometryUpdate: (g: {
    id: string,
    nodeRect: DOMRect,
    // If socket is hidden, rect is undefined.
    inRects: (DOMRect | undefined)[]
    outRects: (DOMRect | undefined)[]
  }) => void
}

export const NodeBlock = memo(function ({
  id,
  name,
  color,
  x,
  y,
  inSockets,
  outSockets,
  selected,
  onSocketMouseUp,
  onSocketMouseDown,
  onDragStart,
  onInSocketValueChange,
  onGeometryUpdate,
}: Props) {
  const frameRef = useRef<SVGForeignObjectElement | null>(null)
  const boxRef = useRef<HTMLDivElement | null>(null)
  const inSocketRects: DOMRect[] = useMemo(() => {
    return []
  }, [])
  const outSocketRects: DOMRect[] = useMemo(() => {
    return []
  }, [])

  const onSocketMouseUpInternal = useCallback((dir: SocketDirection, index: number, x: number, y: number) => {
    onSocketMouseUp(id, dir, index, x, y)
  }, [id, x, y, onSocketMouseUp, frameRef.current])

  const onSocketMouseDownInternal = useCallback((dir: SocketDirection, index: number, x: number, y: number) => {
    onSocketMouseDown(id, dir, index, x, y)
  }, [id, x, y, onSocketMouseDown, frameRef.current])

  const onBoxMouseDown: MouseEventHandler<HTMLDivElement> = useCallback((e) => {
    if (e.button === 0) {
      e.stopPropagation()
      onDragStart(id, e.clientX, e.clientY)
    }
  }, [id, onDragStart])

  // Currently only input sockets have value input UI.
  const onSocketValueChange = useCallback((_: SocketDirection, index: number, value: NodeInputValue) => {
    onInSocketValueChange(id, index, value)
  }, [id, onInSocketValueChange])

  const onSocketRender = useCallback((dir: SocketDirection, index: number, rect: DOMRect) => {
    if (dir === "in") {
      inSocketRects[index] = rect
    }
    if (dir === "out") {
      outSocketRects[index] = rect
    }
  }, [])

  useEffect(() => {
    if (boxRef.current) {
      onGeometryUpdate({
        id,
        nodeRect: boxRef.current.getBoundingClientRect(),
        inRects: inSocketRects,
        outRects: outSocketRects,
      })
    }
  })

  return (
    <g transform={`translate(${x}, ${y})`}>
      <foreignObject
        ref={frameRef}
        width={1}
        height={1}
        className={classnames({
          [style.frame]: true,
          [style.selected]: selected,
        })}
      >
        <div
          className={style.box}
          onMouseDown={onBoxMouseDown}
          ref={boxRef}
        >
          <div className={
            classnames({
              [style.name]: true,
              [style[color]]: true
            })
          }>{name}</div>
          {outSockets.length > 0 && (
            <div className={style.outputs}>
              {outSockets.map((socket, i) => (
                <SocketRow
                  key={`out-${i}`}
                  label={socket.label}
                  direction="out"
                  index={i}
                  selected={selected}
                  onSocketMouseDown={onSocketMouseDownInternal}
                  onSocketMouseUp={onSocketMouseUpInternal}
                  onSocketValueChange={onSocketValueChange}
                  socketHidden={false}
                  onRender={onSocketRender}
                />
              ))}
            </div>
          )}
          <div className={style.inputs}>
            {inSockets.map((socket, i) => {
              if (socket.hidden) {
                return
              }
              return (
                <SocketRow
                  key={`out-${i}`}
                  label={socket.label}
                  direction="in"
                  index={i}
                  selected={selected}
                  valueInputHidden={socket.connected}
                  value={socket.alternativeValue}
                  valueInputType={socket.alternativeValueInputType}
                  onSocketMouseDown={onSocketMouseDownInternal}
                  onSocketMouseUp={onSocketMouseUpInternal}
                  onSocketValueChange={onSocketValueChange}
                  socketHidden={socket.socketHidden || false}
                  onRender={onSocketRender}
                />
              )
            })}
          </div>
        </div>
      </foreignObject>
    </g>
  )
})