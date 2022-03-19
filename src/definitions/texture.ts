import { NodeTypeId } from "./NodeTypeId"
import { NodeColor } from "../components/NodeBox"
import { NodeBlueprint } from "../components/Board"
import { mathTypes } from "./data_types"

export const textureFactories = [{
  id: NodeTypeId.TextureSample,
  name: "Texture / Sample",
  factory: () => {
    return {
      color: NodeColor.Orange,
      inNodeInputSlots: [],
      inSockets: [{
        label: "Texture",
      }, {
        label: "UV",
        dataTypes: mathTypes,
      }],
      outSockets: [{
        label: "Color",
      }]
    } as NodeBlueprint
  }
}, {
  id: NodeTypeId.TexturePerlinNoise,
  name: "Texture / Parlin Noise",
  factory: () => {
    return {
      color: NodeColor.Orange,
      inNodeInputSlots: [],
      inSockets: [{
        label: "UV",
        dataTypes: mathTypes,
      }],
      outSockets: [{
        label: "Color",
      }]
    } as NodeBlueprint
  }
}]