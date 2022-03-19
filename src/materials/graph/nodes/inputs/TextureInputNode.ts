import { ShaderNode } from "../../ShaderNode";
import { ShaderDataType } from "../../data_types";

export class TextureInputNode extends ShaderNode {

  #value: HTMLImageElement;

  constructor(id: string, value: HTMLImageElement) {
    super(id, "Input_Texture")
    this.#value = value
    this.setUniformValue(0, value)
    this.addOutSocket("TextureInputNodeOut", ShaderDataType.Sampler2D)
  }

  getValue(): HTMLImageElement {
    return this.#value
  }

  setValue(value: HTMLImageElement) {
    this.#value = value
  }

  generateCommonCode(): string {
    return ""
  }

  generateCode(): string {
    const uName = this.getUnifromName(0)
    this.getOutSockets()[0].overrideVariableName(uName)
    return ""
  }
}