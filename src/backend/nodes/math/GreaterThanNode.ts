import { ShaderNode } from "../../ShaderNode"
import { ShaderDataType } from "../../data_types"

export class GreaterThanNode extends ShaderNode {
  constructor(id: string) {
    super(id, "Math_GreaterThan")
    this.addInSocket("v", ShaderDataType.Float)
    this.addInSocket("threshold", ShaderDataType.Float)
    this.addOutSocket("o", ShaderDataType.Float)
  }

  generateFragCode(): string {
    const v = this.getInSocket(0).getVarName()
    const t = this.getInSocket(1).getVarName()
    const o = this.getOutSocket(0).getVarName()
    return `
    float ${o} = 0.;
    if (${v} > ${t}) {
      ${o} = 1.;
    }
    `
  }
}
