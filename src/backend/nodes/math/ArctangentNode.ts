import { Vector4 } from "three"
import { ShaderNode } from "../../ShaderNode"
import { ShaderDataType, ShaderVectorTypes } from "../../data_types"

const SupportedTypes = ShaderVectorTypes.concat([ShaderDataType.Float])

export class ArctangentNode extends ShaderNode {
  #type: ShaderDataType

  constructor(id: string, type: ShaderDataType) {
    if (!SupportedTypes.includes(type)) {
      throw new Error(`Unsupported type: ${type}`)
    }
    super(id, "Math_arctangent")
    this.#type = type
    this.addInSocket("in", type)
    this.setUniformValue(0, new Vector4(0.0, 0.0, 0.0, 0.0))
    this.addOutSocket("out", type)
  }

  generateFragCode(): string {
    const i = this.getInSocket(0)
    const o = this.getOutSocket(0)
    return `
    ${this.#type} ${o.getVarName()} = atan(${i.getVarName()});
    `
  }
}
