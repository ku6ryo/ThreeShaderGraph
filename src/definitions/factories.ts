import { mathFactories } from "./math"
import { textureFactories } from "./texture"
import { inputFactories } from "./input"
import { materialFactories } from "./material"
import { NodeFactory } from "../components/Board"

export const factories = ([] as NodeFactory[]).concat(
  mathFactories,
  textureFactories,
  inputFactories,
  materialFactories,
).sort((a, b) => a.name.localeCompare(b.name))