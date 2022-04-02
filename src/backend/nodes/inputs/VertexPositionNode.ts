import { BuiltIn, ShaderNode } from "../../ShaderNode"
import { ShaderDataType } from "../../data_types"

export class VertexPositionNode extends ShaderNode {
  constructor(id: string) {
    super(id, "VertPos", [BuiltIn.VertexPositon])
    this.addOutSocket("VertPosOut", ShaderDataType.Vector3)
    this.getOutSocket(0).overrideVariableName("vPosition")
  }
}
