import shortUUID from "short-uuid"
import {
  NodeProps, WireProps, cloneNodeProps, cloneWireProps, createNodeProps,
} from "./types"
import { NodeTypeId } from "../../definitions/NodeTypeId"
import { NodeDefinition } from "../../definitions/types"

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

  getNode(id: string) {
    const n = this.#nodeDict[id]
    if (!n) {
      throw new Error(`Node with id ${id} not found`)
    }
    return cloneNodeProps(n)
  }

  updateNode(node: NodeProps) {
    const index = this.#nodes.findIndex((n) => n.id === node.id)
    if (index === -1) {
      throw new Error(`Node with id ${node.id} not found`)
    }
    const n = cloneNodeProps(node)
    this.#nodes[index] = n
    this.updateNodes(this.#nodes)
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

  private static generateNodeId(type: NodeTypeId) {
    return `${type}_${shortUUID.generate()}`
  }

  private static generateWireId() {
    return shortUUID.generate()
  }

  selectAll() {
    this.updateNodes(this.getNodes().map((n) => ({ ...n, selected: true })))
  }

  unselectAll() {
    this.updateNodes(this.getNodes().map((n) => ({ ...n, selected: false })))
  }

  addNode(def: NodeDefinition, x: number, y: number) {
    const node = createNodeProps(NodeWireManager.generateNodeId(def.id), x, y, def)
    const n = cloneNodeProps(node)
    this.#nodes.push(n)
    this.#nodeDict[n.id] = n
    this.#updateId = shortUUID.generate()
    node.selected = true
    this.notifyUpdate()
    return node
  }

  duplicateSelected(): boolean {
    const placementOffset = 20
    const cloneNodeDict: { [id: string]: NodeProps } = {}
    this.#nodes.filter((n) => n.selected && !n.unique).forEach((n) => {
      n.selected = false
      const cn = cloneNodeProps(n)
      cn.id = NodeWireManager.generateNodeId(n.typeId)
      cn.selected = true
      cn.x = n.x + placementOffset
      cn.y = n.y + placementOffset
      cloneNodeDict[n.id] = cn
    })
    const cloneWireDict: { [id: string]: WireProps } = {}
    Object.keys(cloneNodeDict).forEach((oldNodeId) => {
      const cn = cloneNodeDict[oldNodeId]
      this.#wires.filter((w) => cloneNodeDict[w.inNodeId] && cloneNodeDict[w.outNodeId]).forEach((w) => {
        if (!cloneWireDict[w.id]) {
          const cw = cloneWireProps(w)
          cw.id = NodeWireManager.generateWireId()
          cw.inX = w.inX + placementOffset
          cw.inY = w.inY + placementOffset
          cw.outX = w.outX + placementOffset
          cw.outY = w.outY + placementOffset
          cloneWireDict[w.id] = cw
        }
        const cw = cloneWireDict[w.id]
        if (cw.inNodeId === oldNodeId) {
          cw.inNodeId = cn.id
        }
        if (cw.outNodeId === oldNodeId) {
          cw.outNodeId = cn.id
        }
      })
    })
    const newNodes = Object.values(cloneNodeDict)
    const newWires = Object.values(cloneWireDict)

    this.updateNodes([...this.#nodes, ...newNodes])
    this.updateWires([...this.#wires, ...newWires])
    return newNodes.length > 0
  }

  /**
   * @returns Whether any nodes were removed.
   */
  removeSelected(): boolean {
    const nodesToKeepDict: { [id: string]: NodeProps } = {}
    this.#nodes.forEach((n) => {
      if (!n.selected || !n.deletable) {
        nodesToKeepDict[n.id] = n
      }
    })
    const nodesToKeep = Object.values(nodesToKeepDict)
    if (this.#nodes.length === nodesToKeep.length) {
      return false
    }
    const wiresToKeepDict: { [id: string]: WireProps } = {}
    this.#wires.forEach((w) => {
      if (nodesToKeepDict[w.inNodeId] && nodesToKeepDict[w.outNodeId]) {
        wiresToKeepDict[w.id] = w
      }
    })
    this.#wires.forEach((w) => {
      const isWireKept = !!wiresToKeepDict[w.id]
      const outNode = nodesToKeepDict[w.outNodeId]
      if (!isWireKept && outNode) {
        outNode.inSockets[w.outSocketIndex].connected = false
      }
    })
    this.updateNodes(nodesToKeep)
    this.updateWires(Object.values(wiresToKeepDict))
    return true
  }
}
