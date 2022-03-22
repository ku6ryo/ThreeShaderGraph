import { NodeCategory } from "../../definitions/types"
import { InSocket, OutSocket, NodeColor } from "../NodeBox"

// Put commonly used types in this file.

export type NodeProps = {
  id: string,
  typeId: string,
  x: number,
  y: number,
  name: string,
  color: NodeColor,
  inSockets: InSocket[],
  outSockets: OutSocket[]
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

export type NodeBlueprint = {
  color: NodeColor,
  inSockets: InSocket[],
  outSockets: OutSocket[],
  deletable?: boolean,
}

export type NodeFactory = {
  id: string,
  name: string
  category: NodeCategory,
  factory: () => NodeBlueprint
}
