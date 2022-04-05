import { useCallback, memo, useState, MouseEventHandler, useEffect } from "react"
import { NodeInputValue } from "../../../../definitions/types"
import style from "./style.module.scss"
import { ChromePicker, ColorChangeHandler } from "react-color"
import { Vector4 } from "three"

type Props = {
  value: NodeInputValue,
  onChange: (value: NodeInputValue) => void
}

export const ColorInput = memo(function ({
  value,
  onChange,
}: Props) {
  const [showInput, setShowInput] = useState(false)
  useEffect(() => {
    const listener = () => {
      setShowInput(false)
    }
    window.addEventListener("mousedown", listener)
    return () => window.removeEventListener("mousedown", listener)
  }, [])
  if (value.vec4 === undefined) {
    throw new Error("value.ve4 is undefined")
  }
  const onColorPickerChange: ColorChangeHandler = useCallback((color) => {
    const { rgb } = color
    const { r, g, b, a } = rgb
    onChange({
      vec4: new Vector4(r / 255, g / 255, b / 255, a || 0),
    })
  }, [onChange])
  const onMouseDown: MouseEventHandler<HTMLDivElement> = useCallback((e) => {
    e.stopPropagation()
  }, [])
  const onClick: MouseEventHandler<HTMLDivElement> = useCallback((e) => {
    if (showInput) {
      setShowInput(false)
    } else {
      setShowInput(true)
    }
  }, [setShowInput, showInput])
  const { x, y, z, w } = value.vec4
  return (
    <div className={style.frame}
      onMouseDown={onMouseDown}
    >
      <div
        className={style.colorBar}
        onClick={onClick}
      >
        <div
          className={style.background}
        />
        <div
          className={style.color}
          style={{
            backgroundColor: `rgba(${x * 255}, ${y * 255}, ${z * 255}, ${w})`,
          }}
        />
      </div>
      {showInput && (
        <div className={style.picker}>
          <ChromePicker
            onChange={onColorPickerChange}
            color={{
              r: x * 255,
              g: y * 255,
              b: z * 255,
              a: w
            }}
          />
        </div>
      )}
    </div>
  )
})