type Rect = {
  x: number,
  y: number,
  width: number,
  height: number,
}

/**
 * Checks if two rect are overlapping.
 */
function isOverlapped(r1: Rect, r2: Rect) {
  return !(r1.x + r1.width < r2.x || r1.x > r2.x + r2.width || r1.y + r1.height < r2.y || r1.y > r2.y + r2.height)
}

export class NodeRectsManager {
  #map = new Map<string, Rect>()

  get(id: string): Rect | null {
    return this.#map.get(id) || null
  }

  set(id: string, rect: Rect) {
    this.#map.set(id, rect)
  }

  isOverlapped(id: string, rect: Rect) {
    const target = this.get(id)
    if (!target) {
      throw new Error(`NodeRectsManager: target node ${id} not found`)
    }
    return isOverlapped(target, rect)
  }

  getIds() {
    return Array.from(this.#map.keys())
  }

  getAll() {
    return Array.from(this.#map.values())
  }
}
