import { ShaderNode } from "../../ShaderNode";
import { ShaderDataType } from "../../data_types";

export class SeparateNode extends ShaderNode {

  constructor(id: string) {
    super(id, "Math_Separate")
    this.addInSocket("in", ShaderDataType.Vector4)
    this.addOutSocket("r", ShaderDataType.Float)
    this.addOutSocket("g", ShaderDataType.Float)
    this.addOutSocket("b", ShaderDataType.Float)
    this.addOutSocket("a", ShaderDataType.Float)
  }

  generateFragCommonCode(): string {
    return ""
  }

  generateFragCode(): string {
    const inputs = this.getInSockets()
    const outputs = this.getOutSockets()
    return `
    float ${outputs[0].getVarName()} = vec4(${inputs[0].getVarName()}).r;
    float ${outputs[1].getVarName()} = vec4(${inputs[0].getVarName()}).g;
    float ${outputs[2].getVarName()} = vec4(${inputs[0].getVarName()}).b;
    float ${outputs[3].getVarName()} = vec4(${inputs[0].getVarName()}).a;
    `
  }
}