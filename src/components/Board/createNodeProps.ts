import { cloneNodeInputValue, NodeDefinition } from "../../definitions/types"
import { InSocketProps } from "../NodeBox"
import { NodeProps } from "./types"

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
    deletable: def.deletable || false,
  }
}
