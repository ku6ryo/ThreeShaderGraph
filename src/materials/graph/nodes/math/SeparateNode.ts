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

  generateCommonCode(): string {
    return ""
  }

  generateCode(): string {
    const inputs = this.getInSockets()
    const outputs = this.getOutSockets()
    return `
    float ${outputs[0].getVeriableName()} = vec4(${inputs[0].getVeriableName()}).r;
    float ${outputs[1].getVeriableName()} = vec4(${inputs[0].getVeriableName()}).g;
    float ${outputs[2].getVeriableName()} = vec4(${inputs[0].getVeriableName()}).b;
    float ${outputs[3].getVeriableName()} = vec4(${inputs[0].getVeriableName()}).a;
    `
  }
}