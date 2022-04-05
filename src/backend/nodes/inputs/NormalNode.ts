import { BuiltIn, ShaderNode } from "../../ShaderNode"
import { ShaderDataType } from "../../data_types"

export class NormalNode extends ShaderNode {
  constructor(id: string) {
    super(id, "Normal", [BuiltIn.Normal])
    this.addOutSocket("o", ShaderDataType.Vector3)
    this.getOutSocket(0).overrideVariableName("vNormal")
  }
}
