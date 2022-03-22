import { ShaderNode } from "../../ShaderNode"
import { ShaderDataType } from "../../data_types"

export class CombineNode extends ShaderNode {
  constructor(id: string) {
    super(id, "Math_Combine")
    this.addInSocket("r", ShaderDataType.Float)
    this.addInSocket("g", ShaderDataType.Float)
    this.addInSocket("b", ShaderDataType.Float)
    this.addInSocket("a", ShaderDataType.Float)
    this.addOutSocket("out", ShaderDataType.Vector4)
  }

  generateFragCode(): string {
    const i0 = this.getInSocket(0)
    const i1 = this.getInSocket(1)
    const i2 = this.getInSocket(2)
    const i3 = this.getInSocket(3)
    const o = this.getOutSocket(0)
    return `
    vec4 ${o.getVarName()} = vec4(${i0.getVarName()}, ${i1.getVarName()}, ${i2.getVarName()}, ${i3.getVarName()});
    `
  }
}
