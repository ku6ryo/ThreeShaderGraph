import { ShaderDataType } from "./data_types"
import { BuiltIn, ShaderNode } from "./ShaderNode"
import { InNodeInputValue } from "../components/NodeBox"
import { Wire } from "./Wire"
import shortUUID from "short-uuid"

export class ShaderGraph {
  #nodes: ShaderNode[] = []
  #wires: Wire[] = []

  /**
   * Nodes that are effective. The order is sorted for code generation.
   */
  #resolvedNodes: ShaderNode[] = []

  #id: string

  constructor() {
    this.#id = shortUUID().generate()
    console.log("ShaderGraph created with id: " + this.#id)
  }

  /**
   * Adds a node to the graph.
   */
  addNode(node: ShaderNode) {
    if (this.#nodes.map(n => n.getId()).includes(node.getId())) {
      throw new Error("the same node id already exists : " + node.getId())
    }
    this.#nodes.push(node)
  }

  /**
   * Gets all nodes in the graph. 
   */
  getNodes(): ShaderNode[] {
    return [...this.#nodes]
  }

  getResolvedNodes(): ShaderNode[] {
    return [...this.#resolvedNodes]
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

  setInputValue(nodeId: string, socketIndex: number, value: InNodeInputValue) {
    console.log("graph " + this.#id + " set input value " + nodeId + " " + socketIndex + " " + value)
    const node = this.#resolvedNodes.find(n => n.getId() === nodeId)
    if (!node) {
      throw new Error("node not found")
    }
    node.setInputValue(socketIndex, value)
  }

  getBuiltIns(): BuiltIn[] {
    const builtInMap: Map<BuiltIn, boolean> = new Map()
    this.#resolvedNodes.forEach(n => {
      n.getBuiltIns().forEach(b => {
        builtInMap.set(b, true)
      })
    })
    return Array.from(builtInMap.keys()) as BuiltIn[]
  }

  /**
   * Resolve graph structure. Orders of nodes etc.
   */
  resolveGraph() {
    let outputNode: ShaderNode | null = null
    let outputNodeCount = 0
    this.#nodes.forEach(n => {
      if (n.isOutputNode()) {
        outputNode = n
        outputNodeCount++
      }
    })
    if (!outputNode) {
      throw new Error("No output node found")
    }
    if (outputNodeCount > 1) {
      throw new Error("More than one output node found")
    }

    const nodeMap: { [key: string]: ShaderNode } = {}
    const addNodeToMap = (n: ShaderNode, order: string) => {
      nodeMap[order] = n
      n.getInSockets().forEach((s, i) => {
        const nextOrder = order + Array(i + 1).fill("_")
        const wires = this.#wires.filter(w => {
          return w.getOutSocket() === s
        })
        if (wires.length > 1) {
          throw new Error("no wire or in socket has more than 1 wires connected to in socket " + s.getId())
        }
        if (wires.length === 0) {
          s.markConnected(false)
          return
        }
        s.markConnected(true)
        const wire = wires[0]
        const inSocket = wire.getInSocket()
        const nn = this.#nodes.find(n => {
          return n.getOutSockets().includes(inSocket)
        })
        if (!nn) {
          return
        }
        inSocket.markConnected(true)
        addNodeToMap(nn, nextOrder)
      }) 
    }
    addNodeToMap(outputNode as ShaderNode, "")
    const resolvedNodes: ShaderNode[] = []
    Object.keys(nodeMap).sort((a, b) => {
      return b.length - a.length
    }).forEach(k => {
      // Removes duplications.
      const n = nodeMap[k]
      if (!resolvedNodes.includes(n)) {
        resolvedNodes.push(n)
      }
    })
    this.#resolvedNodes = resolvedNodes
  }

  getUniformValueMap() {
    const values: { [key: string]: any } = {}
    this.getResolvedNodes().forEach(n => {
      n.getInSockets().forEach((s, i)=> {
        if (!s.connected() && n.getUniforms()[i]) {
          const { name, type, valueVector3, valueFloat, valueVector2, valueSampler2D, valueVector4 } = n.getUniforms()[i]
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

  generateVertCode(): string {
    let uniformCode = ""
    let header = ""
    let common = ""
    let main = ""

    let headerCodes: { [key: string]: string } = {}
    const builtInMap: Map<BuiltIn, boolean> = new Map()
    this.#resolvedNodes.forEach(n => {
      const cCode = n.generateVertCommonCode()
      if (cCode && !headerCodes[n.getTypeId()]) {
        header += cCode + "\n"
      }
      n.getBuiltIns().forEach(a => {
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

    if (builtInMap.get(BuiltIn.UV)) {
      header += `varying vec2 vUv;\n`
      common += "vUv = uv;\n"
    }
    if (builtInMap.get(BuiltIn.Normal)) {
      header += "varying vec3 vNormal;\n"
      common += "vNormal = normal;\n"
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

  generateFragCode(): string {
    let uniformCode = ""
    let header = ""
    let commonCode = ""
    let main = ""
    let headers: { [key: string]: string } = {}

    const builtInMap: Map<BuiltIn, boolean> = new Map()
    this.#resolvedNodes.forEach(n => {
      const cCode = n.generateFragCommonCode()
      headers[n.getTypeId()] = cCode + "\n"

      n.getBuiltIns().forEach(a => {
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
      oSockets.forEach(s => {
        const wires = this.#wires.filter(w => {
          return w.getInSocket() === s
        })
        wires.forEach(w => {
          main += w.generateCode()
        })
      })
    })

    if (builtInMap.get(BuiltIn.UV)) {
      header += `varying vec2 vUv;\n`
    }
    if (builtInMap.get(BuiltIn.Normal)) {
      header += `varying vec3 vNormal;\n`
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
}