import { NodeProps, WireProps } from "./index"

type EditHistory = {
  nodes: { [key: string]: NodeProps },
  wires: { [key: string]: WireProps },
}

export class HistoryManager {

  #maxHistories
  #index: number = 0
  #histories: EditHistory[] = []

  constructor(maxHistories = 100) {
    this.#maxHistories = maxHistories
    this.#histories.push({ nodes: {}, wires: {} })
  }

  getCurrent(): EditHistory {
    return this.#histories[this.#index]
  }

  goBack(): EditHistory | null {
    if (this.#index > 0) {
      this.#index--
      return this.#histories[this.#index]
    } else {
      return null
    }
  }

  getIndex(): number {
    return this.#index
  }

  save = (nodes: NodeProps[], wires: WireProps[]) => {
    console.log("save", this.#index + 1)
    const nodeDict: { [key: string]: NodeProps } = {}
    const wireDict: { [key: string]: WireProps } = {}
    nodes.forEach(node => {
      nodeDict[node.id] = { ...node }
    })
    wires.forEach(wire => {
      wireDict[wire.id] = { ...wire }
    })
    const newHistory = {
      nodes: nodeDict,
      wires: wireDict,
    }
    if (this.#index == this.#maxHistories) {
      this.#histories.shift()
      this.#histories[this.#index] = newHistory
    } else {
      this.#histories[this.#index + 1] = newHistory
      this.#index = this.#index + 1
    }
  }
}