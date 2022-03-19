import { MouseEventHandler, MouseEvent, useRef, useState, memo, useCallback, ChangeEventHandler, KeyboardEventHandler, useEffect } from "react"
import style from "./style.module.scss"
import classnames from "classnames"
import { FloatInput } from "./FloatInput"
import { Vector2, Vector3, Vector4 } from "three"

export type SocketDirection = "in" | "out"

export enum NodeColor {
  Orange = "orange",
  Blue = "blue",
  Red = "red",
  Green = "green",
  Pink = "pink",
  Purple = "purple",
}

export enum InNodeInputType {
  Float = "float",
  Image = "image",
  Vector2 = "vetor2",
  Vector3 = "vetor3",
  Vector4 = "vetor4",
}

export type InNodeInputValue = {
  float?: number,
  vec2?: Vector2,
  vec3?: Vector3,
  vec4?: Vector4,
  image?: HTMLImageElement,
}

export type InSocket = {
  label: string,
  dataTypes: number[]
  alternativeValueInputType?: InNodeInputType,
  alternativeValue?: InNodeInputValue,
}

export type OutSocket = {
  label: string,
}

function extractInfoFromCircle(e: MouseEvent<HTMLElement>, frame: SVGForeignObjectElement) {
  const circle = e.currentTarget
  const circleRect = circle.getBoundingClientRect()
  const frameRect = frame.getBoundingClientRect()
  const fx = frameRect.x
  const fy = frameRect.y
  const i = Number(circle.dataset.socketIndex)
  const dir = circle.dataset.socketDirection as SocketDirection
  const cx = circleRect.x + circleRect.width / 2
  const cy = circleRect.y + circleRect.height / 2
  const x = cx - fx
  const y = cy - fy
  return {
    i,
    dir: dir as SocketDirection,
    // releative to frame and not considering zoom.
    socketX: x,
    socketY: y,
  }
}

type Props = {
  id: string,
  color: NodeColor,
  name: string,
  x: number,
  y: number,
  inSockets: InSocket[],
  outSockets: OutSocket[],
  selected: boolean,
  onSocketMouseUp: (id: string, direction: SocketDirection, i: number, x: number, y: number) => void,
  onSocketMouseDown: (id: string, direction: SocketDirection, i: number, x: number, y: number) => void,
  onDragStart: (id: string, x: number, y: number) => void,
  onInSocketValueChange: (id: string, i: number, value: InNodeInputValue) => void,
  onNodeResize: (id: string, rect: DOMRect) => void,
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
}: Props) {
  const imageInputRef = useRef<HTMLInputElement | null>(null)
  const [imageValue, setImageValue] = useState<HTMLImageElement | null>(null)
  const frameRef = useRef<SVGForeignObjectElement | null>(null)
  const boxRef = useRef<HTMLDivElement | null>(null)

  const onSocketMouseUpInternal: MouseEventHandler<HTMLDivElement> = useCallback((e) => {
    if (!frameRef.current) {
      return
    }
    e.stopPropagation()
    const { i, dir, socketX, socketY } = extractInfoFromCircle(e, frameRef.current)
    onSocketMouseUp(id, dir, i, socketX, socketY)
  }, [id, x, y, onSocketMouseUp, frameRef.current])

  const onSocketMouseDownInternal: MouseEventHandler<HTMLDivElement> = useCallback((e) => {
    if (!frameRef.current) {
      return
    }
    e.stopPropagation()
    const { i, dir, socketX, socketY } = extractInfoFromCircle(e, frameRef.current)
    onSocketMouseDown(id, dir, i, socketX, socketY)
  }, [id, x, y, onSocketMouseDown, frameRef.current])

  const onBoxMouseDown: MouseEventHandler<HTMLDivElement> = useCallback((e) => {
    if (e.button === 0) {
      e.stopPropagation()
      onDragStart(id, e.clientX, e.clientY)
    }
  }, [id, onDragStart])

  const onSocketValueChange = useCallback((index: number, value: InNodeInputValue) => {
    onInSocketValueChange(id, index, value)
  }, [id, onInSocketValueChange])

  useEffect(() => {
    if (boxRef.current) {
      onNodeResize(id, boxRef.current.getBoundingClientRect())
    }
  }, [boxRef.current])
  return (
    <g
      transform={`translate(${x}, ${y})`}
    >
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
          <div className={style.outputs}>
            {outSockets.map((socket, i) => (
              <div
                className={style.row}
                key={i}
              >
                <div>{socket.label}</div>
                <div
                  className={style.socket}
                  data-socket-index={i}
                  data-socket-direction="out"
                  onMouseDown={onSocketMouseDownInternal}
                  onMouseUp={onSocketMouseUpInternal}
                />
              </div>
            ))}
          </div>
          <div className={style.inputs}>
            {inSockets.map((socket, i) => (
              <div
                className={style.row}
                key={i}
              >
                <div
                  className={style.socket}
                  data-socket-index={i}
                  data-socket-direction="in"
                  onMouseDown={onSocketMouseDownInternal}
                  onMouseUp={onSocketMouseUpInternal}
                />
                <div>{socket.label}</div>
                {socket.alternativeValue && socket.alternativeValueInputType && (
                  <div className={style.inputContainer}>
                    {socket.alternativeValueInputType === InNodeInputType.Float && (
                      <FloatInput index={i} onChange={onSocketValueChange} value={socket.alternativeValue} />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </foreignObject>
    </g>
  )
})