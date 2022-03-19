import { ShaderNode } from "../../ShaderNode";
import { ShaderDataType, ShaderVectorTypes } from "../../data_types";

const SupportedTypes = ShaderVectorTypes.concat([ShaderDataType.Float]);

export class TangentNode extends ShaderNode {

  #type: ShaderDataType

  constructor(id: string, type: ShaderDataType) {
    if (!SupportedTypes.includes(type)) {
      throw new Error("Unsupported type: " + type)
    }
    super(id, "Math_Cosine")
    this.#type = type
    this.addInSocket("in", type)
    this.addOutSocket("out", type)
  }

  generateCommonCode(): string {
    return ""
  }

  generateCode(): string {
    const inputs = this.getInSockets()
    const outputs = this.getOutSockets()
    return `
    ${this.#type} ${outputs[0].getVeriableName()} = tan(${inputs[0].getVeriableName()});
    `
  }
}