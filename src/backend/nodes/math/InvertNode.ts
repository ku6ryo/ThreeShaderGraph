import { ShaderNode } from "../../ShaderNode"
import { ShaderDataType } from "../../data_types"

export class InvertNode extends ShaderNode {
  constructor(id: string) {
    super(id, "Math_Invert")
    this.addInSocket("i", ShaderDataType.Vector4)
    this.addOutSocket("o", ShaderDataType.Vector4)
  }

  generateFragCode(): string {
    const i = this.getInSocket(0)
    const o = this.getOutSocket(0)
    return `
    vec4 ${o.getVarName()} = vec4(1.) - ${i.getVarName()};
    `
  }
}
