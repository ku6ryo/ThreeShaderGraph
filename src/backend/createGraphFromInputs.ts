import { NodeProps, WireProps } from "../components/Board/types"
import { ShaderDataType } from "./data_types"
import { ShaderGraph } from "./ShaderGraph"
import { ShaderNode } from "./ShaderNode"
import { FloatInputNode } from "./nodes/inputs/FloatInputNode"
import { UvInputNode } from "./nodes/inputs/UvInputNode"
import { AddNode } from "./nodes/math/AddNode"
import { PerlinNoiseNode } from "./nodes/noises/ParlinNoiseNode"
import { FragColorOutputNode } from "./nodes/outputs/FragColorOutputNode"
import { Wire } from "./Wire"
import { NodeTypeId } from "../definitions/NodeTypeId"
import { SineNode } from "./nodes/math/SineNode"
import { CosineNode } from "./nodes/math/CosineNode"
import { TangentNode } from "./nodes/math/TangentNode"
import { DotNode } from "./nodes/math/DotNode"
import { SubtractNode } from "./nodes/math/SubtractNode"
import { FracNode } from "./nodes/math/FracNode"
import { MultiplyNode } from "./nodes/math/MultiplyNode"
import { TextureInputNode } from "./nodes/inputs/TextureInputNode"
import { SampleTextureNode } from "./nodes/texture/SampleTextureNode"
import { TimeInputNode } from "./nodes/inputs/TimeInputNode"
import { CombineNode } from "./nodes/math/CombineNode"
import { SeparateNode } from "./nodes/math/SeparateNode"
import { GreaterThanNode } from "./nodes/math/GreaterThanNode"
import { LessThanNode } from "./nodes/math/LessThanNode"
import { LambertNode } from "./nodes/materials/LambertNode"
import { PhongNode } from "./nodes/materials/PhongNode"

export function createGraphFromInputs(nodes: NodeProps[], wires: WireProps[]): ShaderGraph {
  const graph = new ShaderGraph()
  nodes.forEach((n) => {
    let sn: ShaderNode | null = null
    // Input
    if (n.typeId === NodeTypeId.InputUv) {
      sn = new UvInputNode(n.id)
    }
    if (n.typeId === NodeTypeId.InputTime) {
      sn = new TimeInputNode(n.id)
    }
    if (n.typeId === NodeTypeId.InputFloat) {
      sn = new FloatInputNode(n.id)
    }
    if (n.typeId === NodeTypeId.InputTexture) {
      sn = new TextureInputNode(n.id)
    }
    // Output
    if (n.typeId === NodeTypeId.OutputColor) {
      sn = new FragColorOutputNode(n.id)
    }
    // Math
    if (n.typeId === NodeTypeId.MathAdd) {
      sn = new AddNode(n.id, ShaderDataType.Vector4)
    }
    if (n.typeId === NodeTypeId.MathSine) {
      sn = new SineNode(n.id, ShaderDataType.Vector4)
    }
    if (n.typeId === NodeTypeId.MathCosine) {
      sn = new CosineNode(n.id, ShaderDataType.Vector4)
    }
    if (n.typeId === NodeTypeId.MathTangent) {
      sn = new TangentNode(n.id, ShaderDataType.Vector4)
    }
    if (n.typeId === NodeTypeId.MathDot) {
      sn = new DotNode(n.id, ShaderDataType.Vector4)
    }
    if (n.typeId === NodeTypeId.MathMultiply) {
      sn = new MultiplyNode(n.id, ShaderDataType.Vector4)
    }
    if (n.typeId === NodeTypeId.MathSubtract) {
      sn = new SubtractNode(n.id, ShaderDataType.Vector4)
    }
    if (n.typeId === NodeTypeId.MathFrac) {
      sn = new FracNode(n.id, ShaderDataType.Vector4)
    }
    if (n.typeId === NodeTypeId.MathCombine) {
      sn = new CombineNode(n.id)
    }
    if (n.typeId === NodeTypeId.MathSeparate) {
      sn = new SeparateNode(n.id)
    }
    if (n.typeId === NodeTypeId.MathGreaterThan) {
      sn = new GreaterThanNode(n.id)
    }
    if (n.typeId === NodeTypeId.MathLessThan) {
      sn = new LessThanNode(n.id)
    }
    // Texture
    if (n.typeId === NodeTypeId.TexturePerlinNoise) {
      sn = new PerlinNoiseNode(n.id)
    }
    if (n.typeId === NodeTypeId.TextureSample) {
      sn = new SampleTextureNode(n.id)
    }
    // Materials
    if (n.typeId === NodeTypeId.Material_Lambert) {
      sn = new LambertNode(n.id)
    }
    if (n.typeId === NodeTypeId.Material_Phong) {
      sn = new PhongNode(n.id)
    }

    if (sn) {
      n.inSockets.forEach((s, i) => {
        if (s.alternativeValueInputType && s.alternativeValue) {
          sn!.setInputValue(i, s.alternativeValue)
        }
      })
      graph.addNode(sn)
    }
  })

  wires.forEach((w) => {
    const inNode = graph.getNodes().find((n) => n.getId() === w.inNodeId)
    const outNode = graph.getNodes().find((n) => n.getId() === w.outNodeId)
    if (inNode && outNode) {
      graph.addWire(
        new Wire(
          inNode.getOutSocket(w.inSocketIndex),
          outNode.getInSocket(w.outSocketIndex),
        ),
      )
    } else {
      console.log(inNode)
      console.log(outNode)
      throw new Error("invalid wire")
    }
  })

  graph.resolveGraph()
  const vert = graph.generateVertCode()
  const frag = graph.generateFragCode()
  console.log(vert)
  console.log(frag)
  return graph
}
