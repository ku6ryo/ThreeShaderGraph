/*
import { Camera } from "../../renderer/Camera";
import { Thing } from "../../renderer/Thing";
import { BasicProgram } from "../BasicProgram"
import { ShaderGraph } from "../graph/ShaderGraph"
import { AttributeType } from "../graph/ShaderNode";
import { ShaderDataType } from "../graph/data_types";

export class ShaderGraphProgram extends BasicProgram {
  #graph: ShaderGraph;

  constructor(gl: WebGLRenderingContext, graph: ShaderGraph) {
    super(
      gl,
      graph.generateVertCode(),
      graph.generateFragCode(),
      {
        useUv: (() => {
          let useUv = false;
          graph.getNodes().forEach(node => {
            useUv = useUv || node.getAttributes().includes(AttributeType.UV)
          })
          return useUv
        })()
      }
    );
    if (!this.hasCompilationError()) {
      console.log("gee")
      graph.getNodes().forEach(n => {
        n.getUniforms().forEach((u, i) => {
          const name = u.name
          if (!name) {
            throw new Error("Uniform name is not set")
          }
          console.log(n)
          if (n.getInSockets()[i].used()) {
            return
          }
          if (u.type === ShaderDataType.Sampler2D) {
            this.createTextureLocation(name, 0)
          } else {
            this.createUniformLocation(name)
          }
        })
      })
    }
    this.#graph = graph
  }

  preDraw(_: Camera, __: Thing): void {
    this.#graph.getResolvedNodes().forEach(n => {
      n.updateOnDraw()
      n.getUniforms().forEach((u) => {
        if (!u.name) {
          throw new Error("Uniform name is not set")
        }
        if (u.type === ShaderDataType.Sampler2D) {
          if (!u.valueSampler2D) {
            throw new Error("texture is not set")
          }
          this.setTextureValue(u.name, u.valueSampler2D)
        } else if (u.type === ShaderDataType.Float) {
          this.setFloatUniformValue(u.name, u.valueFloat || 0)
          // TODO implement other uniforms
        }
      })
    })
  }
}
*/