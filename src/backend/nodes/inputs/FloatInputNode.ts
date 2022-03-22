import { ShaderNode } from "../../ShaderNode"
import { ShaderDataType } from "../../data_types"

export class FloatInputNode extends ShaderNode {
  constructor(id: string) {
    super(id, "FloatInput")
    this.addInSocket("i", ShaderDataType.Float)
    this.setUniformValue(0, 1)
    this.addOutSocket("o", ShaderDataType.Float)
  }

  generateFragCode(): string {
    const i = this.getInSocket(0)
    const o = this.getOutSocket(0)
    return `float ${o.getVarName()} = ${i.getVarName()};`
  }
}
