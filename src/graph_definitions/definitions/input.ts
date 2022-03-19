import { NodeTypeId } from "./NodeTypeId"
import { NodeColor, InNodeInputType } from "../../graph/NodeBox"
import { NodeBlueprint } from "../../graph/Board"

export const inputFactories = [{
  id: NodeTypeId.InputUv,
  name: "Input / UV",
  factory: () => {
    return {
      color: NodeColor.Red,
      inSockets: [],
      outSockets: [{
        label: "UV",
      }]
    } as NodeBlueprint
  }
}, {
  id: NodeTypeId.InputTime,
  name: "Input / Time",
  factory: () => {
    return {
      color: NodeColor.Red,
      inSockets: [{
        label: "time",
      }],
      outSockets: [{
        label: "Seconds",
      }]
    } as NodeBlueprint
  }
}, {
  id: NodeTypeId.InputTexture,
  name: "Input / Texture",
  factory: () => {
    return {
      color: NodeColor.Red,
      inSockets: [],
      outSockets: [{
        label: "Texture",
      }]
    } as NodeBlueprint
  }
}, {
  id: NodeTypeId.InputFloat,
  name: "Input / Float",
  factory: () => {
    return {
      color: NodeColor.Red,
      inSockets: [],
      outSockets: [{
        label: "value",
      }]
    } as NodeBlueprint
  }
}]