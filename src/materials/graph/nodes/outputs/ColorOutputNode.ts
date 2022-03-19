import { ShaderNode } from "../../ShaderNode";
import { ShaderDataType } from "../../data_types";
import { Vector3 } from "three";


export class ColorOutputNode extends ShaderNode {

  constructor(id: string) {
    super(id, "ColorOutput", undefined, true, true)
    this.addInSocket("in", ShaderDataType.Vector3)
    this.setUniformValue(0, new Vector3(1, 0, 0))
  }

  generateCommonCode(): string {
    return ""
  }

  generateCode(): string {
    const s = this.getInSockets()[0]
    return `
    gl_FragColor = vec4(${s.connected() ? s.getVeriableName() : s.getUniformValiableName()}, 1.0);
    `
  }
}