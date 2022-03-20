import { ShaderNode } from "../../ShaderNode";
import { ShaderDataType } from "../../data_types";

export class FloatInputNode extends ShaderNode {

  constructor(id: string) {
    super(id, "FloatInput")
    this.addInSocket("floatInputIn", ShaderDataType.Float)
    this.setUniformValue(0, 1)
    this.addOutSocket("floatInputOut", ShaderDataType.Float)
  }

  generateFragCode(): string {
    const i = this.getInSockets()[0]
    const o = this.getOutSockets()[0]
    return `float ${o.getVarName()} = ${i.getVarName()};`
  }
}