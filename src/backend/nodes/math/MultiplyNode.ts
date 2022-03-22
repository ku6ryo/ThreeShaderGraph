import { ShaderNode } from "../../ShaderNode"
import { ShaderDataType, ShaderVectorTypes } from "../../data_types"

const SupportedTypes = ShaderVectorTypes.concat([ShaderDataType.Float])

export class MultiplyNode extends ShaderNode {
  #type: ShaderDataType

  constructor(id: string, type: ShaderDataType) {
    if (!SupportedTypes.includes(type)) {
      throw new Error(`Unsupported type: ${type}`)
    }
    super(id, "Math_Multiply")
    this.#type = type
    this.addInSocket("in0", type)
    this.addInSocket("in1", type)
    this.addOutSocket("out", type)
  }

  generateFragCode(): string {
    const i0 = this.getInSocket(0)
    const i1 = this.getInSocket(1)
    const o = this.getOutSocket(0)
    return `
    ${this.#type} ${o.getVarName()} = ${i0.getVarName()} * ${i1.getVarName()};
    `
  }
}
