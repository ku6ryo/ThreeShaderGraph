import { Vector3 } from "three"
import { ShaderNode } from "../../ShaderNode"
import { ShaderDataType } from "../../data_types"

export class Vector3InputNode extends ShaderNode {
  constructor(id: string) {
    super(id, "V3Input")
    this.addInSocket("i", ShaderDataType.Vector3)
    this.setUniformValue(0, new Vector3(0, 0, 0))
    this.addOutSocket("o", ShaderDataType.Vector3)
  }

  generateFragCode(): string {
    const i = this.getInSocket(0)
    const o = this.getOutSocket(0)
    return `vec3 ${o.getVarName()} = ${i.getVarName()};`
  }
}
