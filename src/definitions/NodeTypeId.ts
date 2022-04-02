export enum NodeTypeId {
  // Input
  InputUv = "input_uv",
  InputVertexPosition = "input_vertex_position",
  InputFloat = "input_float",
  InputVector3 = "input_vector3",
  InputTexture = "input_texture",
  InputTime = "input_time",
  InputColor = "input_color",
  // Built-in Materials
  Material_Lambert = "material_lambert",
  Material_Phong = "material_phong",
  // Math
  MathAdd = "math_add",
  MathMultiply = "math_multiply",
  MathSubtract = "math_subtract",
  MathFrac = "math_frac",
  MathDot = "math_dot",
  MathClamp = "math_clamp",
  MathSine = "math_sine",
  MathCosine = "math_cosine",
  MathTangent = "math_tangent",
  MathCombine = "math_combine",
  MathSeparate = "math_separate",
  MathGreaterThan = "math_greaterThan",
  MathLessThan = "math_lessThan",
  MathVectorRotate = "math_vectorRotate",
  MathInvert = "math_invert",
  // Output
  OutputColor = "output_color",
  // Texture
  TextureSample = "texture_sample",
  TexturePerlinNoise = "texture_perlin_noise",
}
