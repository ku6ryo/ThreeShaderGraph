import { ShaderNode } from "../../ShaderNode"
import { ShaderDataType, ShaderVectorTypes } from "../../data_types"

const SupportedTypes = ShaderVectorTypes.concat([ShaderDataType.Float])
export class ClampNode extends ShaderNode {
  #type: ShaderDataType

  constructor(id: string, type: ShaderDataType) {
    if (!SupportedTypes.includes(type)) {
      throw new Error(`Unsupported type: ${type}`)
    }
    super(id, "Math_Clamp")
    this.#type = type
    this.addInSocket("i", type)
    this.addInSocket("min", ShaderDataType.Float)
    this.addInSocket("max", ShaderDataType.Float)
    this.addOutSocket("o", type)
  }

  generateFragCode(): string {
    const i = this.getInSocket(0).getVarName()
    const min = this.getInSocket(1).getVarName()
    const max = this.getInSocket(2).getVarName()
    const o = this.getOutSocket(0).getVarName()
    return `
    ${this.#type} ${o} = clamp(${i}, ${min}, ${max});
    `
  }
}
