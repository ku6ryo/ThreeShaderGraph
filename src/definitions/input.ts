import { NodeTypeId } from "./NodeTypeId"
import { NodeColor, InNodeInputType } from "../components/NodeBox"
import { NodeBlueprint } from "../components/Board"

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
        hidden: true,
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
      inSockets: [{
        label: "tex",
        alternativeValueInputType: InNodeInputType.Image,
        alternativeValue: {},
        socketHidden: true,
      }],
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
      inSockets: [{
        label: "Value",
        alternativeValueInputType: InNodeInputType.Float,
        alternativeValue: {
          float: 1
        },
        socketHidden: true,
      }],
      outSockets: [{
        label: "value",
      }]
    } as NodeBlueprint
  }
}]