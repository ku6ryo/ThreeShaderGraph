import { useCallback, memo } from "react"
import { Vector3 } from "three"
import { InNodeInputValue } from ".."
import { FloatInputBase } from "../FloatInputBase"

type Props = {
  label?: string
  index: number,
  value: InNodeInputValue,
  onChange: (index: number, value: InNodeInputValue) => void
}

export const Vector3Input = memo(function ({
  label,
  index,
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
    onChange(index, {
      vec3: v,
    })
  }, [onChange, value])
  return (
    <div>
      <FloatInputBase label={label} value={value.vec3.x}
        onChange={
          (v) => {
            onChangeInternal("x", v)
          }
        }
      />
      <FloatInputBase label={label} value={value.vec3.y}
        onChange={
          (v) => {
            onChangeInternal("y", v)
          }
        }
      />
      <FloatInputBase label={label} value={value.vec3.z}
        onChange={
          (v) => {
            onChangeInternal("z", v)
          }
        }
      />
    </div>
  )
})