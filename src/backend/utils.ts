import { ShaderDataType } from "./data_types"
import { Socket } from "./Socket"

export function validVariableName(name: string): boolean {
  return /^[a-zA-Z0-9_]+$/.test(name)
}

export function createValidNumberLiteral(v: number): string {
  return (v % 1) === 0 ? `${v}.` : `${v}`
}

export function isCompatibleSocketConnection(inSocket: Socket, outSocket: Socket): boolean {
  const i = inSocket.getType()
  const o = outSocket.getType()

  if (i === o) {
    return true
  }
  if (i === ShaderDataType.Sampler2D) {
    return o === ShaderDataType.Sampler2D
  }
  if (i === ShaderDataType.Float) {
    return o === ShaderDataType.Float || o === ShaderDataType.Vector2 || o === ShaderDataType.Vector3 || o === ShaderDataType.Vector4
  }
  if (i === ShaderDataType.Vector2) {
    return o === ShaderDataType.Float || o === ShaderDataType.Vector2 || o === ShaderDataType.Vector3 || o === ShaderDataType.Vector4
  }
  if (i === ShaderDataType.Vector3) {
    return o === ShaderDataType.Float || o === ShaderDataType.Vector2 || o === ShaderDataType.Vector3 || o === ShaderDataType.Vector4
  }
  if (i === ShaderDataType.Vector4) {
    return o === ShaderDataType.Float || o === ShaderDataType.Vector2 || o === ShaderDataType.Vector3 || o === ShaderDataType.Vector4
  }

  throw new Error(`Unsupported socket type? ${i} -> ${o}`)
}
