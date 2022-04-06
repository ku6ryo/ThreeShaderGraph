import { ShaderNode } from "../../ShaderNode"
import { ShaderDataType, ShaderVectorTypes } from "../../data_types"

const SupportedTypes = ShaderVectorTypes.concat([ShaderDataType.Float])
export class DistanceNode extends ShaderNode {
  #type: ShaderDataType

  constructor(id: string, type: ShaderDataType) {
    if (!SupportedTypes.includes(type)) {
      throw new Error(`Unsupported type: ${type}`)
    }
    super(id, "Math_Distance")
    this.#type = type
    this.addInSocket("in0", type)
    this.addInSocket("in1", type)
    this.addOutSocket("out", ShaderDataType.Float)
  }

  generateFragCode(): string {
    const i0 = this.getInSocket(0).getVarName()
    const i1 = this.getInSocket(1).getVarName()
    const o = this.getOutSocket(0).getVarName()
    return `
    float ${o} = distance(${i0}, ${i1});
    `
  }
}
