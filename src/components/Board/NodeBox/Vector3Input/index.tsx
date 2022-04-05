import { useCallback, memo } from "react"
import { Vector3 } from "three"
import { NodeInputValue } from "../../../../definitions/types"
import { FloatInputBase } from "../FloatInputBase"

type Props = {
  value: NodeInputValue,
  onChange: (value: NodeInputValue) => void
}

export const Vector3Input = memo(function ({
  value,
  onChange,
}: Props) {
  if (value.vec3 === undefined) {
    throw new Error("value.vec3 is undefined")
  }
  const onChangeInternal = useCallback((part: "x" | "y" | "z", f: number) => {
    const v = (() => {
      if (value.vec3 === undefined) {
        throw new Error("value.vec3 is undefined")
      }
      switch (part) {
        case "x":
          return new Vector3(f, value.vec3.y, value.vec3.z)
        case "y":
          return new Vector3(value.vec3.x, f, value.vec3.z)
        case "z":
          return new Vector3(value.vec3.x, value.vec3.y, f)
        default:
          throw new Error("unreachable")
      }
    })()
    onChange({
      vec3: v,
    })
  }, [onChange, value])
  return (
    <div>
      <FloatInputBase value={value.vec3.x}
        onChange={
          (v) => {
            onChangeInternal("x", v)
          }
        }
      />
      <FloatInputBase value={value.vec3.y}
        onChange={
          (v) => {
            onChangeInternal("y", v)
          }
        }
      />
      <FloatInputBase value={value.vec3.z}
        onChange={
          (v) => {
            onChangeInternal("z", v)
          }
        }
      />
    </div>
  )
})