import { ShaderNode } from "../../ShaderNode";
import { ShaderDataType } from "../../data_types";
import { Vector4 } from "three";


export class ColorOutputNode extends ShaderNode {

  constructor(id: string) {
    super(id, "ColorOutput", undefined, true)
    this.addInSocket("in", ShaderDataType.Vector4)
    this.setUniformValue(0, new Vector4())
  }

  generateFragCode(): string {
    const s = this.getInSockets()[0]
    return `
    gl_FragColor = ${s.connected() ? s.getVarName() : s.getUniformVarName()};
    `
  }
}