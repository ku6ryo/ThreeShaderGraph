import { useEffect, useMemo, useRef } from "react"
import { ShaderGraph } from "../../backend/ShaderGraph";
import { ShaderPreview } from "./ShaderPreview";
import style from "./style.module.scss"

type Props = {
  graph: ShaderGraph | null
}

export function Preview({
  graph,
}: Props) {
  console.log("render preview")
  const frameRef = useRef<HTMLDivElement>(null)
  const preview = useMemo(() => {
    return new ShaderPreview()
  }, [])
  useEffect(() => {
    if (frameRef.current) {
      frameRef.current.appendChild(preview.getCanvas())
    }
  }, [frameRef.current])
  useEffect(() => {
    if (graph) {
      preview.update(graph)
    }
  }, [graph])
  return (
    <div
      ref={frameRef}
      className={style.frame}
    >
    </div>
  )
}