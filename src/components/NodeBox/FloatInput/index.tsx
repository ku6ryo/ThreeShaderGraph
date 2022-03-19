import { useCallback, memo } from "react"
import { InNodeInputValue } from ".."
import { FloatInputBase } from "../FloatInputBase"

type Props = {
  label?: string
  index: number,
  value: InNodeInputValue,
  onChange: (index: number, value: InNodeInputValue) => void
}

export const FloatInput = memo(function ({
  label,
  index,
  value,
  onChange,
}: Props) {
  if (value.float === undefined) {
    throw new Error("value.float is undefined")
  }
  const onChangeInternal = useCallback((value: number) => {
    onChange(index, {
      float: value,
    })
  }, [onChange])
  return (
    <FloatInputBase label={label} value={value.float} onChange={onChangeInternal} />
  )
})