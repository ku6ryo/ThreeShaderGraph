import { NodeTypeId } from "./NodeTypeId"
import { InNodeInputType, NodeColor } from "../components/NodeBox"
import { Vector4 } from "three"
import { NodeCategory } from "./types"
import { NodeBlueprint } from "../components/Board/types"

export const outputCategory: NodeCategory = {
  id: "output",
  label: "Output",
  icon: "arrow-right",
}

export const outputFactories = [{
  id: NodeTypeId.OutputColor,
  name: "Fragment Color",
  category: outputCategory,
  factory: () => {
    return {
      color: NodeColor.Pink,
      inNodeInputSlots: [],
      inSockets: [{
        label: "Color",
        alternativeValue: {
          vec4: new Vector4(0),
        },
        alternativeValueInputType: InNodeInputType.Vector4,
      }],
      outSockets: [],
      deletable: false,
    } as NodeBlueprint
  }
}]