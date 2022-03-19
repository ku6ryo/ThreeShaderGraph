import shortUUID from "short-uuid";
import { NodeProps, WireProps } from "./types";


export class NodeWireManager {

  #id = shortUUID.generate()
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
      this.#onUpdate(this.#id)
    }
  }

  getUpdateId() {
    return this.#id
  }

  getNodes() {
    return [...this.#nodes]
  }

  getNode(id: string) {
    const n = this.#nodeDict[id]
    if (!n) {
      throw new Error(`Node with id ${id} not found`)
    }
    return n
  }

  updateNodes(nodes: NodeProps[]) {
    this.#nodes = [...nodes]
    const dict: { [id: string]: NodeProps } = {}
    nodes.forEach(n => {
      dict[n.id] = n
    })
    this.#nodeDict = dict
    this.#id = shortUUID.generate()
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
    wires.forEach(w => {
      dict[w.id] = w
    })
    this.#wireDict = dict
    this.#id = shortUUID.generate()
    this.notifyUpdate()
  }
}