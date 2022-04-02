import { mathDefs } from "./math"
import { textureDefs } from "./texture"
import { inputDefs } from "./input"
import { materialDefs } from "./material"
import { NodeDefinition } from "./types"

export const definitions = ([] as NodeDefinition[]).concat(
  mathDefs,
  textureDefs,
  inputDefs,
  materialDefs,
).sort((a, b) => a.name.localeCompare(b.name))
