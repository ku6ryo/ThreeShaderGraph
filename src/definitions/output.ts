import { Vector4 } from "three"
import { NodeTypeId } from "./NodeTypeId"
import { NodeCategory, NodeColor, NodeInputType } from "./types"

export const outputCategory: NodeCategory = {
  id: "output",
  label: "Output",
  icon: "arrow-right",
  color: NodeColor.Pink,
}

export const outputDefs = [{
  id: NodeTypeId.OutputColor,
  name: "Fragment Color",
  category: outputCategory,
  inSockets: [{
    label: "Color",
    alternativeValue: {
      vec4: new Vector4(0),
    },
    alternativeValueInputType: NodeInputType.Vector4,
  }],
  outSockets: [],
  unique: true,
  deletable: false,
}]
