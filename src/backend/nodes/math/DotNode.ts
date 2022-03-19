import { ShaderNode } from "../../ShaderNode";
import { ShaderDataType, ShaderVectorTypes } from "../../data_types";

const SupportedTypes = ShaderVectorTypes.concat([ShaderDataType.Float]);

export class DotNode extends ShaderNode {

  #type: ShaderDataType

  constructor(id: string, type: ShaderDataType) {
    if (!SupportedTypes.includes(type)) {
      throw new Error("Unsupported type: " + type)
    }
    super(id, "Math_Dot")
    this.#type = type
    this.addInSocket("in0", type)
    this.addInSocket("in1", type)
    this.addOutSocket("out", type)
  }

  generateFragCommonCode(): string {
    return ""
  }

  generateFragCode(): string {
    const inputs = this.getInSockets()
    const outputs = this.getOutSockets()
    return `
    ${this.#type} ${outputs[0].getVarName()} = dot(${inputs[0].getVarName()}, ${inputs[1].getVarName()});
    `
  }
}