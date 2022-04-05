import {
  MouseEventHandler,
  useCallback,
  useMemo,
  useRef,
  useState,
  KeyboardEventHandler,
  ChangeEventHandler
 } from "react"
import style from "./style.module.scss"
import {
  MdKeyboardArrowRight as RightArrowIcon,
  MdKeyboardArrowLeft as LeftArrowIcon
} from "react-icons/md"
import classNames from "classnames"

const DELTA = 0.01

type Props = {
  value: number,
  onChange: (value: number) => void
}

export function FloatInputBase({
  value,
  onChange,
}: Props) {
  const [typing, setTyping] = useState(false)
  const [operatingGuage, setOperatingGuage] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const onArrowClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    const v = Number(e.currentTarget.dataset.value)
    onChange(value + v)
  }, [value, onChange])
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
      onChange(value + Math.sign(e.movementX) * DELTA)
    }
  }, [value, operatingGuage, onChange])
  const onMouseLeaveGuage = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setOperatingGuage(false)
  }, [])
  const onInputBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    setTyping(false)
  }, [])
  const onMouseWheelGuage = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    e.stopPropagation()
    onChange(value - Math.sign(e.deltaY) * DELTA)
  }, [value, onChange])
  const onNumberClick: MouseEventHandler<HTMLDivElement> = useCallback((e) => {
    setTyping(true)
    if (inputRef.current) {
      console.log(inputRef.current)
      inputRef.current.focus()
    }
  }, [setTyping, inputRef.current])

  const onInputChange: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    onChange(Number(e.currentTarget.value))
  }, [onChange])

  const onInputKeyDown: KeyboardEventHandler<HTMLInputElement> = useCallback((e) => {
    e.stopPropagation()
    if (e.code === "Enter") {
      setTyping(false)
    }
  }, [])

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
            data-value={- DELTA}
            onClick={onArrowClick}
          >
            <LeftArrowIcon />
          </div>
          <div
            className={style.text}
            onMouseDown={onMouseDownGuage}
            onWheel={onMouseWheelGuage}
            onClick={onNumberClick}
          >
            <span>{valueStr}</span>
          </div>
          <div
            className={classNames(style.arrow, style.right)}
            data-value={DELTA}
            onClick={onArrowClick}
          >
            <RightArrowIcon />
          </div>
        </div>
      )}
      <div
        className={style.inputContainer}
        style={{
          height: typing ? "initial" : "0"
        }}
      >
        <input
          className={style.input}
          value={value}
          onBlur={onInputBlur}
          type="number"
          ref={inputRef}
          onKeyDown={onInputKeyDown}
          onChange={onInputChange}
        />
      </div>
    </div>
  )
}