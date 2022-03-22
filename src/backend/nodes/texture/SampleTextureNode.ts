import { ShaderNode } from "../../ShaderNode"
import { ShaderDataType } from "../../data_types"

export class SampleTextureNode extends ShaderNode {
  constructor(id: string) {
    super(id, "Texture_Sample")
    this.addInSocket("tex", ShaderDataType.Sampler2D)
    this.addInSocket("uv", ShaderDataType.Vector2)
    this.addOutSocket("color", ShaderDataType.Vector4)
  }

  generateFragCode(): string {
    const i0 = this.getInSocket(0)
    const i1 = this.getInSocket(1)
    const o = this.getOutSocket(0)
    return `
    vec4 ${o.getVarName()} = texture2D(${i0.getVarName()}, ${i1.getVarName()});
    `
  }
}
