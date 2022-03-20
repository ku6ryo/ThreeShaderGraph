import { ShaderNode } from "../../ShaderNode";
import { ShaderDataType } from "../../data_types";

export class TextureInputNode extends ShaderNode {

  constructor(id: string) {
    super(id, "Input_Texture")
    /*
    const uName = this.getUnifromName(0)
    this
    this.getOutSockets()[0].overrideVariableName(uName)
    this.addOutSocket("TextureInputNodeOut", ShaderDataType.Sampler2D)
    */
  }

  generateFragCommonCode(): string {
    return ""
  }

  generateFragCode(): string {
    return ""
  }
}