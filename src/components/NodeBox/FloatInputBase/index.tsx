import { useCallback, useMemo, useState } from "react"
import style from "./style.module.scss"
import {
  MdKeyboardArrowRight as RightArrowIcon,
  MdKeyboardArrowLeft as LeftArrowIcon
} from "react-icons/md"
import classNames from "classnames"


type Props = {
  label?: string
  value: number,
  onChange: (value: number) => void
}

export function FloatInputBase({
  label,
  value,
  onChange,
}: Props) {
  const [typing, setTyping] = useState(false)
  const [operatingGuage, setOperatingGuage] = useState(false)
  const onArrowClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    const v = Number(e.currentTarget.dataset.value)
    onChange(value + v)
  }, [value])
  const valueStr = useMemo(() => {
    return value.toFixed(3)
  }, [value])
  const onMouseDownGuage = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    setOperatingGuage(true)
  }, [])
  const onMouseUpGuage = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    setOperatingGuage(false)
  }, [])
  const onMouseMoveGuage = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    if (operatingGuage && e.button === 0) {
      onChange(value + Math.sign(e.movementX) * 0.1)
    }
  }, [value, operatingGuage])
  const onMouseLeaveGuage = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setOperatingGuage(false)
  }, [])
  const onInputBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    setTyping(false)
  }, [])
  const onMouseWheelGuage = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    e.stopPropagation()
    onChange(value - Math.sign(e.deltaY) * 0.1)
  }, [value])
  return (
    <div className={style.frame}>
      {!typing && (
        <div
          className={style.guage}
          onMouseMove={onMouseMoveGuage}
          onMouseLeave={onMouseLeaveGuage}
          onMouseUp={onMouseUpGuage}
          onMouseDown={e => e.stopPropagation()}
        >
          <div
            className={classNames(style.arrow, style.left)}
            data-value={-0.1}
            onClick={onArrowClick}
          >
            <LeftArrowIcon />
          </div>
          <div
            className={style.text}
            onMouseDown={onMouseDownGuage}
            onWheel={onMouseWheelGuage}
          >
            <span>{label}</span>
            <span>{valueStr}</span>
          </div>
          <div
            className={classNames(style.arrow, style.right)}
            data-value={0.1}
            onClick={onArrowClick}
          >
            <RightArrowIcon />
          </div>
        </div>
      )}
      {typing && (
        <div>
          <input value={value} onBlur={onInputBlur}/>
        </div>
      )}
    </div>
  )
}