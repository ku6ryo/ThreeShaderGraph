import { BuiltIn, ShaderNode } from "../../ShaderNode"
import { ShaderDataType } from "../../data_types"

export class UvInputNode extends ShaderNode {
  constructor(id: string) {
    super(id, "UvInput", [BuiltIn.UV])
    this.addOutSocket("TextureInputNodeOut", ShaderDataType.Vector2)
    this.getOutSocket(0).overrideVariableName("vUv")
  }
}
