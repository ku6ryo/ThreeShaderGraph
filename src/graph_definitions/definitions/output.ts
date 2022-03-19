import { NodeTypeId } from "./NodeTypeId"
import { InNodeInputType, NodeColor } from "../../graph/NodeBox"
import { NodeBlueprint } from "../../graph/Board"
import { mathTypes } from "./data_types"
import { ShaderDataType } from "../../materials/graph/data_types"
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
        dataTypes: mathTypes,
        alternativeValue: {
          vec3: new Vector3(1, 0, 0),
        },
        alternativeValueInputType: InNodeInputType.Vector3,
      }],
      outSockets: []
    } as NodeBlueprint
  }
}]