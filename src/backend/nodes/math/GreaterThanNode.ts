import { ShaderNode } from "../../ShaderNode";
import { ShaderDataType } from "../../data_types";

export class GreaterThanNode extends ShaderNode {

  constructor(id: string) {
    super(id, "Math_GreaterThan")
    this.addInSocket("v", ShaderDataType.Float)
    this.addInSocket("threshold", ShaderDataType.Float)
    this.addOutSocket("o", ShaderDataType.Float)
  }

  generateFragCode(): string {
    const inSokcets = this.getInSockets()
    const v = inSokcets[0].getVarName()
    const t = inSokcets[1].getVarName()
    const o = this.getOutSockets()[0].getVarName()
    return `
    float ${o} = 0.;
    if (${v} > ${t}) {
      ${o} = 1.;
    }
    `
  }
}