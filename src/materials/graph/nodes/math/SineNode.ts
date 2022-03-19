import { ShaderNode } from "../../ShaderNode";
import { ShaderDataType, ShaderVectorTypes } from "../../data_types";
import { Vector4 } from "three";

const SupportedTypes = ShaderVectorTypes.concat([ShaderDataType.Float]);

export class SineNode extends ShaderNode {

  #type: ShaderDataType

  constructor(id: string, type: ShaderDataType) {
    if (!SupportedTypes.includes(type)) {
      throw new Error("Unsupported type: " + type)
    }
    super(id, "Math_Sine")
    this.#type = type
    this.addInSocket("in", type)
    this.setUniformValue(0, new Vector4(1.0, 0.0, 0.0, 0.0))
    this.addOutSocket("out", type)
  }

  generateCommonCode(): string {
    return ""
  }

  generateCode(): string {
    const i = this.getInSockets()[0]
    const o = this.getOutSockets()[0]
    return `
    ${this.#type} ${o.getVarName()} = sin(${i.getVarName()});
    `
  }
}