import { Vector4 } from "three"
import { ShaderNode } from "../../ShaderNode"
import { ShaderDataType } from "../../data_types"

export class ColorInputNode extends ShaderNode {
  constructor(id: string) {
    super(id, "ColorInput")
    this.addInSocket("i", ShaderDataType.Vector4)
    this.setUniformValue(0, new Vector4(1, 1, 1, 1))
    this.addOutSocket("o", ShaderDataType.Vector4)
  }

  generateFragCode(): string {
    const i = this.getInSocket(0)
    const o = this.getOutSocket(0)
    return `vec4 ${o.getVarName()} = ${i.getVarName()};`
  }
}
