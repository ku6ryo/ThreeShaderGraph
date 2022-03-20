import { NodeTypeId } from "./NodeTypeId"
import { InNodeInputType, NodeColor } from "../components/NodeBox"
import { NodeBlueprint } from "../components/Board"
import { Vector3 } from "three"

export const outputFactories = [{
  id: NodeTypeId.OutputColor,
  name: "Output / Color",
  factory: () => {
    return {
      color: NodeColor.Green,
      inNodeInputSlots: [],
      inSockets: [{
        label: "Color",
        alternativeValue: {
          vec3: new Vector3(1, 0, 0),
        },
        alternativeValueInputType: InNodeInputType.Vector3,
      }],
      outSockets: []
    } as NodeBlueprint
  }
}]