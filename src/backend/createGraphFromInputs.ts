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
import { ColorInputNode } from "./nodes/inputs/ColorInputNode"
import { VertexPositionNode } from "./nodes/inputs/VertexPositionNode"
import { VectorRotateNode } from "./nodes/math/VectorRotateNode"
import { Vector3InputNode } from "./nodes/inputs/Vector3InputNode"
import { InvertNode } from "./nodes/math/InvertNode"
import { ClampNode } from "./nodes/math/ClampNode"
import { ArcsineNode } from "./nodes/math/ArcsineNode"
import { ArctangentNode } from "./nodes/math/ArctangentNode"
import { ArccosineNode } from "./nodes/math/ArccosineNode"
import { PhysicalNode } from "./nodes/materials/PhysicalNode"
import { NormalNode } from "./nodes/inputs/NormalNode"

export function createGraphFromInputs(nodes: NodeProps[], wires: WireProps[]): ShaderGraph {
  const graph = new ShaderGraph()
  nodes.forEach((n) => {
    let sn: ShaderNode | null = null
    // Input
    if (n.typeId === NodeTypeId.InputUv) {
      sn = new UvInputNode(n.id)
    }
    if (n.typeId === NodeTypeId.InputVertexPosition) {
      sn = new VertexPositionNode(n.id)
    }
    if (n.typeId === NodeTypeId.InputTime) {
      sn = new TimeInputNode(n.id)
    }
    if (n.typeId === NodeTypeId.InputFloat) {
      sn = new FloatInputNode(n.id)
    }
    if (n.typeId === NodeTypeId.InputVector3) {
      sn = new Vector3InputNode(n.id)
    }
    if (n.typeId === NodeTypeId.InputTexture) {
      sn = new TextureInputNode(n.id)
    }
    if (n.typeId === NodeTypeId.InputColor) {
      sn = new ColorInputNode(n.id)
    }
    if (n.typeId === NodeTypeId.InputNormal) {
      sn = new NormalNode(n.id)
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
    if (n.typeId === NodeTypeId.MathArcsine) {
      sn = new ArcsineNode(n.id, ShaderDataType.Vector4)
    }
    if (n.typeId === NodeTypeId.MathArccosine) {
      sn = new ArccosineNode(n.id, ShaderDataType.Vector4)
    }
    if (n.typeId === NodeTypeId.MathArctangent) {
      sn = new ArctangentNode(n.id, ShaderDataType.Vector4)
    }
    if (n.typeId === NodeTypeId.MathDot) {
      sn = new DotNode(n.id, ShaderDataType.Vector4)
    }
    if (n.typeId === NodeTypeId.MathClamp) {
      sn = new ClampNode(n.id, ShaderDataType.Vector4)
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
    if (n.typeId === NodeTypeId.MathVectorRotate) {
      sn = new VectorRotateNode(n.id)
    }
    if (n.typeId === NodeTypeId.MathInvert) {
      sn = new InvertNode(n.id)
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
    if (n.typeId === NodeTypeId.Material_Physical) {
      sn = new PhysicalNode(n.id)
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
          w.id,
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

  graph.resolve()
  const vert = graph.vert()
  const frag = graph.frag()
  console.log(vert)
  console.log(frag)
  return graph
}
