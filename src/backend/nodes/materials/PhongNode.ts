import { Vector4 } from "three"
import { BuiltIn, ShaderNode } from "../../ShaderNode"
import { ShaderDataType } from "../../data_types"

export class PhongNode extends ShaderNode {
  constructor(id: string) {
    super(id, "Material_Phong", [BuiltIn.DirectionalLight])
    this.addInSocket("diffuse", ShaderDataType.Vector4)
    this.setUniformValue(0, new Vector4())
    this.addInSocket("emissive", ShaderDataType.Vector4)
    this.setUniformValue(1, new Vector4())
    this.addInSocket("specular", ShaderDataType.Vector4)
    this.setUniformValue(2, new Vector4())
    this.addInSocket("shininess", ShaderDataType.Float)
    this.setUniformValue(3, 1)
    this.addInSocket("opacity", ShaderDataType.Float)
    this.setUniformValue(4, 1)
    this.addOutSocket("color", ShaderDataType.Vector4)
  }

  generateVertCommonCode(): string {
    return `
#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
    `
  }

  generateVertCode(): string {
    return `
#include <uv_vertex>
#include <uv2_vertex>
#include <color_vertex>
#include <morphcolor_vertex>
#include <beginnormal_vertex>
#include <morphnormal_vertex>
#include <skinbase_vertex>
#include <skinnormal_vertex>
#include <defaultnormal_vertex>
#include <normal_vertex>
#include <begin_vertex>
#include <morphtarget_vertex>
#include <skinning_vertex>
#include <displacementmap_vertex>
#include <project_vertex>
#include <logdepthbuf_vertex>
#include <clipping_planes_vertex>
vViewPosition = - mvPosition.xyz;
#include <worldpos_vertex>
#include <envmap_vertex>
#include <shadowmap_vertex>
#include <fog_vertex>
    `
  }

  generateFragCommonCode(): string {
    return `
#define PHONG

#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

vec4 builtIn_PhongMaterial(vec3 diffuse, vec3 emissive, vec3 specular, float shininess, float opacity) {
  #include <clipping_planes_fragment>
  vec4 diffuseColor = vec4( diffuse, opacity );
  ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
  vec3 totalEmissiveRadiance = emissive;
  #include <logdepthbuf_fragment>
  #include <map_fragment>
  #include <color_fragment>
  #include <alphamap_fragment>
  #include <alphatest_fragment>
  #include <specularmap_fragment>
  #include <normal_fragment_begin>
  #include <normal_fragment_maps>
  #include <emissivemap_fragment>
  #include <lights_phong_fragment>
  #include <lights_fragment_begin>
  #include <lights_fragment_maps>
  #include <lights_fragment_end>
  #include <aomap_fragment>
  vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
  #include <envmap_fragment>
  #include <output_fragment>
  #include <tonemapping_fragment>
  #include <encodings_fragment>
  #include <fog_fragment>
  #include <premultiplied_alpha_fragment>
  #include <dithering_fragment>

  return vec4(outgoingLight, opacity);
}
    `
  }

  generateFragCode(): string {
    const i0 = this.getInSocket(0)
    const i1 = this.getInSocket(1)
    const i2 = this.getInSocket(2)
    const i3 = this.getInSocket(3)
    const i4 = this.getInSocket(4)
    const o = this.getOutSocket(0)
    return `
  vec4 ${o.getVarName()} = builtIn_PhongMaterial(
    ${i0.getVarName()}.rgb,
    ${i1.getVarName()}.rgb,
    ${i2.getVarName()}.rgb,
    ${i3.getVarName()},
    ${i4.getVarName()}
  );
`
  }
}
