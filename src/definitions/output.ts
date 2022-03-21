import { NodeTypeId } from "./NodeTypeId"
import { InNodeInputType, NodeColor } from "../components/NodeBox"
import { NodeBlueprint } from "../components/Board"
import { Vector4 } from "three"

export const outputFactories = [{
  id: NodeTypeId.OutputColor,
  name: "Output / Fragment Color",
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