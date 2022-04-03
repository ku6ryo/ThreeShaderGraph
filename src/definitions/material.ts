import { Vector3 } from "three"
import { NodeTypeId } from "./NodeTypeId"
import { NodeCategory, NodeInputType, NodeColor } from "./types"

export const materialCategory: NodeCategory = {
  id: "material",
  label: "Material",
  icon: "cube",
  color: NodeColor.Emerald,
}

export const materialDefs = [{
  id: NodeTypeId.Material_Lambert,
  name: "Lambert",
  category: materialCategory,
  inSockets: [{
    label: "Diffuse",
    alternativeValue: {
      vec3: new Vector3(1, 1, 1),
    },
    alternativeValueInputType: NodeInputType.Vector3,
  }, {
    label: "Emissive",
    alternativeValue: {
      vec3: new Vector3(),
    },
    alternativeValueInputType: NodeInputType.Vector3,
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
      vec3: new Vector3(1, 1, 1),
    },
    alternativeValueInputType: NodeInputType.Vector3,
  }, {
    label: "Emissive",
    alternativeValue: {
      vec3: new Vector3(),
    },
    alternativeValueInputType: NodeInputType.Vector3,
  }, {
    label: "Specular",
    alternativeValue: {
      vec3: new Vector3(),
    },
    alternativeValueInputType: NodeInputType.Vector3,
  }, {
    label: "Shininess",
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
