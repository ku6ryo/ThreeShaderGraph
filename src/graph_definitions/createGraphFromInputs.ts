import { NodeProps, WireProps } from "../graph/Board/types";
import { ShaderDataType } from "../materials/graph/data_types";
import { ShaderGraph } from "../materials/graph/ShaderGraph";
import { ShaderNode } from "../materials/graph/ShaderNode";
import { FloatInputNode } from "../materials/graph/nodes/inputs/FloatInputNode";
import { UvInputNode } from "../materials/graph/nodes/inputs/UvInputNode";
import { AddNode } from "../materials/graph/nodes/math/AddNode";
import { PerlinNoiseNode } from "../materials/graph/nodes/noises/ParlinNoiseNode";
import { ColorOutputNode } from "../materials/graph/nodes/outputs/ColorOutputNode";
import { Wire } from "../materials/graph/Wire";
import { NodeTypeId } from "../graph_definitions/definitions/NodeTypeId";
import { SineNode } from "../materials/graph/nodes/math/SineNode";
import { CosineNode } from "../materials/graph/nodes/math/CosineNode";
import { TangentNode } from "../materials/graph/nodes/math/TangentNode";
import { DotNode } from "../materials/graph/nodes/math/DotNode";
import { SubtractNode } from "../materials/graph/nodes/math/SubtractNode";
import { FracNode } from "../materials/graph/nodes/math/FracNode";
import { MultiplyNode } from "../materials/graph/nodes/math/MultiplyNode";
import { TextureInputNode } from "../materials/graph/nodes/inputs/TextureInputNode";
import { SampleTextureNode } from "../materials/graph/nodes/texture/SampleTextureNode";
import { TimeInputNode } from "../materials/graph/nodes/inputs/TimeInputNode";
import { CombineNode } from "../materials/graph/nodes/math/CombineNode";
import { SeparateNode } from "../materials/graph/nodes/math/SeparateNode";
import { compileShaders } from "../materials/shader";


export function createGraphFromInputs(nodes: NodeProps[], wires: WireProps[]): ShaderGraph {
  const graph = new ShaderGraph()
  nodes.forEach(n => {
    let sn: ShaderNode | null = null
    // Input
    if (n.typeId === NodeTypeId.InputUv) {
      sn = new UvInputNode(n.id)
    }
    if (n.typeId === NodeTypeId.InputTime) {
      sn = new TimeInputNode(n.id)
    }
    if (n.typeId === NodeTypeId.InputFloat) {
      sn = (() => {
        const node = new FloatInputNode(n.id)
        node.setValue(1)
        return node
      })()
    }
    if (n.typeId === NodeTypeId.InputTexture) {
      sn = (() => {
        throw new Error("texture input not implemented")
        /*
        if (n.inNodeInputValues[0].image) {
          return new TextureInputNode(n.id, n.inNodeInputValues[0].image)
        } else {
        }
        */
      })()
    }
    // Output
    if (n.typeId === NodeTypeId.OutputColor) {
      sn = new ColorOutputNode(n.id)
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
    // Texture
    if (n.typeId === NodeTypeId.TexturePerlinNoise) {
      sn = new PerlinNoiseNode(n.id)
    }
    if (n.typeId === NodeTypeId.TextureSample) {
      sn = new SampleTextureNode(n.id)
    }

    if (sn) {
      sn.getInSockets().forEach((s, i) => {
        const aType = n.inSockets[i].alternativeValueInputType
      })
      graph.addNode(sn)
    }
  })
  wires.forEach(w => {
    const inNode = graph.getNodes().find(n => n.getId() === w.inNodeId)
    const outNode = graph.getNodes().find(n => n.getId() === w.outNodeId)
    if (inNode && outNode) {
      graph.addWire(
        new Wire(
          inNode.getOutSockets()[w.inSocketIndex],
          outNode.getInSockets()[w.outSocketIndex],
        )
      )
    } else {
      throw new Error("invalid wire")
    }
  })

  console.log(graph.getNodes())

  const vert = graph.generateVertCode()
  const frag = graph.generateFragCode()
  console.log(vert)
  console.log(frag)
  const gl = document.createElement("canvas").getContext("webgl")
  if (!gl) {
    throw new Error("webgl not supported")
  }
  // compileShaders(gl, vert, frag)
  return graph
}