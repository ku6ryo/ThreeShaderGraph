import { Vector4 } from "three"
import { NodeTypeId } from "./NodeTypeId"
import { NodeColor, InNodeInputType } from "../components/NodeBox"
import { NodeCategory } from "./types"
import { NodeBlueprint } from "../components/Board/types"

export const inputCategory: NodeCategory = {
  id: "input",
  label: "Input",
  icon: "numerical",
}

export const inputFactories = [{
  id: NodeTypeId.InputUv,
  name: "UV",
  category: inputCategory,
  factory: () => ({
    color: NodeColor.Red,
    inSockets: [],
    outSockets: [{
      label: "UV",
    }],
  } as NodeBlueprint),
}, {
  id: NodeTypeId.InputTime,
  name: "Time",
  category: inputCategory,
  factory: () => ({
    color: NodeColor.Red,
    inSockets: [{
      label: "time",
      hidden: true,
    }],
    outSockets: [{
      label: "Seconds",
    }],
  } as NodeBlueprint),
}, {
  id: NodeTypeId.InputTexture,
  name: "Texture",
  category: inputCategory,
  factory: () => ({
    color: NodeColor.Red,
    inSockets: [{
      label: "Image",
      alternativeValueInputType: InNodeInputType.Image,
      alternativeValue: {},
      socketHidden: true,
    }],
    outSockets: [{
      label: "Texture",
    }],
  } as NodeBlueprint),
}, {
  id: NodeTypeId.InputFloat,
  name: "Float",
  category: inputCategory,
  factory: () => ({
    color: NodeColor.Red,
    inSockets: [{
      label: "Value",
      alternativeValueInputType: InNodeInputType.Float,
      alternativeValue: {
        float: 1,
      },
      socketHidden: true,
    }],
    outSockets: [{
      label: "Value",
    }],
  } as NodeBlueprint),
}, {
  id: NodeTypeId.InputColor,
  name: "Color",
  category: inputCategory,
  factory: () => ({
    color: NodeColor.Red,
    inSockets: [{
      label: "Value",
      alternativeValueInputType: InNodeInputType.Color,
      alternativeValue: {
        vec4: new Vector4(1, 1, 1, 1),
      },
      socketHidden: true,
    }],
    outSockets: [{
      label: "Color",
    }],
  } as NodeBlueprint),
}]
