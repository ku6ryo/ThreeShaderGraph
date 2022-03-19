import { InSocket, OutSocket, SocketDirection, NodeColor, InNodeInputType, InNodeInputValue } from "../NodeBox";

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