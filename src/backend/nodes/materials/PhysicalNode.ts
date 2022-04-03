import { Vector4 } from "three"
import { BuiltIn, ShaderNode } from "../../ShaderNode"
import { ShaderDataType } from "../../data_types"

export class PhysicalNode extends ShaderNode {
  constructor(id: string) {
    super(id, "Material_Physical", [BuiltIn.DirectionalLight])
    this.addInSocket("diffuse", ShaderDataType.Vector4)
    this.setUniformValue(0, new Vector4(1, 1, 1, 1))
    this.addInSocket("emissive", ShaderDataType.Vector4)
    this.setUniformValue(1, new Vector4())
    this.addInSocket("roughness", ShaderDataType.Float)
    this.setUniformValue(2, 0.5)
    this.addInSocket("metalness", ShaderDataType.Float)
    this.setUniformValue(3, 0.5)
    this.addInSocket("reflectivity", ShaderDataType.Float)
    this.setUniformValue(4, 0.5)
    this.addInSocket("clearcoat", ShaderDataType.Float)
    this.setUniformValue(5, 0.5)
    this.addInSocket("clearcoatRoughness", ShaderDataType.Float)
    this.setUniformValue(6, 0)
    this.addInSocket("opacity", ShaderDataType.Float)
    this.setUniformValue(7, 1)
    this.addOutSocket("color", ShaderDataType.Vector4)
  }

  generateVertCommonCode(): string {
    return `
#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
  varying vec3 vWorldPosition;
#endif
#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <displacementmap_pars_vertex>
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
#include <shadowmap_vertex>
#include <fog_vertex>
#ifdef USE_TRANSMISSION
  vWorldPosition = worldPosition.xyz;
#endif
    `
  }

  generateFragCommonCode(): string {
    return `
#define STANDARD
#ifdef PHYSICAL
  #define IOR
  #define SPECULAR
#endif

#ifdef IOR
	uniform float ior;
#endif
#ifdef SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULARINTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
	#ifdef USE_SPECULARCOLORMAP
		uniform sampler2D specularColorMap;
	#endif
#endif

#ifdef USE_SHEEN
  uniform vec3 sheenColor;
  uniform float sheenRoughness;
  #ifdef USE_SHEENCOLORMAP
    uniform sampler2D sheenColorMap;
  #endif
  #ifdef USE_SHEENROUGHNESSMAP
    uniform sampler2D sheenRoughnessMap;
  #endif
#endif
varying vec3 vViewPosition;
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
#include <bsdfs>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

vec4 builtIn_PhysicalMaterial(
  vec3 diffuse,
  vec3 emissive,
  float roughness,
  float metalness,
  float reflectivity,
  float clearcoat,
  float clearcoatRoughness,
  float opacity
) {

  #include <clipping_planes_fragment>
  vec4 diffuseColor = vec4( diffuse, opacity );
  ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
  vec3 totalEmissiveRadiance = emissive;
  #include <logdepthbuf_fragment>
  #include <map_fragment>
  #include <color_fragment>
  #include <alphamap_fragment>
  #include <alphatest_fragment>
  #include <roughnessmap_fragment>
  #include <metalnessmap_fragment>
  #include <normal_fragment_begin>
  #include <normal_fragment_maps>
  #include <clearcoat_normal_fragment_begin>
  #include <clearcoat_normal_fragment_maps>
  #include <emissivemap_fragment>
  // accumulation
  #include <lights_physical_fragment>
  #include <lights_fragment_begin>
  #include <lights_fragment_maps>
  #include <lights_fragment_end>
  // modulation
  #include <aomap_fragment>
  vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
  vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;

  #include <transmission_fragment>
  vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
  #ifdef USE_SHEEN
    // Sheen energy compensation approximation calculation can be found at the end of
    // https://drive.google.com/file/d/1T0D1VSyR4AllqIJTQAraEIzjlb5h4FKH/view?usp=sharing
    float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
    outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecular;
  #endif
  #ifdef USE_CLEARCOAT
    float dotNVcc = saturate( dot( geometry.clearcoatNormal, geometry.viewDir ) );
    vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
    outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + clearcoatSpecular * material.clearcoat;
  #endif
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
    const i5 = this.getInSocket(5)
    const i6 = this.getInSocket(6)
    const i7 = this.getInSocket(7)
    const o = this.getOutSocket(0)
    return `
    vec4 ${o.getVarName()} = builtIn_PhysicalMaterial(
      ${i0.getVarName()}.rgb,
      ${i1.getVarName()}.rgb,
      ${i2.getVarName()},
      ${i3.getVarName()},
      ${i4.getVarName()},
      ${i5.getVarName()},
      ${i6.getVarName()},
      ${i7.getVarName()}
    );
`
  }
}
