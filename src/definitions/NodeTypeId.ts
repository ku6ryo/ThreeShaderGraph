export enum NodeTypeId {
  // Input
  InputUv = "input_uv",
  InputFloat = "input_float",
  InputTexture = "input_texture",
  InputTime = "input_time",
  // Math
  MathAdd = "math_add",
  MathMultiply = "math_multiply",
  MathSubtract = "math_subtract",
  MathFrac = "math_frac",
  MathDot = "math_dot",
  MathSine = "math_sine",
  MathCosine = "math_cosine",
  MathTangent = "math_tangent",
  MathCombine = "math_combine",
  MathSeparate = "math_separate",
  // Output
  OutputColor = "output_color",
  // Texture
  TextureSample = "texture_sample",
  TexturePerlinNoise = "texture_perlin_noise",
}