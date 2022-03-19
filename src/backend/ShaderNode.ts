import { Vector2 } from "three";
import { Vector3 } from "three";
import { Vector4 } from "three";
import { validVariableName } from "./utils";
import { Socket } from "./Socket";
import { ShaderDataType } from "./data_types";

export type Uniform = {
  type: ShaderDataType;
  name: string;
  valueSampler2D?: HTMLImageElement;
  valueFloat?: number;
  valueVector2?: Vector2;
  valueVector3?: Vector3;
  valueVector4?: Vector4;
}

export enum AttributeType {
  UV = "uv",
}

export abstract class ShaderNode {
  // Unique id for this node
  #id: string;
  // ID to distinguish node types.
  #typeId: string;

  // Input parameter sockets
  #inSockets: Socket[] = [];
  // Output parameter sockets
  #outSockets: Socket[] = [];

  #uniforms: Uniform[] = []

  #isOutputNode: boolean

  /**
   * Attribute types to use. UV, Vertex color etc.
   */
  #attributes: AttributeType[] = []

  #needsUniformUpdateOnDraw = false

  constructor(
    id: string,
    typeId: string,
    attributes: AttributeType[] = [],
    isOutputNode: boolean = false,
    needsUniformUpdatesOnDraw: boolean = false
  ) {
    if (!validVariableName(id)) {
      throw new Error(`Invalid node id: ${id}`)
    }
    if (!validVariableName(typeId)) {
      throw new Error(`Invalid node typeId: ${typeId}`)
    }
    this.#id = id;
    this.#typeId = typeId;
    this.#attributes = attributes
    this.#isOutputNode = isOutputNode
    this.#needsUniformUpdateOnDraw = needsUniformUpdatesOnDraw
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

  needsUniformUpdatesOnDraw() {
    return this.#needsUniformUpdateOnDraw
  }
  
  updateOnDraw() {}
  
  protected createSocket(name: string, type: ShaderDataType) {
    if (!validVariableName(name)) {
      throw new Error(`Invalid socket name: ${name}`)
    }
    return new Socket(this.#id + "_" + name, type)
  }

  protected addInSocket(name: string, type: ShaderDataType) {
    const socket = this.createSocket(name, type)
    this.#inSockets.push(socket)
    this.#uniforms.push({
      type,
      name: socket.getUniformVarName(),
    })
  }

  getInSockets(): Socket[] {
    return [...this.#inSockets]
  }

  protected addOutSocket(name: string, type: ShaderDataType) {
    this.#outSockets.push(this.createSocket(name, type))
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

  setUniformValue(index: number, value: number): void;
  setUniformValue(index: number, value: Vector2): void;
  setUniformValue(index: number, value: Vector3): void;
  setUniformValue(index: number, value: Vector4): void;
  setUniformValue(index: number, value: HTMLImageElement): void;
  setUniformValue(index: number, value: HTMLImageElement | number | Vector2 | Vector3 | Vector4): void {
    const u = this.#uniforms[index]
    if (!u) {
      throw new Error(`Uniform index ${index} does not exist`)
    }
    if (value instanceof HTMLImageElement) {
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

  getAttributes() {
    return [...this.#attributes]
  }

  abstract generateCommonCode(): string;

  abstract generateCode(): string
}