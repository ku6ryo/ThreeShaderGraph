import shortUUID from "short-uuid"
import { NodeProps, WireProps } from "./types"

export class NodeWireManager {
  #updateId = shortUUID.generate()

  #nodes: NodeProps[] = []

  #nodeDict: { [id: string]: NodeProps } = {}

  #wires: WireProps[] = []

  #wireDict: { [id: string]: WireProps } = {}

  #onUpdate: null | ((updateId: string) => void) = null

  setOnUpdate(onUpdate: (updateId: string) => void) {
    this.#onUpdate = onUpdate
  }

  private notifyUpdate() {
    if (this.#onUpdate) {
      this.#onUpdate(this.#updateId)
    }
  }

  getUpdateId() {
    return this.#updateId
  }

  getNodes() {
    return [...this.#nodes]
  }

  addNode(node: NodeProps) {
    const n = NodeWireManager.cloneNode(node)
    this.#nodes.push(n)
    this.#nodeDict[n.id] = n
    this.#updateId = shortUUID.generate()
    this.notifyUpdate()
  }

  getNode(id: string) {
    const n = this.#nodeDict[id]
    if (!n) {
      throw new Error(`Node with id ${id} not found`)
    }
    return NodeWireManager.cloneNode(n)
  }

  updateNode(node: NodeProps) {
    const index = this.#nodes.findIndex((n) => n.id === node.id)
    if (index === -1) {
      throw new Error(`Node with id ${node.id} not found`)
    }
    const n = NodeWireManager.cloneNode(node)
    this.#nodes[index] = n
    this.updateNodes(this.#nodes)
  }

  private static cloneNode(node: NodeProps) {
    const inSockets = node.inSockets.map((s) => ({ ...s }))
    const outSockets = node.outSockets.map((s) => ({ ...s }))
    const newNode = { ...node, outSockets, inSockets }
    return newNode
  }

  updateNodes(nodes: NodeProps[]) {
    this.#nodes = [...nodes]
    const dict: { [id: string]: NodeProps } = {}
    nodes.forEach((n) => {
      dict[n.id] = n
    })
    this.#nodeDict = dict
    this.#updateId = shortUUID.generate()
    this.notifyUpdate()
  }

  getWires() {
    return [...this.#wires]
  }

  getWire(id: string) {
    const w = this.#wireDict[id]
    if (!w) {
      throw new Error(`Wire with id ${id} not found`)
    }
    return w
  }

  updateWires(wires: WireProps[]) {
    this.#wires = [...wires]
    const dict: { [id: string]: WireProps } = {}
    wires.forEach((w) => {
      dict[w.id] = w
    })
    this.#wireDict = dict
    this.#updateId = shortUUID.generate()
    this.notifyUpdate()
  }
}
