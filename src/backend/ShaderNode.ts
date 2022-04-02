import {
  Texture, Vector2, Vector3, Vector4,
} from "three"
import { validVariableName } from "./utils"
import { Socket } from "./Socket"
import { ShaderDataType } from "./data_types"
import { NodeInputValue } from "../definitions/types"

export type Uniform = {
  type: ShaderDataType;
  name: string;
  valueSampler2D?: Texture;
  valueFloat?: number;
  valueVector2?: Vector2;
  valueVector3?: Vector3;
  valueVector4?: Vector4;
}

export enum BuiltIn {
  VertexPositon = "VertPosition",
  Normal = "normal",
  UV = "uv",
  DirectionalLight = "DirectionalLight",
}

export class UniformValueNotSetError extends Error {}

export abstract class ShaderNode {
  // Unique id for this node
  #id: string

  // ID to distinguish node types.
  #typeId: string

  // Input parameter sockets
  #inSockets: Socket[] = []

  // Output parameter sockets
  #outSockets: Socket[] = []

  #uniforms: Uniform[] = []

  #isOutputNode: boolean

  /**
   * Built-in types to use. UV, Vertex color etc.
   */
  #builtIns: BuiltIn[] = []

  constructor(
    id: string,
    typeId: string,
    builtIns: BuiltIn[] = [],
    isOutputNode: boolean = false,
  ) {
    if (!validVariableName(id)) {
      throw new Error(`Invalid node id: ${id}`)
    }
    if (!validVariableName(typeId)) {
      throw new Error(`Invalid node typeId: ${typeId}`)
    }
    this.#id = id
    this.#typeId = typeId
    this.#builtIns = builtIns
    this.#isOutputNode = isOutputNode
  }

  getId() {
    return this.#id
  }

  getTypeId() {
    return this.#typeId
  }

  isOutputNode() {
    return this.#isOutputNode
  }

  updateOnDraw() {}

  protected createSocket(name: string, type: ShaderDataType) {
    if (!validVariableName(name)) {
      throw new Error(`Invalid socket name: ${name}`)
    }
    return new Socket(`${this.#id}_${name}`, type)
  }

  protected addInSocket(name: string, type: ShaderDataType) {
    const socket = this.createSocket(name, type)
    this.#inSockets.push(socket)
    this.#uniforms.push({
      type,
      name: socket.getUniformVarName(),
    })
  }

  getInSocket(index: number): Socket {
    const s = this.#inSockets[index]
    if (!s) {
      throw new Error(`In socket index ${index} does not exist`)
    }
    return s
  }

  getInSockets(): Socket[] {
    return [...this.#inSockets]
  }

  protected addOutSocket(name: string, type: ShaderDataType) {
    this.#outSockets.push(this.createSocket(name, type))
  }

  getOutSocket(index: number): Socket {
    const s = this.#outSockets[index]
    if (!s) {
      throw new Error(`Out socket index ${index} does not exist`)
    }
    return s
  }

  getOutSockets(): Socket[] {
    return [...this.#outSockets]
  }

  getUniforms(): Uniform[] {
    return [...this.#uniforms]
  }

  getUnifromName(index: number) {
    const u = this.#uniforms[index]
    if (!u) {
      throw new Error(`Uniform index ${index} does not exist`)
    }
    if (!u.name) {
      throw new Error(`Uniform index ${index} does not have a name`)
    }
    return u.name
  }

  protected setUniformValue(index: number, value: number): void;

  protected setUniformValue(index: number, value: Vector2): void;

  protected setUniformValue(index: number, value: Vector3): void;

  protected setUniformValue(index: number, value: Vector4): void;

  protected setUniformValue(index: number, value: Texture): void;

  protected setUniformValue(index: number, value: Texture | number | Vector2 | Vector3 | Vector4): void {
    const u = this.#uniforms[index]
    if (!u) {
      throw new Error(`Uniform index ${index} does not exist. Node: ${this.#id}`)
    }
    if (value instanceof Texture) {
      u.valueSampler2D = value
    } else if (typeof value === "number") {
      u.valueFloat = value
    } else if (value instanceof Vector2) {
      u.valueVector2 = value
    } else if (value instanceof Vector3) {
      u.valueVector3 = value
    } else if (value instanceof Vector4) {
      u.valueVector4 = value
    } else {
      throw new Error("value is not supported type")
    }
  }

  setInputValue(index: number, value: NodeInputValue): void {
    const u = this.#uniforms[index]
    if (!u) {
      throw new Error(`Uniform index ${index} does not exist. Node: ${this.#id}`)
    }
    if (u.type === ShaderDataType.Float) {
      if (value.float === undefined) {
        throw new UniformValueNotSetError("float value is not set")
      }
      u.valueFloat = value.float
    }
    if (u.type === ShaderDataType.Vector2) {
      if (value.vec2 === undefined) {
        throw new UniformValueNotSetError("vec2 value is not set")
      }
      u.valueVector2 = value.vec2
    }
    if (u.type === ShaderDataType.Vector3) {
      if (value.vec3 === undefined) {
        throw new UniformValueNotSetError("vec3 value is not set")
      }
      u.valueVector3 = value.vec3
    }
    if (u.type === ShaderDataType.Vector4) {
      if (value.vec4 === undefined) {
        throw new UniformValueNotSetError("vec4 value is not set")
      }
      u.valueVector4 = value.vec4
    }
    if (u.type === ShaderDataType.Sampler2D) {
      if (value.image === undefined) {
        throw new UniformValueNotSetError("Image value is not set")
      }
      u.valueSampler2D = value.image
    }
  }

  getBuiltIns() {
    return [...this.#builtIns]
  }

  generateVertCommonCode(): string {
    return ""
  }

  generateFragCommonCode(): string {
    return ""
  }

  generateVertCode(): string {
    return ""
  }

  generateFragCode(): string {
    return ""
  }
}
