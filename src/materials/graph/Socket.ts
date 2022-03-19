import { ShaderDataType } from "./data_types";

export class Socket {
  #id: string;
  #type: ShaderDataType;
  #overriddenVariableName: string | null = null;
  #connected = false;

  constructor(id: string, type: ShaderDataType) {
    this.#id = id;
    this.#type = type
  }

  getId() {
    return this.#id
  }

  getType(): ShaderDataType {
    return this.#type
  }

  getVeriableName(): string {
    return this.#overriddenVariableName || `${this.#id}`
  }

  getUniformValiableName(): string {
    return `u_${this.#id}`
  }

  markConnected(connected: boolean) {
    this.#connected = connected
  }

  connected() {
    return this.#connected
  }

  /**
   * Forces to use the given variable name instead of the default one. 
   * This can be used for uniform names.
   */
  overrideVariableName(name: string) {
    this.#overriddenVariableName = name
  }

  /**
   * Stops overriding the variable name.
   */
  clearVariableNameOverride() {
    this.#overriddenVariableName = null
  }
}