import shortUUID from "short-uuid"
import {
  Texture, Vector2, Vector3, Vector4,
} from "three"
import { ShaderDataType } from "./data_types"
import { BuiltIn, ShaderNode } from "./ShaderNode"
import { Wire } from "./Wire"
import { isCompatibleSocketConnection } from "./utils"
import { NodeInputValue } from "../definitions/types"

export class CircularReferenceError extends Error {
  nodeOutId: string

  nodeInId: string

  wireId: string

  constructor(nodeOutId: string, nodeInId: string, wireId: string) {
    super(`Circular reference detected: ${nodeInId} -> ${nodeOutId}`)

    this.nodeInId = nodeInId
    this.nodeOutId = nodeOutId
    this.wireId = wireId
  }
}

export class IncompatibleSocketConnectionError extends Error {
  nodeOutId: string

  nodeInId: string

  wireId: string

  constructor(nodeOutId: string, nodeInId: string, wireId: string) {
    super(`Incompatible connection detected: ${nodeInId} -> ${nodeOutId}`)
    this.nodeInId = nodeInId
    this.nodeOutId = nodeOutId
    this.wireId = wireId
  }
}

export class ShaderGraph {
  #nodes: ShaderNode[] = []

  #wires: Wire[] = []

  #id: string

  constructor() {
    this.#id = shortUUID().generate()
    console.log(`ShaderGraph created with id: ${this.#id}`)
  }

  /**
   * Adds a node to the graph.
   */
  addNode(node: ShaderNode) {
    if (this.#nodes.map((n) => n.getId()).includes(node.getId())) {
      throw new Error(`the same node id already exists : ${node.getId()}`)
    }
    this.#nodes.push(node)
  }

  /**
   * Gets all nodes in the graph.
   */
  getNodes(): ShaderNode[] {
    return [...this.#nodes]
  }

  hasNode(nodeId: string): boolean {
    return !!this.#nodes.find((n) => n.getId() === nodeId)
  }

  /**
   * Addes a wire to the graph.
   */
  addWire(wire: Wire) {
    this.#wires.push(wire)
  }

  /**
   * Gets all wires in the graph.
   */
  getWires(): Wire[] {
    return [...this.#wires]
  }

  setInputValue(nodeId: string, socketIndex: number, value: NodeInputValue) {
    const node = this.#nodes.find((n) => n.getId() === nodeId)
    if (!node) {
      throw new Error("node not found")
    }
    node.setInputValue(socketIndex, value)
  }

  getBuiltIns(): BuiltIn[] {
    const builtInMap: Map<BuiltIn, boolean> = new Map()
    this.#nodes.forEach((n) => {
      n.getBuiltIns().forEach((b) => {
        builtInMap.set(b, true)
      })
    })
    return Array.from(builtInMap.keys()) as BuiltIn[]
  }

  /**
   * Resolve graph structure. Orders of nodes etc.
   */
  resolve() {
    let outputNode: ShaderNode | null = null
    let outputNodeCount = 0
    this.#nodes.forEach((n) => {
      if (n.isOutputNode()) {
        outputNode = n
        outputNodeCount += 1
      }
    })
    if (!outputNode) {
      throw new Error("No output node found")
    }
    if (outputNodeCount > 1) {
      throw new Error("More than one output node found")
    }

    const nodeMap: { [key: string]: ShaderNode } = {}
    const routeMap: { [key: string]: string[] } = {}

    // Check routes and calculate the order to generate code.
    // And also finds one of circular references if exists.
    const addNodeToMap = (n: ShaderNode, order: string, prevN: ShaderNode | null, wire: Wire | null) => {
      if (routeMap[n.getId()]) {
        if (prevN && wire) {
          routeMap[n.getId()].forEach((o) => {
            if (order.indexOf(o) === 0) {
              throw new CircularReferenceError(prevN.getId(), n.getId(), wire.getId())
            }
          })
        }
        routeMap[n.getId()].push(order)
      } else {
        routeMap[n.getId()] = [order]
      }
      nodeMap[order] = n
      n.getInSockets().forEach((s, i) => {
        const nextOrder = order + i// Array(i + 1).fill("_")
        const wires = this.#wires.filter((w) => w.getOutSocket() === s)
        if (wires.length > 1) {
          throw new Error(`no wire or in socket has more than 1 wires connected to in socket ${s.getId()}`)
        }
        if (wires.length === 0) {
          s.markConnected(false)
          return
        }
        s.markConnected(true)
        const wire = wires[0]
        const inSocket = wire.getInSocket()
        const nn = this.#nodes.find((node) => node.getOutSockets().includes(inSocket))
        if (!nn) {
          throw new Error(`no node found which has the input socket. socket id: ${inSocket.getId()}`)
        }
        if (!isCompatibleSocketConnection(inSocket, s)) {
          throw new IncompatibleSocketConnectionError(n.getId(), nn.getId(), wire.getId())
        }
        inSocket.markConnected(true)
        addNodeToMap(nn, nextOrder, n, wire)
      })
    }
    addNodeToMap(outputNode as ShaderNode, "1", null, null)
    const resolvedNodes: ShaderNode[] = []
    Object.keys(nodeMap).sort((a, b) => Number(b) - Number(a)).forEach((k) => {
      // Removes duplications.
      const n = nodeMap[k]
      console.log(k, n.getId())
      if (!resolvedNodes.includes(n)) {
        resolvedNodes.push(n)
      }
    })
    this.#nodes = resolvedNodes
  }

  getUniformValueMap() {
    const values: { [key: string]: any } = {}
    this.getNodes().forEach((n) => {
      n.getInSockets().forEach((s, i) => {
        if (!s.connected() && n.getUniforms()[i]) {
          const {
            name, type, valueVector3, valueFloat, valueVector2, valueSampler2D, valueVector4,
          } = n.getUniforms()[i]
          if (type === ShaderDataType.Float && valueFloat !== undefined) {
            values[name] = valueFloat
          }
          if (type === ShaderDataType.Vector2 && valueVector2) {
            values[name] = valueVector3
          }
          if (type === ShaderDataType.Vector3 && valueVector3) {
            values[name] = valueVector3
          }
          if (type === ShaderDataType.Vector4 && valueVector4) {
            values[name] = valueVector4
          }
          if (type === ShaderDataType.Sampler2D && valueSampler2D) {
            values[name] = valueSampler2D
          }
        }
      })
    })
    return values
  }

  vert(): string {
    let uniformCode = ""
    let header = ""
    let common = ""
    let main = ""

    const headers: { [key: string]: string } = {}
    const builtInMap: Map<BuiltIn, boolean> = new Map()
    this.#nodes.forEach((n) => {
      headers[n.getTypeId()] = n.generateVertCommonCode()

      n.getBuiltIns().forEach((a) => {
        builtInMap.set(a, true)
      })
      n.getUniforms().forEach((u, i) => {
        if (n.getInSockets()[i].connected()) {
          return
        }
        uniformCode += `uniform ${u.type} ${u.name};\n`
      })
      main += n.generateVertCode()
    })

    header += Object.values(headers).join("\n")

    if (builtInMap.get(BuiltIn.UV)) {
      header += "varying vec2 vUv;\n"
      common += "vUv = uv;\n"
    }
    if (builtInMap.get(BuiltIn.Normal)) {
      header += "varying vec3 vNormal;\n"
      common += "vNormal = normal;\n"
    }
    if (builtInMap.get(BuiltIn.VertexPositon)) {
      header += "varying vec3 vPosition;\n"
      common += "vPosition = position;\n"
    }
    return `
${uniformCode}
${header}
void main()
{
${common}
${main}
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}
`
  }

  frag(): string {
    let uniformCode = ""
    let header = ""
    let main = ""
    const headers: { [key: string]: string } = {}

    const builtInMap: Map<BuiltIn, boolean> = new Map()
    this.#nodes.forEach((n) => {
      headers[n.getTypeId()] = n.generateFragCommonCode()

      n.getBuiltIns().forEach((a) => {
        builtInMap.set(a, true)
      })
      n.getUniforms().forEach((u, i) => {
        if (n.getInSockets()[i].connected()) {
          return
        }
        uniformCode += `uniform ${u.type} ${u.name};\n`
      })
      main += n.generateFragCode()
      const oSockets = n.getOutSockets()
      oSockets.forEach((s) => {
        const wires = this.#wires.filter((w) => w.getInSocket() === s)
        wires.forEach((w) => {
          main += w.generateCode()
        })
      })
    })

    if (builtInMap.get(BuiltIn.UV)) {
      header += "varying vec2 vUv;\n"
    }
    if (builtInMap.get(BuiltIn.Normal)) {
      header += "varying vec3 vNormal;\n"
    }
    if (builtInMap.get(BuiltIn.VertexPositon)) {
      header += "varying vec3 vPosition;\n"
    }
    header += Object.values(headers).join("\n")
    return `
${uniformCode}
${header}

void main() {
${main}
}
    `
  }

  js() {
    let code = ""
    const vert = this.vert()
    const frag = this.frag()
    code += `
const vert = \`
${vert}
\`
`
    code += `
const frag = \`
${frag}
\`
`
    const uMap = this.getUniformValueMap()
    code += "const myUniforms = {\n"
    Object.keys(uMap).forEach((name) => {
      const value = uMap[name]
      if (typeof value === "number") {
        code += `  "${name}": new THREE.Uniform(${value}),\n`
      }
      if (value instanceof Vector2) {
        code += `  "${name}": new THREE.Uniform(new THREE.Vector2(${value.x}, ${value.y})),\n`
      }
      if (value instanceof Vector3) {
        code += `  "${name}": new THREE.Uniform(new THREE.Vector3(${value.x}, ${value.y}, ${value.z})),\n`
      }
      if (value instanceof Vector4) {
        code += `  "${name}": new THREE.Uniform(new THREE.Vector4(${value.x}, ${value.y}, ${value.z}, ${value.w})),\n`
      }
      if (value instanceof Texture) {
        code += `  "${name}": null, // Please set your texture e.g. new THREE.Uniform(new THREE.Texture([your image element]))\n`
      }
    })
    code += "}\n"

    code += "\n"
    code += `
const yourMaterial = new THREE.ShaderMaterial({
  vertexShader: vert,
  fragmentShader: frag,
  uniforms: THREE.UniformsUtils.merge([
    THREE.UniformsLib.lights,
    myUniforms,
  ]),
  lights: true,
})
`
    return code
  }
}
