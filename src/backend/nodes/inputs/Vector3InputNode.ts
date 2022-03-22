import { Vector3 } from "three"
import { ShaderNode } from "../../ShaderNode"
import { ShaderDataType } from "../../data_types"

export class Vector3InputNode extends ShaderNode {
  #value: Vector3 = new Vector3(0, 0, 0)

  constructor(id: string) {
    super(id, "Vector3Input")
    this.addOutSocket("Vector3InputNodeOut", ShaderDataType.Vector3)
  }

  getValue(): Vector3 {
    return this.#value
  }

  setValue(value: Vector3) {
    this.#value = value
  }

  generateFragCode(): string {
    /*
    const outputs = this.getOutSockets()
    const x = this.#value.x
    const y = this.#value.y
    const z = this.#value.z
    const parts = [x, y, z].map(createValidNumberLiteral).join(", ")
    return `
    vec3 ${outputs[0].getVarName()} = vec3(${parts});
    `
    */
    return ""
  }
}
