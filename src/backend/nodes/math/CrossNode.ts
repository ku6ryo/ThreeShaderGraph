import { ShaderNode } from "../../ShaderNode"
import { ShaderDataType, } from "../../data_types"
import { Vector3 } from "three"

export class CrossNode extends ShaderNode {

  constructor(id: string) {
    super(id, "Math_Cross")
    this.addInSocket("v0", ShaderDataType.Vector3)
    this.setUniformValue(0, new Vector3(1, 0, 0))
    this.addInSocket("v1", ShaderDataType.Vector3)
    this.setUniformValue(1, new Vector3(0, 1, 0))
    this.addOutSocket("o", ShaderDataType.Vector3)
  }

  generateFragCode(): string {
    const i0 = this.getInSocket(0).getVarName()
    const i1 = this.getInSocket(1).getVarName()
    const o = this.getOutSocket(0).getVarName()
    return `
    vec3 ${o} = corss(${i0}, ${i1});
    `
  }
}
