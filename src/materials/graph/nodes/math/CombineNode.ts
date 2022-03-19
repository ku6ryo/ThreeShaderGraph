import { ShaderNode } from "../../ShaderNode";
import { ShaderDataType } from "../../data_types";

export class CombineNode extends ShaderNode {

  constructor(id: string) {
    super(id, "Math_Combine")
    this.addInSocket("r", ShaderDataType.Float)
    this.addInSocket("g", ShaderDataType.Float)
    this.addInSocket("b", ShaderDataType.Float)
    this.addInSocket("a", ShaderDataType.Float)
    this.addOutSocket("out", ShaderDataType.Vector4)
  }

  generateCommonCode(): string {
    return ""
  }

  generateCode(): string {
    const inputs = this.getInSockets()
    const outputs = this.getOutSockets()
    return `
    vec4 ${outputs[0].getVarName()} = vec4(${inputs[0].getVarName()}, ${inputs[1].getVarName()}, ${inputs[2].getVarName()}, ${inputs[3].getVarName()});
    `
  }
}