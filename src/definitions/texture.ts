import { NodeTypeId } from "./NodeTypeId"
import { NodeColor } from "../components/NodeBox"
import { NodeCategory } from "./types"
import { NodeBlueprint } from "../components/Board/types"

export const textureCategory: NodeCategory = {
  id: "texture",
  label: "Texture",
  icon: "media",
}

export const textureFactories = [{
  id: NodeTypeId.TextureSample,
  name: "Sample",
  category: textureCategory,
  factory: () => {
    return {
      color: NodeColor.Orange,
      inNodeInputSlots: [],
      inSockets: [{
        label: "Texture",
      }, {
        label: "UV",
      }],
      outSockets: [{
        label: "Color",
      }]
    } as NodeBlueprint
  }
}, {
  id: NodeTypeId.TexturePerlinNoise,
  name: "Parlin Noise",
  category: textureCategory,
  factory: () => {
    return {
      color: NodeColor.Orange,
      inNodeInputSlots: [],
      inSockets: [{
        label: "UV",
      }],
      outSockets: [{
        label: "Color",
      }]
    } as NodeBlueprint
  }
}]