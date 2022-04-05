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
  onNodeResize: (id: string, rect: DOMRect) => void,
  onSocketRender: (id: string, direction: SocketDirection, i: number, x: number, y: number) => void,
  onGeometryUpdate: (g: {
    id: string,
    nodeRect: DOMRect,
    // If socket is hidden, rect is undefined.
    inRects: (DOMRect | undefined)[]
    outRects: (DOMRect | undefined)[]
  }) => void
}

export const NodeBox = memo(function NodeBox({
  id,
  name,
  color,
  x,
  y,
  inSockets,
  outSockets,
  onSocketMouseUp,
  onSocketMouseDown,
  selected,
  onDragStart,
  onInSocketValueChange,
  onNodeResize,
  onSocketRender,
  onGeometryUpdate,
}: Props) {
  const frameRef = useRef<SVGForeignObjectElement | null>(null)
  const boxRef = useRef<HTMLDivElement | null>(null)
  const socketRectMap = useMemo(() => {
    return new Map<string, DOMRect>()
  }, [])

  const onSocketMouseUpInternal = useCallback((dir: SocketDirection, index: number, x: number, y: number) => {
    if (!frameRef.current) {
      return
    }
    const rect = frameRef.current.getBoundingClientRect()
    const socketX = x - rect.x
    const socketY = y - rect.y
    onSocketMouseUp(id, dir, index, socketX, socketY)
  }, [id, x, y, onSocketMouseUp, frameRef.current])

  const onSocketMouseDownInternal = useCallback((dir: SocketDirection, index: number, x: number, y: number) => {
    if (!frameRef.current) {
      return
    }
    const rect = frameRef.current.getBoundingClientRect()
    const socketX = x - rect.x
    const socketY = y - rect.y
    onSocketMouseDown(id, dir, index, socketX, socketY)
  }, [id, x, y, onSocketMouseDown, frameRef.current])

  const onBoxMouseDown: MouseEventHandler<HTMLDivElement> = useCallback((e) => {
    if (e.button === 0) {
      e.stopPropagation()
      onDragStart(id, e.clientX, e.clientY)
    }
  }, [id, onDragStart])

  const onSocketValueChange = useCallback((dir: SocketDirection, index: number, value: NodeInputValue) => {
    onInSocketValueChange(id, index, value)
  }, [id, onInSocketValueChange])

  const onSocketRenderInternal = useCallback((dir: SocketDirection, index: number, rect: DOMRect) => {
    socketRectMap.set(`${dir}-${index}`, rect)
  }, [id, onSocketRender])

  useEffect(() => {
    console.log("node render")
    if (boxRef.current) {
      onNodeResize(id, boxRef.current.getBoundingClientRect())
      const inRects = inSockets.map((_, i) => {
        return socketRectMap.get(`in-${i}`)
      })
      const outRects = outSockets.map((_, i) => {
        return socketRectMap.get(`out-${i}`)
      })
      onGeometryUpdate({
        id,
        nodeRect: boxRef.current.getBoundingClientRect(),
        inRects,
        outRects,
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
                  selected={selected}
                  label={socket.label}
                  direction="out"
                  index={i}
                  onSocketMouseDown={onSocketMouseDownInternal}
                  onSocketMouseUp={onSocketMouseUpInternal}
                  onSocketValueChange={onSocketValueChange}
                  socketHidden={false}
                  onRender={onSocketRenderInternal}
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
                  selected={selected}
                  label={socket.label}
                  alternativeValueInputHidden={socket.connected}
                  alternativeValue={socket.alternativeValue}
                  alternativeValueInputType={socket.alternativeValueInputType}
                  direction="in"
                  index={i}
                  onSocketMouseDown={onSocketMouseDownInternal}
                  onSocketMouseUp={onSocketMouseUpInternal}
                  onSocketValueChange={onSocketValueChange}
                  socketHidden={socket.socketHidden || false}
                  onRender={onSocketRenderInternal}
                />
              )
            })}
          </div>
        </div>
      </foreignObject>
    </g>
  )
})