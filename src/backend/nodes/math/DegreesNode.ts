import { ShaderNode } from "../../ShaderNode"
import { ShaderDataType, ShaderVectorTypes } from "../../data_types"

const SupportedTypes = ShaderVectorTypes.concat([ShaderDataType.Float])
export class DegreesNode extends ShaderNode {
  #type: ShaderDataType

  constructor(id: string, type: ShaderDataType) {
    if (!SupportedTypes.includes(type)) {
      throw new Error(`Unsupported type: ${type}`)
    }
    super(id, "Math_Degrees")
    this.#type = type
    this.addInSocket("in0", type)
    this.addOutSocket("out", type)
  }

  generateFragCode(): string {
    const i0 = this.getInSocket(0).getVarName()
    const o = this.getOutSocket(0).getVarName()
    return `
    ${this.#type} ${o} = degrees(${i0});
    `
  }
}
