import { Vector3, Vector4 } from "three"
import { NodeTypeId } from "./NodeTypeId"
import {
  NodeCategory, NodeInputType, NodeColor, NodeDefinition,
} from "./types"

export const inputCategory: NodeCategory = {
  id: "input",
  label: "Input",
  icon: "numerical",
  color: NodeColor.Red,
}

export const inputDefs: NodeDefinition[] = [{
  id: NodeTypeId.InputUv,
  name: "UV",
  category: inputCategory,
  inSockets: [],
  outSockets: [{
    label: "UV",
  }],
}, {
  id: NodeTypeId.InputVertexPosition,
  name: "Vertex Position",
  category: inputCategory,
  inSockets: [],
  outSockets: [{
    label: "Position",
  }],
}, {
  id: NodeTypeId.InputNormal,
  name: "Normal",
  category: inputCategory,
  inSockets: [],
  outSockets: [{
    label: "Normal",
  }],
}, {
  id: NodeTypeId.InputTime,
  name: "Time",
  category: inputCategory,
  inSockets: [{
    label: "time",
    hidden: true,
  }],
  outSockets: [{
    label: "Seconds",
  }],
}, {
  id: NodeTypeId.InputTexture,
  name: "Texture",
  category: inputCategory,
  inSockets: [{
    label: "Image",
    alternativeValueInputType: NodeInputType.Image,
    alternativeValue: {},
    socketHidden: true,
  }],
  outSockets: [{
    label: "Texture",
  }],
}, {
  id: NodeTypeId.InputFloat,
  name: "Float",
  category: inputCategory,
  inSockets: [{
    label: "Value",
    alternativeValueInputType: NodeInputType.Float,
    alternativeValue: {
      float: 1,
    },
    socketHidden: true,
  }],
  outSockets: [{
    label: "Value",
  }],
}, {
  id: NodeTypeId.InputVector3,
  name: "Vector 3",
  category: inputCategory,
  inSockets: [{
    label: "Value",
    alternativeValueInputType: NodeInputType.Vector3,
    alternativeValue: {
      vec3: new Vector3(0, 0, 0),
    },
    socketHidden: true,
  }],
  outSockets: [{
    label: "Vector",
  }],
}, {
  id: NodeTypeId.InputColor,
  name: "Color",
  category: inputCategory,
  inSockets: [{
    label: "Value",
    alternativeValueInputType: NodeInputType.Color,
    alternativeValue: {
      vec4: new Vector4(1, 1, 1, 1),
    },
    socketHidden: true,
  }],
  outSockets: [{
    label: "Color",
  }],
}]
