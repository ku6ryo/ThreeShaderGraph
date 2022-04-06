import { Vector4 } from "three"
import { NodeTypeId } from "./NodeTypeId"
import { NodeCategory, NodeInputType, NodeColor, NodeDefinition } from "./types"

export const materialCategory: NodeCategory = {
  id: "material",
  label: "Material",
  icon: "cube",
  color: NodeColor.Emerald,
}

export const materialDefs: NodeDefinition[] = [{
  id: NodeTypeId.Material_Lambert,
  name: "Lambert",
  category: materialCategory,
  inSockets: [{
    label: "Diffuse",
    alternativeValue: {
      vec4: new Vector4(1, 1, 1, 1),
    },
    alternativeValueInputType: NodeInputType.Color,
  }, {
    label: "Emissive",
    alternativeValue: {
      vec4: new Vector4(),
    },
    alternativeValueInputType: NodeInputType.Color,
  }],
  outSockets: [{
    label: "Color",
  }],
}, {
  id: NodeTypeId.Material_Phong,
  name: "Phong",
  category: materialCategory,
  inSockets: [{
    label: "Diffuse",
    alternativeValue: {
      vec4: new Vector4(1, 1, 1, 1),
    },
    alternativeValueInputType: NodeInputType.Color,
  }, {
    label: "Emissive",
    alternativeValue: {
      vec4: new Vector4(),
    },
    alternativeValueInputType: NodeInputType.Color,
  }, {
    label: "Specular",
    alternativeValue: {
      vec4: new Vector4(),
    },
    alternativeValueInputType: NodeInputType.Color,
    hidden: true,
  }, {
    label: "Shininess",
    alternativeValue: {
      float: 1,
    },
    alternativeValueInputType: NodeInputType.Float,
    hidden: true,
  }, {
    label: "Opacity",
    alternativeValue: {
      float: 1,
    },
    alternativeValueInputType: NodeInputType.Float,
  }],
  outSockets: [{
    label: "Color",
  }],
}, {
  id: NodeTypeId.Material_Physical,
  name: "Physical",
  category: materialCategory,
  inSockets: [{
    label: "Diffuse",
    alternativeValue: {
      vec4: new Vector4(1, 1, 1, 1),
    },
    alternativeValueInputType: NodeInputType.Color,
  }, {
    label: "Emissive",
    alternativeValue: {
      vec4: new Vector4(),
    },
    alternativeValueInputType: NodeInputType.Color,
  }, {
    label: "Roughness",
    alternativeValue: {
      float: 0.5,
    },
    alternativeValueInputType: NodeInputType.Float,
  }, {
    label: "Metalness",
    alternativeValue: {
      float: 0.5,
    },
    alternativeValueInputType: NodeInputType.Float,
  }, {
    label: "Reflectivity",
    hidden: true,
    alternativeValue: {
      float: 1,
    },
    alternativeValueInputType: NodeInputType.Float,
  }, {
    label: "Clearcoat",
    hidden: true,
    alternativeValue: {
      float: 1,
    },
    alternativeValueInputType: NodeInputType.Float,
  }, {
    label: "Clearcoat Roughness",
    hidden: true,
    alternativeValue: {
      float: 1,
    },
    alternativeValueInputType: NodeInputType.Float,
  }, {
    label: "Opacity",
    alternativeValue: {
      float: 1,
    },
    alternativeValueInputType: NodeInputType.Float,
  }],
  outSockets: [{
    label: "Color",
  }],
}]
