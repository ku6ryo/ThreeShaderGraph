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
    label: "Value 1",
  }, {
    label: "Value 2",
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
    label: "Value 1",
  }, {
    label: "Value 2",
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
    label: "Value 1",
  }, {
    label: "Value 2",
  }],
  outSockets: [{
    label: "Result",
  }],
}, {
  id: NodeTypeId.MathMultiply,
  name: "Multiply",
  category: mathCategory,
  inSockets: [{
    label: "Value 1",
  }, {
    label: "Value 2",
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
}]
