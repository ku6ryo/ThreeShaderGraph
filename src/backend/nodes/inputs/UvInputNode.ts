import { AttributeType, ShaderNode } from "../../ShaderNode";
import { ShaderDataType } from "../../data_types";

export class UvInputNode extends ShaderNode {

  constructor(id: string) {
    super(id, "UvInput", [AttributeType.UV])
    this.addOutSocket("TextureInputNodeOut", ShaderDataType.Vector2)
  }

  generateVertCommonCode(): string {
    return "varying vec2 vUv;"
  }

  generateVertCode(): string {
    return "vUv = uv;"
  }

  generateFragCommonCode(): string {
    return "varying vec2 vUv;"
  }

  generateFragCode(): string {
    this.getOutSocket(0).overrideVariableName("vUv")
    return ""
  }
}