import {
  NodeColor, NodeInputType, NodeInputValue, cloneNodeInputValue, NodeDefinition,
} from "../../definitions/types"
import { NodeTypeId } from "../../definitions/NodeTypeId"

// Put commonly used types in this file.

export type NodeProps = {
  id: string,
  typeId: NodeTypeId,
  x: number,
  y: number,
  name: string,
  color: NodeColor,
  inSockets: InSocketProps[],
  outSockets: OutSocketProps[]
  selected: boolean,
  unique: boolean,
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

export type InSocketProps = {
  label: string,
  alternativeValueInputType?: NodeInputType,
  alternativeValue?: NodeInputValue,
  socketHidden?: boolean,
  hidden?: boolean
  connected: boolean,
}

export type OutSocketProps = {
  label: string,
}

export function createNodeProps(id: string, x: number, y: number, def: NodeDefinition): NodeProps {
  return {
    id,
    typeId: def.id,
    x,
    y,
    color: def.category.color,
    name: def.name,
    selected: true,
    inSockets: def.inSockets.map((s) => {
      const { alternativeValue, alternativeValueInputType } = s
      const value = {
        label: s.label,
        socketHidden: s.socketHidden,
        hidden: s.hidden,
      } as InSocketProps
      if (alternativeValue && alternativeValueInputType) {
        value.alternativeValueInputType = alternativeValueInputType
        value.alternativeValue = cloneNodeInputValue(alternativeValue)
      }
      return value
    }),
    outSockets: def.outSockets.map((s) => ({ ...s })),
    deletable: def.deletable !== false,
    unique: def.unique || false,
  }
}

export function cloneNodeProps(node: NodeProps) {
  const inSockets = node.inSockets.map((s) => cloneInSocketProps(s))
  const outSockets = node.outSockets.map((s) => cloneOutSocketProps(s))
  const newNode = { ...node, outSockets, inSockets }
  return newNode
}

export function cloneInSocketProps(inSocket: InSocketProps): InSocketProps {
  return {
    ...inSocket,
    alternativeValue: inSocket.alternativeValue ? cloneNodeInputValue(inSocket.alternativeValue) : undefined,
  }
}

export function cloneOutSocketProps(outSocket: OutSocketProps): OutSocketProps {
  return {
    ...outSocket,
  }
}

export function cloneWireProps(w: WireProps) {
  return {
    ...w,
  }
}
