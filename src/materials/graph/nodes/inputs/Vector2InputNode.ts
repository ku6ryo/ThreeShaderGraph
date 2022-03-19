import { createValidNumberLiteral } from "../../utils";
import { ShaderNode } from "../../ShaderNode";
import { ShaderDataType } from "../../data_types";

export class Vector2InputNode extends ShaderNode {

  constructor(id: string) {
    super(id, "Vector2Input")
    this.addOutSocket("Vector2InputNodeOut", ShaderDataType.Vector2)
  }

  generateCommonCode(): string {
    return ""
  }

  generateCode(): string {
    const outputs = this.getOutSockets()
    /*
    const x = this.#value.x
    const y = this.#value.y
    const parts = [x, y].map(createValidNumberLiteral).join(", ")
    return `
    vec2 ${outputs[0].getVeriableName()} = vec2(${parts});
    `
    */
    return ""
  }
}