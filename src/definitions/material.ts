import { NodeTypeId } from "./NodeTypeId"
import { InNodeInputType, NodeColor } from "../components/NodeBox"
import { NodeBlueprint } from "../components/Board"
import { Vector3 } from "three"

export const materialFactories = [{
  id: NodeTypeId.Material_Lambert,
  name: "Material / Lambert",
  factory: () => {
    return {
      color: NodeColor.Green,
      inNodeInputSlots: [],
      inSockets: [{
        label: "Diffuse",
        alternativeValue: {
          vec3: new Vector3(1, 1, 1),
        },
        alternativeValueInputType: InNodeInputType.Vector3,
      }, {
        label: "Emissive",
        alternativeValue: {
          vec3: new Vector3(),
        },
        alternativeValueInputType: InNodeInputType.Vector3,
      }],
      outSockets: [{
        label: "Color",
      }],
    } as NodeBlueprint
  }
}, {
  id: NodeTypeId.Material_Phong,
  name: "Material / Phong",
  factory: () => {
    return {
      color: NodeColor.Green,
      inNodeInputSlots: [],
      inSockets: [{
        label: "Diffuse",
        alternativeValue: {
          vec3: new Vector3(1, 1, 1),
        },
        alternativeValueInputType: InNodeInputType.Vector3,
      }, {
        label: "Emissive",
        alternativeValue: {
          vec3: new Vector3(),
        },
        alternativeValueInputType: InNodeInputType.Vector3,
      }, {
        label: "Specular",
        alternativeValue: {
          vec3: new Vector3(),
        },
        alternativeValueInputType: InNodeInputType.Vector3,
      }, {
        label: "Shininess",
        alternativeValue: {
          float: 1,
        },
        alternativeValueInputType: InNodeInputType.Float,
      }, {
        label: "Opacity",
        alternativeValue: {
          float: 1,
        },
        alternativeValueInputType: InNodeInputType.Float,
      }],
      outSockets: [{
        label: "Color",
      }],
    } as NodeBlueprint
  }
}]