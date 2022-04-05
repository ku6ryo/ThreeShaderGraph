import { BuiltIn, ShaderNode } from "../../ShaderNode"
import { ShaderDataType } from "../../data_types"
import { Vector4 } from "three"

export class LambertNode extends ShaderNode {
  constructor(id: string) {
    super(id, "Material_Lambert", [BuiltIn.Normal, BuiltIn.DirectionalLight])
    this.addInSocket("diffuse", ShaderDataType.Vector4)
    this.setUniformValue(0, new Vector4(1, 1, 1, 1))
    this.addInSocket("emissive", ShaderDataType.Vector4)
    this.setUniformValue(0, new Vector4())
    this.addOutSocket("color", ShaderDataType.Vector4)
  }

  generateVertCommonCode(): string {
    return `
      varying vec3 vViewPosition;
    `
  }

  generateVertCode(): string {
    return `
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = mvPosition.xyz;
    `
  }

  generateFragCommonCode(): string {
    return `
      varying vec3 vViewPosition;

      #include <common>
      #include <bsdfs>
      #include <lights_pars_begin>

vec4 builtIn_lambertMaterial(vec3 diffuse, vec3 emissive) {

  vec3 mvPosition = vViewPosition;
  vec3 transformedNormal = vNormal;


  GeometricContext geometry;
  geometry.position = mvPosition.xyz;
  geometry.normal = normalize(transformedNormal);
  geometry.viewDir = (normalize(-mvPosition.xyz));


  vec3 lightFront = vec3(0.0);
  vec3 indirectFront = vec3(0.0);
  IncidentLight directLight;
  float dotNL;
  vec3 directLightColor_Diffuse;
  #if NUM_POINT_LIGHTS > 0
  #pragma unroll_loop
  for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
    getPointLightInfo(pointLights[ i ], geometry, directLight);
    dotNL = dot(geometry.normal, directLight.direction);
    directLightColor_Diffuse = PI * directLight.color;
    lightFront += saturate(dotNL) * directLightColor_Diffuse;
  }
  #endif
  #if NUM_SPOT_LIGHTS > 0
  #pragma unroll_loop
  for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
    getSpotDirectLightIrradiance(spotLights[ i ], geometry, directLight);
    dotNL = dot(geometry.normal, directLight.direction);
    directLightColor_Diffuse = PI * directLight.color;
    lightFront += saturate(dotNL) * directLightColor_Diffuse;
  }
  #endif
  #if NUM_DIR_LIGHTS > 0
  #pragma unroll_loop
  for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
    getDirectionalLightInfo(directionalLights[ i ], geometry, directLight);
    dotNL = dot(geometry.normal, directLight.direction);
    directLightColor_Diffuse = PI * directLight.color;
    lightFront += saturate(dotNL) * directLightColor_Diffuse;
  }
  #endif
  #if NUM_HEMI_LIGHTS > 0
  #pragma unroll_loop
  for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
    indirectFront += getHemisphereLightIrradiance( hemisphereLights[ i ], geometry );
  }
  #endif

  // ref: https://github.com/mrdoob/three.js/blob/dev/src/renderers/shaders/ShaderLib/meshlambert_frag.glsl.js
  vec4 diffuseColor = vec4(diffuse, 1.0);
  ReflectedLight reflectedLight = ReflectedLight(vec3(0.0), vec3(0.0), vec3(0.0), vec3(0.0));
  vec3 totalEmissiveRadiance = emissive;
  reflectedLight.indirectDiffuse = getAmbientLightIrradiance(ambientLightColor);
  reflectedLight.indirectDiffuse += indirectFront;
  reflectedLight.indirectDiffuse *= BRDF_Lambert(diffuseColor.rgb);
  reflectedLight.directDiffuse = lightFront;
  reflectedLight.directDiffuse *= BRDF_Lambert(diffuseColor.rgb);
  vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
  return vec4(outgoingLight, diffuseColor.a);
}
    `
  }

  generateFragCode(): string {
    const i0 = this.getInSocket(0).getVarName()
    const i1 = this.getInSocket(1).getVarName()
    const o = this.getOutSocket(0).getVarName()
    return `
    vec4 ${o} = builtIn_lambertMaterial(${i0}.rgb, ${i1}.rgb);
    `
  }
}
