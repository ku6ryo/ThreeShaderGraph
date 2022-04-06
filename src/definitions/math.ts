import { Vector3 } from "three"
import { NodeTypeId } from "./NodeTypeId"
import {
  NodeCategory, NodeColor, NodeDefinition, NodeInputType,
} from "./types"

export const mathCategory: NodeCategory = {
  id: "math",
  label: "Math",
  icon: "calculator",
  color: NodeColor.Purple,
}

export const mathDefs: NodeDefinition[] = [{
  id: NodeTypeId.MathAdd,
  name: "Add",
  category: mathCategory,
  inSockets: [{
    label: "Value",
  }, {
    label: "Value",
  }],
  outSockets: [{
    label: "Result",
  }],
}, {
  id: NodeTypeId.MathSine,
  name: "Sine",
  category: mathCategory,
  inSockets: [{
    label: "Value",
  }],
  outSockets: [{
    label: "Result",
  }],
}, {
  id: NodeTypeId.MathCosine,
  name: "Cosine",
  category: mathCategory,
  inSockets: [{
    label: "Value",
  }],
  outSockets: [{
    label: "Result",
  }],
}, {
  id: NodeTypeId.MathTangent,
  name: "Tangent",
  category: mathCategory,
  inSockets: [{
    label: "Value",
  }],
  outSockets: [{
    label: "Result",
  }],
}, {
  id: NodeTypeId.MathArcsine,
  name: "Arcsine",
  category: mathCategory,
  inSockets: [{
    label: "Value",
  }],
  outSockets: [{
    label: "Result",
  }],
}, {
  id: NodeTypeId.MathArccosine,
  name: "Arccosine",
  category: mathCategory,
  inSockets: [{
    label: "Value",
  }],
  outSockets: [{
    label: "Result",
  }],
}, {
  id: NodeTypeId.MathArctangent,
  name: "Arctangent",
  category: mathCategory,
  inSockets: [{
    label: "Value",
  }],
  outSockets: [{
    label: "Result",
  }],
}, {
  id: NodeTypeId.MathDot,
  name: "Dot",
  category: mathCategory,
  inSockets: [{
    label: "Vector",
  }, {
    label: "Vector",
  }],
  outSockets: [{
    label: "Result",
  }],
}, {
  id: NodeTypeId.MathClamp,
  name: "Clamp",
  category: mathCategory,
  inSockets: [{
    label: "Value",
  }, {
    label: "Min",
    alternativeValueInputType: NodeInputType.Float,
    alternativeValue: {
      float: 0,
    },
  }, {
    label: "Max",
    alternativeValueInputType: NodeInputType.Float,
    alternativeValue: {
      float: 1,
    },
  }],
  outSockets: [{
    label: "Result",
  }],
}, {
  id: NodeTypeId.MathFrac,
  name: "Frac",
  category: mathCategory,
  inSockets: [{
    label: "Value",
  }],
  outSockets: [{
    label: "Result",
  }],
}, {
  id: NodeTypeId.MathSubtract,
  name: "Subtract",
  category: mathCategory,
  inSockets: [{
    label: "Value",
  }, {
    label: "Value",
  }],
  outSockets: [{
    label: "Result",
  }],
}, {
  id: NodeTypeId.MathMultiply,
  name: "Multiply",
  category: mathCategory,
  inSockets: [{
    label: "Value",
  }, {
    label: "Value",
  }],
  outSockets: [{
    label: "Result",
  }],
}, {
  id: NodeTypeId.MathCombine,
  name: "Combine",
  category: mathCategory,
  inSockets: [{
    label: "R",
  }, {
    label: "G",
  }, {
    label: "B",
  }, {
    label: "A",
  }],
  outSockets: [{
    label: "Vec",
  }],
}, {
  id: NodeTypeId.MathSeparate,
  name: "Separate",
  category: mathCategory,
  inSockets: [{
    label: "Vec",
  }],
  outSockets: [{
    label: "R",
  }, {
    label: "G",
  }, {
    label: "B",
  }, {
    label: "A",
  }],
}, {
  id: NodeTypeId.MathGreaterThan,
  name: "Greater Than",
  category: mathCategory,
  inSockets: [{
    label: "Value",
    alternativeValueInputType: NodeInputType.Float,
    alternativeValue: {
      float: 1,
    },
  }, {
    label: "Threshold",
    alternativeValueInputType: NodeInputType.Float,
    alternativeValue: {
      float: 0,
    },
  }],
  outSockets: [{
    label: "Result",
  }],
}, {
  id: NodeTypeId.MathLessThan,
  name: "Less Than",
  category: mathCategory,
  inSockets: [{
    label: "Value",
    alternativeValueInputType: NodeInputType.Float,
    alternativeValue: {
      float: 0,
    },
  }, {
    label: "Threshold",
    alternativeValueInputType: NodeInputType.Float,
    alternativeValue: {
      float: 1,
    },
  }],
  outSockets: [{
    label: "Result",
  }],
}, {
  id: NodeTypeId.MathInvert,
  name: "Invert",
  category: mathCategory,
  inSockets: [{
    label: "Vector",
  }],
  outSockets: [{
    label: "Result",
  }],
}, {
  id: NodeTypeId.MathVectorRotate,
  name: "Vector Rotate",
  category: mathCategory,
  inSockets: [{
    label: "Vector",
  }, {
    label: "Center",
    alternativeValueInputType: NodeInputType.Vector3,
    alternativeValue: {
      vec3: new Vector3(0, 0, 0),
    },
  }, {
    label: "Axis",
    alternativeValueInputType: NodeInputType.Vector3,
    alternativeValue: {
      vec3: new Vector3(0, 1, 0),
    },
  }, {
    label: "Angle",
    alternativeValueInputType: NodeInputType.Float,
    alternativeValue: {
      float: 0,
    },
  }],
  outSockets: [{
    label: "Vector",
  }],
}, {
  id: NodeTypeId.MathCross,
  name: "Cross",
  category: mathCategory,
  inSockets: [{
    label: "Vector",
    alternativeValueInputType: NodeInputType.Vector3,
    alternativeValue: {
      vec3: new Vector3(1, 0, 0),
    },
  }, {
    label: "Vector",
    alternativeValueInputType: NodeInputType.Vector3,
    alternativeValue: {
      vec3: new Vector3(0, 1, 0),
    },
  }],
  outSockets: [{
    label: "Result",
  }],
}, {
  id: NodeTypeId.MathNormalize,
  name: "Normalize",
  category: mathCategory,
  inSockets: [{
    label: "Vector",
  }],
  outSockets: [{
    label: "Result",
  }],
}, {
  id: NodeTypeId.MathLength,
  name: "Length",
  category: mathCategory,
  inSockets: [{
    label: "Vector",
  }],
  outSockets: [{
    label: "Result",
  }],
}, {
  id: NodeTypeId.MathDistance,
  name: "Distance",
  category: mathCategory,
  inSockets: [{
    label: "Vector",
  }, {
    label: "Vector",
  }],
  outSockets: [{
    label: "Result",
  }],
}, {
  id: NodeTypeId.MathAbs,
  name: "Abs",
  category: mathCategory,
  inSockets: [{
    label: "Value",
  }],
  outSockets: [{
    label: "Result",
  }],
}, {
  id: NodeTypeId.MathSign,
  name: "Sign",
  category: mathCategory,
  inSockets: [{
    label: "Value",
  }],
  outSockets: [{
    label: "Result",
  }],
}, {
  id: NodeTypeId.MathFloor,
  name: "Floor",
  category: mathCategory,
  inSockets: [{
    label: "Value",
  }],
  outSockets: [{
    label: "Result",
  }],
}, {
  id: NodeTypeId.MathCeil,
  name: "Ceil",
  category: mathCategory,
  inSockets: [{
    label: "Value",
  }],
  outSockets: [{
    label: "Result",
  }],
}, {
  id: NodeTypeId.MathMin,
  name: "Min",
  category: mathCategory,
  inSockets: [{
    label: "Value",
  }, {
    label: "Value",
  }],
  outSockets: [{
    label: "Result",
  }],
}, {
  id: NodeTypeId.MathMax,
  name: "Max",
  category: mathCategory,
  inSockets: [{
    label: "Value",
  }, {
    label: "Value",
  }],
  outSockets: [{
    label: "Result",
  }],
}, {
  id: NodeTypeId.MathMod,
  name: "Mod",
  category: mathCategory,
  inSockets: [{
    label: "Value",
  }, {
    label: "Value",
  }],
  outSockets: [{
    label: "Result",
  }],
}, {
  id: NodeTypeId.MathStep,
  name: "Step",
  category: mathCategory,
  inSockets: [{
    label: "Value",
  }, {
    label: "Edge",
  }],
  outSockets: [{
    label: "Result",
  }],
}, {
  id: NodeTypeId.MathSmoothstep,
  name: "Smoothstep",
  category: mathCategory,
  inSockets: [{
    label: "Value",
  }, {
    label: "Edge min",
  }, {
    label: "Edge max",
  }],
  outSockets: [{
    label: "Result",
  }],
}, {
  id: NodeTypeId.MathDivide,
  name: "Divide",
  category: mathCategory,
  inSockets: [{
    label: "Value",
  }, {
    label: "Value",
  }],
  outSockets: [{
    label: "Result",
  }],
}, {
  id: NodeTypeId.MathPow,
  name: "Power",
  category: mathCategory,
  inSockets: [{
    label: "Value",
  }, {
    label: "Value",
  }],
  outSockets: [{
    label: "Result",
  }],
}, {
  id: NodeTypeId.MathExp,
  name: "Exponent",
  category: mathCategory,
  inSockets: [{
    label: "Value",
  }],
  outSockets: [{
    label: "Result",
  }],
}, {
  id: NodeTypeId.MathExp2,
  name: "Power of 2",
  category: mathCategory,
  inSockets: [{
    label: "Value",
  }],
  outSockets: [{
    label: "Result",
  }],
}, {
  id: NodeTypeId.MathLog,
  name: "Logarithm",
  category: mathCategory,
  inSockets: [{
    label: "Value",
  }],
  outSockets: [{
    label: "Result",
  }],
}, {
  id: NodeTypeId.MathLog2,
  name: "Logarithm 2",
  category: mathCategory,
  inSockets: [{
    label: "Value",
  }],
  outSockets: [{
    label: "Result",
  }],
}, {
  id: NodeTypeId.MathSqrt,
  name: "Square root",
  category: mathCategory,
  inSockets: [{
    label: "Value",
  }],
  outSockets: [{
    label: "Result",
  }],
}, {
  id: NodeTypeId.MathRadians,
  name: "Deg to Rad",
  category: mathCategory,
  inSockets: [{
    label: "Value",
  }],
  outSockets: [{
    label: "Result",
  }],
}, {
  id: NodeTypeId.MathDegrees,
  name: "Rad to Deg",
  category: mathCategory,
  inSockets: [{
    label: "Value",
  }],
  outSockets: [{
    label: "Result",
  }],
}, {
  id: NodeTypeId.MathReflect,
  name: "Reflect",
  category: mathCategory,
  inSockets: [{
    label: "Vector",
  }, {
    label: "Normal",
  }],
  outSockets: [{
    label: "Result",
  }],
}, {
  id: NodeTypeId.MathRefract,
  name: "Refract",
  category: mathCategory,
  inSockets: [{
    label: "Vector",
  }, {
    label: "Normal",
  }, {
    label: "IOR ratio",
  }],
  outSockets: [{
    label: "Result",
  }],
}]
