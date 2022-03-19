import { mathFactories } from "./math"
import { textureFactories } from "./texture"
import { outputFactories } from "./output"
import { inputFactories } from "./input"
import { NodeFactory } from "../../graph/Board"

export const factories = ([] as NodeFactory[]).concat(
  mathFactories,
  textureFactories,
  outputFactories,
  inputFactories
).sort((a, b) => a.name.localeCompare(b.name))