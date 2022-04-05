import { useCallback, memo } from "react"
import { NodeInputValue } from "../../../../definitions/types"
import { FloatInputBase } from "../FloatInputBase"

type Props = {
  value: NodeInputValue,
  onChange: (value: NodeInputValue) => void
}

export const FloatInput = memo(function ({
  value,
  onChange,
}: Props) {
  if (value.float === undefined) {
    throw new Error("value.float is undefined")
  }
  const onChangeInternal = useCallback((value: number) => {
    onChange({
      float: value,
    })
  }, [onChange])
  return (
    <FloatInputBase value={value.float} onChange={onChangeInternal} />
  )
})