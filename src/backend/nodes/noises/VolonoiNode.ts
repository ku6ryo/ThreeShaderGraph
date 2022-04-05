import { ShaderNode } from "../../ShaderNode"
import { ShaderDataType } from "../../data_types"

export class VolonoiNode extends ShaderNode {
  constructor(id: string) {
    super(id, "Noise_Volonoi")
    this.addInSocket("uv", ShaderDataType.Vector2)
    this.addInSocket("s", ShaderDataType.Float)
    this.setUniformValue(1, 10)
    this.addInSocket("r", ShaderDataType.Float)
    this.setUniformValue(2, 1)
    this.addOutSocket("d", ShaderDataType.Float)
  }

  generateFragCommonCode(): string {
    return `
vec2 volonoiRandom2(vec2 p) {
  return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

float volonoi(vec2 uv, float scale, float randomness) {
  vec2 st = uv * scale;
  vec2 i_st = floor(st);
  vec2 f_st = fract(st);
  float min_dist = 1.;

  for (int y= -1; y <= 1; y++) {
    for (int x= -1; x <= 1; x++) {
      vec2 neighbor = vec2(float(x),float(y));
      vec2 point = volonoiRandom2(0.5 + neighbor + i_st) * randomness + vec2(0.5) * (1. - randomness);
      vec2 diff = neighbor + point - f_st;
      float dist = length(diff);
      min_dist = min(min_dist, dist);
    }
  }
  return min_dist;
}
`
  }

  generateFragCode(): string {
    const i0 = this.getInSocket(0).getVarName()
    const i1 = this.getInSocket(1).getVarName()
    const i2 = this.getInSocket(2).getVarName()
    const o = this.getOutSocket(0).getVarName()
    return `
    float ${o} = volonoi(${i0}, ${i1}, ${i2});
    `
  }
}
