import { useMemo, memo } from "react"
import style from "./style.module.scss"

type Props = {
  x1: number,
  y1: number,
  x2: number,
  y2: number,
}

export const WireLine = memo(function WireLine({
  x1,
  y1,
  x2,
  y2,
}: Props) {
  const d = Math.abs(x2 - x1) / 3
  const path = useMemo(() => {
    if (x1 === x2 || y1 === y2) {
      return `M ${x1} ${y1} L ${x2 + 0.1} ${y2 + 0.1}`
    } else {
      return `M ${x1} ${y1}, C ${x1 + d} ${y1}, ${x2 - d} ${y2}, ${x2} ${y2}`
    }
  }, [x1, y1, x2, y2])
  return (
    <path
      className={style.wire}
      d={path} stroke="url(#wire-linear)" strokeWidth={2.5} fill="transparent"
      strokeLinecap="round"
    />
  )
})