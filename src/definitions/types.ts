import {
  Vector2,
  Vector3,
  Vector4,
  Texture,
} from "three"
import { NodeTypeId } from "./NodeTypeId"

export enum NodeColor {
  Orange = "orange",
  Blue = "blue",
  Red = "red",
  Green = "green",
  Pink = "pink",
  Purple = "purple",
  White = "white",
  Emerald = "emerald",
}

export type NodeCategory = {
  id: string,
  label: string,
  icon: string,
  color: NodeColor,
}

export enum NodeInputType {
  Image = "image",
  Color = "color",
  Float = "float",
  Vector2 = "vetor2",
  Vector3 = "vetor3",
  Vector4 = "vetor4",
}

export type NodeInputValue = {
  float?: number,
  vec2?: Vector2,
  vec3?: Vector3,
  vec4?: Vector4,
  image?: Texture,
}

export function cloneNodeInputValue(v: NodeInputValue) {
  return {
    float: v.float === undefined ? undefined : v.float,
    vec2: v.vec2 ? v.vec2.clone() : undefined,
    vec3: v.vec3 ? v.vec3.clone() : undefined,
    vec4: v.vec4 ? v.vec4.clone() : undefined,
    image: v.image ? v.image.clone() : undefined,
  }
}

export type InSocket = {
  label: string,
  alternativeValueInputType?: NodeInputType,
  alternativeValue?: NodeInputValue,
  socketHidden?: boolean,
  hidden?: boolean
}

export type OutSocket = {
  label: string,
}

export type NodeDefinition = {
  id: NodeTypeId,
  name: string,
  category: NodeCategory,
  inSockets: InSocket[],
  outSockets: OutSocket[]
  unique?: boolean,
  deletable?: boolean,
}
