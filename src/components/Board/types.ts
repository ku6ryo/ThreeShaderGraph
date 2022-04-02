import { InSocketProps, OutSocketProps } from "../NodeBox"
import { NodeColor } from "../../definitions/types"

// Put commonly used types in this file.

export type NodeProps = {
  id: string,
  typeId: string,
  x: number,
  y: number,
  name: string,
  color: NodeColor,
  inSockets: InSocketProps[],
  outSockets: OutSocketProps[]
  selected: boolean,
  deletable: boolean,
}

export type WireProps = {
  id: string,
  inNodeId: string,
  outNodeId: string,
  inSocketIndex: number,
  outSocketIndex: number,
  inX: number,
  inY: number,
  outX: number,
  outY: number,
}
