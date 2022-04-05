import { memo, MouseEvent, useRef, MouseEventHandler, useCallback, useEffect } from "react"
import { NodeInputType, NodeInputValue } from "../../../../definitions/types"
import style from "./style.module.scss"
import { FloatInput } from "../FloatInput"
import { ImageInput } from "../ImageInput"
import { ColorInput } from "../ColorInput"
import { Vector3Input } from "../Vector3Input"
import { SocketDirection } from "../types"
import classnames from "classnames"

type Props = {
  selected: boolean,
  direction: "in" | "out",
  index: number,
  label: string,
  socketHidden: boolean,
  valueInputHidden?: boolean,
  valueInputType?: NodeInputType,
  value?: NodeInputValue,
  onSocketValueChange?: (direction: SocketDirection, index: number, value: NodeInputValue) => void,
  onSocketMouseUp: (direction: SocketDirection, index: number, x: number, y: number) => void,
  onSocketMouseDown: (direction: SocketDirection, index: number, x: number, y: number) => void,
  onRender: (direction: SocketDirection, index: number, rect: DOMRect) => void,
}


function extractInfoFromCircle(e: MouseEvent<HTMLElement>) {
  const circle = e.currentTarget
  const circleRect = circle.getBoundingClientRect()
  const x = circleRect.x + circleRect.width / 2
  const y = circleRect.y + circleRect.height / 2
  return {
    // global position in browser.
    x,
    y,
  }
}

export const SocketRow = memo(function ({
  selected,
  direction,
  index,
  label,
  socketHidden,
  valueInputHidden,
  valueInputType,
  value,
  onSocketValueChange,
  onSocketMouseDown,
  onSocketMouseUp,
  onRender,
}: Props) {

  const circleRef = useRef<HTMLDivElement | null>(null)

  const onSocketMouseUpInternal: MouseEventHandler<HTMLDivElement> = useCallback((e) => {
    if (e.button !== 0) {
      return
    }
    e.stopPropagation()
    const { x, y } = extractInfoFromCircle(e)
    onSocketMouseUp(direction, index, x, y)
  }, [direction, index, onSocketMouseUp])

  const onSocketMouseDownInternal: MouseEventHandler<HTMLDivElement> = useCallback((e) => {
    if (e.button !== 0) {
      return
    }
    e.stopPropagation()
    const { x, y } = extractInfoFromCircle(e)
    onSocketMouseDown(direction, index, x, y)
  }, [direction, index, onSocketMouseDown])

  const onValueChange = useCallback((value: NodeInputValue) => {
    if (onSocketValueChange) {
      onSocketValueChange(direction, index, value)
    }
  }, [index, direction, onSocketValueChange])

  useEffect(() => {
    if (circleRef.current) {
      onRender(direction, index, circleRef.current.getBoundingClientRect())
    }
  })

  return (
    <div
      className={classnames({
        [style.frame]: true,
        [style.selected]: selected,
        [style[direction]]: true,
      })}
    >
      {!socketHidden && (
        <div
          className={style.socket}
          onMouseDown={onSocketMouseDownInternal}
          onMouseUp={onSocketMouseUpInternal}
          ref={circleRef}
        >
          <div className={style.circle} />
        </div>
      )}
      <div className={style.label}>{label}</div>
      {!valueInputHidden && value && valueInputType && (
        <div className={style.inputContainer}>
          {valueInputType === NodeInputType.Float && (
            <FloatInput onChange={onValueChange} value={value} />
          )}
          {valueInputType === NodeInputType.Image && (
            <ImageInput onChange={onValueChange} value={value} />
          )}
          {valueInputType === NodeInputType.Color && (
            <ColorInput onChange={onValueChange} value={value} />
          )}
          {valueInputType === NodeInputType.Vector3 && (
            <Vector3Input onChange={onValueChange} value={value} />
          )}
        </div>
      )}
    </div>
  )
})