import { ShaderNode } from "../../ShaderNode";
import { ShaderDataType } from "../../data_types";

export class TimeInputNode extends ShaderNode {

  constructor(id: string) {
    super(id, "Input_Time", undefined, false, true)
    this.addInSocket("time", ShaderDataType.Float)
    this.setUniformValue(0, 0)
    this.addOutSocket("TimeInputNodeOut", ShaderDataType.Float)
    this.getOutSockets()[0].overrideVariableName(this.getInSockets()[0].getUniformVarName())
  }

  updateOnDraw(): void {
    this.setUniformValue(0, performance.now() / 1000)
  }

  generateCommonCode(): string {
    return ""
  }

  generateCode(): string {
    return ""
  }
}