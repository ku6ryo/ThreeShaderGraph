import { Vector4 } from "three"
import { ShaderNode } from "../../ShaderNode"
import { ShaderDataType } from "../../data_types"

export class Vector4InputNode extends ShaderNode {
  #value: Vector4 = new Vector4(0, 0, 0, 0)

  constructor(id: string) {
    super(id, "Vector4Input")
    this.addOutSocket("vector4InputNodeOut", ShaderDataType.Vector4)
  }

  getValue(): Vector4 {
    return this.#value
  }

  setValue(value: Vector4) {
    this.#value = value
  }

  generateFragCommonCode(): string {
    return ""
  }

  generateFragCode(): string {
    /*
    const outputs = this.getOutSockets()
    const x = this.#value.x
    const y = this.#value.y
    const z = this.#value.z
    const w = this.#value.w
    const parts = [x, y, z, w].map(createValidNumberLiteral).join(", ")
    return `
    vec4 ${outputs[0].getVarName()} = vec4(${parts});
    `
    */
    return ""
  }
}
