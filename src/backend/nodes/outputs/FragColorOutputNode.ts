import { Vector4 } from "three"
import { ShaderNode } from "../../ShaderNode"
import { ShaderDataType } from "../../data_types"

export class FragColorOutputNode extends ShaderNode {
  constructor(id: string) {
    super(id, "FragColorOutput", undefined, true)
    this.addInSocket("in", ShaderDataType.Vector4)
    this.setUniformValue(0, new Vector4())
  }

  generateFragCode(): string {
    const s = this.getInSockets()[0]
    return `
    gl_FragColor = ${s.getVarName()};
    `
  }
}
