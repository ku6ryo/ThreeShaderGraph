import { NodeTypeId } from "./NodeTypeId"
import {
  NodeCategory, NodeColor, NodeDefinition,
} from "./types"

export const textureCategory: NodeCategory = {
  id: "texture",
  label: "Texture",
  icon: "media",
  color: NodeColor.Orange,
}

export const textureDefs: NodeDefinition[] = [{
  id: NodeTypeId.TextureSample,
  name: "Sample",
  category: textureCategory,
  inSockets: [{
    label: "Texture",
  }, {
    label: "UV",
  }],
  outSockets: [{
    label: "Color",
  }],
}, {
  id: NodeTypeId.TexturePerlinNoise,
  name: "Parlin Noise",
  category: textureCategory,
  inSockets: [{
    label: "UV",
  }],
  outSockets: [{
    label: "Color",
  }],
}]
