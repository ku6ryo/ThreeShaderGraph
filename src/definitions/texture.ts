import { NodeTypeId } from "./NodeTypeId"
import {
  NodeCategory, NodeColor, NodeDefinition, NodeInputType,
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
  }, {
    label: "Scale",
    alternativeValueInputType: NodeInputType.Float,
    alternativeValue: {
      float: 10,
    },
  }],
  outSockets: [{
    label: "Color",
  }],
}, {
  id: NodeTypeId.TextureVolonoi,
  name: "Volonoi",
  category: textureCategory,
  inSockets: [{
    label: "UV",
  }, {
    label: "Scale",
    alternativeValueInputType: NodeInputType.Float,
    alternativeValue: {
      float: 10,
    },
  }, {
    label: "Randomness",
    alternativeValueInputType: NodeInputType.Float,
    alternativeValue: {
      float: 1,
    },
  }],
  outSockets: [{
    label: "Distance",
  }],
}]
