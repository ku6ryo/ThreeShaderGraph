import { ShaderNode } from "../../ShaderNode"
import { ShaderDataType } from "../../data_types"

export class TextureInputNode extends ShaderNode {
  constructor(id: string) {
    super(id, "Input_Texture")
    this.addInSocket("i", ShaderDataType.Sampler2D)
    this.addOutSocket("o", ShaderDataType.Sampler2D)
    this.getOutSocket(0).overrideVariableName(this.getInSocket(0).getUniformVarName())
  }

  generateFragCommonCode(): string {
    return ""
  }

  generateFragCode(): string {
    return ""
  }
}
