import { ShaderNode } from "../../ShaderNode"
import { ShaderDataType } from "../../data_types"

export class TimeInputNode extends ShaderNode {
  constructor(id: string) {
    super(id, "Input_Time", undefined, false)
    this.addInSocket("time", ShaderDataType.Float)
    this.setUniformValue(0, 0)
    this.addOutSocket("TimeInputNodeOut", ShaderDataType.Float)
    this.getOutSocket(0).overrideVariableName(this.getInSocket(0).getUniformVarName())
  }

  updateOnDraw(): void {
    this.setUniformValue(0, performance.now() / 1000)
  }

  generateFragCommonCode(): string {
    return ""
  }

  generateFragCode(): string {
    return ""
  }
}
