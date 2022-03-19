import { ShaderNode } from "../../ShaderNode";
import { ShaderDataType } from "../../data_types";


export class SampleTextureNode extends ShaderNode {

  constructor(id: string) {
    super(id, "Texture_Sample")
    this.addInSocket("tex", ShaderDataType.Sampler2D)
    this.addInSocket("uv", ShaderDataType.Vector2)
    this.addOutSocket("color", ShaderDataType.Vector4)
  }

  generateCommonCode(): string {
    return ""
  }

  generateCode(): string {
    const inputs = this.getInSockets()
    const outputs = this.getOutSockets()
    return `
    vec4 ${outputs[0].getVeriableName()} = texture2D(${inputs[0].getVeriableName()}, ${inputs[1].getVeriableName()});
    `
  }
}