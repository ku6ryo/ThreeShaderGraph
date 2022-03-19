import { ShaderDataType } from "./data_types"
import { Socket } from "./Socket"

export class Wire {
  #inSocket: Socket
  #outSocket: Socket

  constructor(inSocket: Socket, outSocket: Socket) {
    this.#inSocket = inSocket
    this.#outSocket = outSocket
  }

  getInSocket(): Socket {
    return this.#inSocket
  }

  getOutSocket(): Socket {
    return this.#outSocket
  }

  protected createError(message: string) {
    return new Error(message + 
      ` in: ${this.#inSocket.getId()} / ${this.#inSocket.getType()} out: ${this.#outSocket.getId()} / ${this.#outSocket.getType()}`
    )
  }

  generateCode(): string {
    const iType = this.#inSocket.getType()
    const iVar = this.#inSocket.getVeriableName()
    const oType = this.#outSocket.getType()
    const oVar = this.#outSocket.getVeriableName()

    if (iType === ShaderDataType.Sampler2D) {
      if (oType !== ShaderDataType.Sampler2D) {
        throw this.createError("Sampler2D can only be connected to Sampler2D")
      } else {
        this.#outSocket.overrideVariableName(iVar)
        return ""
      }
    }

    if (iType === oType) {
      return `${oType} ${oVar} = ${iVar};\n`
    }
    // float
    if (iType === ShaderDataType.Float && oType === ShaderDataType.Vector2) {
      return `vec2 ${oVar} = vec2(${iVar});\n`
    }
    if (iType === ShaderDataType.Float && oType === ShaderDataType.Vector3) {
      return `vec3 ${oVar} = vec3(${iVar});\n`
    }
    if (iType === ShaderDataType.Float && oType === ShaderDataType.Vector4) {
      return `vec4 ${oVar} = vec4(${iVar});\n`
    }
    // vec2
    if (iType === ShaderDataType.Vector2 && oType === ShaderDataType.Float) {
      return `float ${oVar} = ${iVar}.x;\n`
    }
    if (iType === ShaderDataType.Vector2 && oType === ShaderDataType.Vector3) {
      return `vec3 ${oVar} = vec3(${iVar}, 0.0);\n`
    }
    if (iType === ShaderDataType.Vector2 && oType === ShaderDataType.Vector4) {
      return `vec4 ${oVar} = vec4(${iVar}, 0.0, 0.0);\n`
    }
    // vec3
    if (iType === ShaderDataType.Vector3 && oType === ShaderDataType.Float) {
      return `float ${oVar} = ${iVar}.x;\n`
    }
    if (iType === ShaderDataType.Vector3 && oType === ShaderDataType.Vector2) {
      return `vec2 ${oVar} = vec2(${iVar}.x, ${iVar}.y);\n`
    }
    if (iType === ShaderDataType.Vector3 && oType === ShaderDataType.Vector4) {
      return `vec4 ${oVar} = vec4(${iVar}, 0.0);\n`
    }
    // vec4
    if (iType === ShaderDataType.Vector4 && oType === ShaderDataType.Float) {
      return `float ${oVar} = ${iVar}.x;\n`
    }
    if (iType === ShaderDataType.Vector4 && oType === ShaderDataType.Vector2) {
      return `vec2 ${oVar} = vec2(${iVar}.x, ${iVar}.y);\n`
    }
    if (iType === ShaderDataType.Vector4 && oType === ShaderDataType.Vector3) {
      return `vec3 ${oVar} = vec3(${iVar}.x, ${iVar}.y, ${iVar}.z);\n`
    }
    throw this.createError("Unsupported connection type")
  }
}