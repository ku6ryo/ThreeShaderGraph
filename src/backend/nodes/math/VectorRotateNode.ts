import { ShaderNode } from "../../ShaderNode"
import { ShaderDataType } from "../../data_types"

export class VectorRotateNode extends ShaderNode {
  constructor(id: string) {
    super(id, "Math_VectorRotate")
    this.addInSocket("v", ShaderDataType.Vector3)
    this.addInSocket("c", ShaderDataType.Vector3) // center
    this.addInSocket("ax", ShaderDataType.Vector3) // Axis
    this.addInSocket("an", ShaderDataType.Float) // Angle in radians
    this.addOutSocket("o", ShaderDataType.Vector3)
  }

  generateFragCode(): string {
    const id = this.getId()
    const v = this.getInSocket(0).getVarName()
    const c = this.getInSocket(1).getVarName()
    const ax = this.getInSocket(2).getVarName()
    const an = this.getInSocket(3).getVarName()
    const o = this.getOutSocket(0).getVarName()

    const svo = `svo${id}` // Shifted Vector origin
    const svt = `svt${id}` // Shifted Vector tip

    const tsvo = `tsvo${id}` // Trasformed shifted Vector origin
    const tsvt = `tsvt${id}` // Transformed shifted Vector tip

    const n = `n${id}` // normalized axis
    const q = `q${id}` // quaternion
    const m = `m${id}` // matrix
    return `
    vec3 ${svo} = - ${c};
    vec3 ${svt} = ${v} - ${c};

    vec3 ${n} = normalize(${ax});
    vec4 ${q} = vec4(sin(${an} / 2.) * ${n}.x, sin(${an} / 2.) * ${n}.y, sin(${an} / 2.) * ${n}.z, cos(${an} / 2.));
    mat3 ${m}; 
    ${m}[0][0] = 2. * (${q}.w * ${q}.w + ${q}.x * ${q}.x) - 1.;
    ${m}[0][1] = 2. * (${q}.x * ${q}.y - ${q}.w * ${q}.z);
    ${m}[0][2] = 2. * (${q}.x * ${q}.z + ${q}.w * ${q}.y);

    ${m}[1][0] = 2. * (${q}.x * ${q}.y + ${q}.w * ${q}.z);
    ${m}[1][1] = 2. * (${q}.w * ${q}.w + ${q}.y * ${q}.y) - 1.;
    ${m}[1][2] = 2. * (${q}.y * ${q}.z - ${q}.w * ${q}.x);

    ${m}[2][0] = 2. * (${q}.x * ${q}.z - ${q}.w * ${q}.y);
    ${m}[2][1] = 2. * (${q}.y * ${q}.z + ${q}.w * ${q}.x);
    ${m}[2][2] = 2. * (${q}.w * ${q}.w + ${q}.z * ${q}.z) - 1.;

    vec3 ${tsvo} = ${m} * ${svo};
    vec3 ${tsvt} = ${m} * ${svt};

    vec3 ${o} = ${tsvt} - ${tsvo};
    `
  }
}
