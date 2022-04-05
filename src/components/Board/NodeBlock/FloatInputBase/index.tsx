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
const MAX_DECIMAL_PLACES = 5
const MAX_VALUE = Math.pow(10, 10)
const MIN_VALUE = -Math.pow(10, 10)

type Props = {
  value: number,
  onChange: (value: number) => void
}

export function FloatInputBase({
  value,
  onChange,
}: Props) {
  const [typing, setTyping] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [textValue, setTextValue] = useState("")

  const emitOnChange = useCallback((v: number) => {
    if (v > MAX_VALUE) {
      onChange(MAX_VALUE)
      return
    }
    if (v < MIN_VALUE) {
      onChange(MIN_VALUE)
      return
    }
    onChange(Number(v.toFixed(MAX_DECIMAL_PLACES)))
  }, [onChange])

  const onArrowClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    const v = Number(e.currentTarget.dataset.value)
    emitOnChange(value + v)
  }, [value, emitOnChange])

  const displayValue = useMemo(() => {
    return value.toFixed(MAX_DECIMAL_PLACES)
  }, [value])

  const onNumberClick: MouseEventHandler<HTMLDivElement> = useCallback((e) => {
    setTyping(true)
    if (inputRef.current) {
      inputRef.current.focus()
      setTextValue(value.toFixed(5).replace(/\.?0+$/, ""))
    }
  }, [setTyping, inputRef.current, value, setTextValue])

  const onTextInputComplete = useCallback(() => {
    setTyping(false)
    const v = Number(textValue)
    if (isNaN(v)) {
      return
    }
    emitOnChange(v)
  }, [textValue, emitOnChange])

  const onTextInputChange: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    setTextValue(e.currentTarget.value)
  }, [setTextValue])

  const onInputBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    onTextInputComplete()
  }, [onTextInputComplete])

  const onInputKeyDown: KeyboardEventHandler<HTMLInputElement> = useCallback((e) => {
    e.stopPropagation()
    if (e.code === "Enter") {
      onTextInputComplete()
    }
  }, [onTextInputComplete])
  const onInputMouseDown: MouseEventHandler<HTMLInputElement> = useCallback((e) => {
    e.stopPropagation()
  }, [])

  return (
    <div className={style.frame}>
      {!typing && (
        <div
          className={style.guage}
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
            onClick={onNumberClick}
          >
            <span>{displayValue}</span>
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
          value={textValue}
          onBlur={onInputBlur}
          ref={inputRef}
          onMouseDown={onInputMouseDown}
          onKeyDown={onInputKeyDown}
          onChange={onTextInputChange}
        />
      </div>
    </div>
  )
}