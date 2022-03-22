import { ShaderNode } from "../../ShaderNode"
import { ShaderDataType } from "../../data_types"

export class SeparateNode extends ShaderNode {
  constructor(id: string) {
    super(id, "Math_Separate")
    this.addInSocket("in", ShaderDataType.Vector4)
    this.addOutSocket("r", ShaderDataType.Float)
    this.addOutSocket("g", ShaderDataType.Float)
    this.addOutSocket("b", ShaderDataType.Float)
    this.addOutSocket("a", ShaderDataType.Float)
  }

  generateFragCode(): string {
    const i = this.getInSocket(0)
    const o0 = this.getOutSocket(0)
    const o1 = this.getOutSocket(1)
    const o2 = this.getOutSocket(2)
    const o3 = this.getOutSocket(3)
    return `
    float ${o0.getVarName()} = vec4(${i.getVarName()}).r;
    float ${o1.getVarName()} = vec4(${i.getVarName()}).g;
    float ${o2.getVarName()} = vec4(${i.getVarName()}).b;
    float ${o3.getVarName()} = vec4(${i.getVarName()}).a;
    `
  }
}
