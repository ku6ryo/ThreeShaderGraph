import { NodeTypeId } from "./NodeTypeId"
import { InNodeInputType, NodeColor } from "../components/NodeBox"
import { NodeCategory } from "./types"
import { NodeBlueprint } from "../components/Board/types"
import { Vector3 } from "three"

export const mathCategory: NodeCategory = {
  id: "math",
  label: "Math",
  icon: "calculator",
}

export const mathFactories = [{
  id: NodeTypeId.MathAdd,
  name: "Add",
  category: mathCategory,
  factory: () => ({
    color: NodeColor.Blue,
    inNodeInputSlots: [],
    inSockets: [{
      label: "Value 1",
    }, {
      label: "Value 2",
    }],
    outSockets: [{
      label: "Result",
    }],
  } as NodeBlueprint),
}, {
  id: NodeTypeId.MathSine,
  name: "Sine",
  category: mathCategory,
  factory: () => ({
    color: NodeColor.Blue,
    inNodeInputSlots: [],
    inSockets: [{
      label: "Value",
    }],
    outSockets: [{
      label: "Result",
    }],
  } as NodeBlueprint),
}, {
  id: NodeTypeId.MathCosine,
  name: "Cosine",
  category: mathCategory,
  factory: () => ({
    color: NodeColor.Blue,
    inNodeInputSlots: [],
    inSockets: [{
      label: "Value",
    }],
    outSockets: [{
      label: "Result",
    }],
  } as NodeBlueprint),
}, {
  id: NodeTypeId.MathTangent,
  name: "Tangent",
  category: mathCategory,
  factory: () => ({
    color: NodeColor.Blue,
    inNodeInputSlots: [],
    inSockets: [{
      label: "Value",
    }],
    outSockets: [{
      label: "Result",
    }],
  } as NodeBlueprint),
}, {
  id: NodeTypeId.MathDot,
  name: "Dot",
  category: mathCategory,
  factory: () => ({
    color: NodeColor.Blue,
    inNodeInputSlots: [],
    inSockets: [{
      label: "Value 1",
    }, {
      label: "Value 2",
    }],
    outSockets: [{
      label: "Result",
    }],
  } as NodeBlueprint),
}, {
  id: NodeTypeId.MathClamp,
  name: "Clamp",
  category: mathCategory,
  factory: () => ({
    color: NodeColor.Blue,
    inNodeInputSlots: [],
    inSockets: [{
      label: "Value",
    }, {
      label: "Min",
      alternativeValueInputType: InNodeInputType.Float,
      alternativeValue: {
        float: 0,
      }
    }, {
      label: "Max",
      alternativeValueInputType: InNodeInputType.Float,
      alternativeValue: {
        float: 1,
      }
    }],
    outSockets: [{
      label: "Result",
    }],
  } as NodeBlueprint),
}, {
  id: NodeTypeId.MathFrac,
  name: "Frac",
  category: mathCategory,
  factory: () => ({
    color: NodeColor.Blue,
    inNodeInputSlots: [],
    inSockets: [{
      label: "Value",
    }],
    outSockets: [{
      label: "Result",
    }],
  } as NodeBlueprint),
}, {
  id: NodeTypeId.MathSubtract,
  name: "Subtract",
  category: mathCategory,
  factory: () => ({
    color: NodeColor.Blue,
    inNodeInputSlots: [],
    inSockets: [{
      label: "Value 1",
    }, {
      label: "Value 2",
    }],
    outSockets: [{
      label: "Result",
    }],
  } as NodeBlueprint),
}, {
  id: NodeTypeId.MathMultiply,
  name: "Multiply",
  category: mathCategory,
  factory: () => ({
    color: NodeColor.Blue,
    inNodeInputSlots: [],
    inSockets: [{
      label: "Value 1",
    }, {
      label: "Value 2",
    }],
    outSockets: [{
      label: "Result",
    }],
  } as NodeBlueprint),
}, {
  id: NodeTypeId.MathCombine,
  name: "Combine",
  category: mathCategory,
  factory: () => ({
    color: NodeColor.Blue,
    inNodeInputSlots: [],
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
  } as NodeBlueprint),
}, {
  id: NodeTypeId.MathSeparate,
  name: "Separate",
  category: mathCategory,
  factory: () => ({
    color: NodeColor.Blue,
    inNodeInputSlots: [],
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
  } as NodeBlueprint),
}, {
  id: NodeTypeId.MathGreaterThan,
  name: "Greater Than",
  category: mathCategory,
  factory: () => ({
    color: NodeColor.Blue,
    inNodeInputSlots: [],
    inSockets: [{
      label: "Value",
      alternativeValueInputType: InNodeInputType.Float,
      alternativeValue: {
        float: 1,
      }
    }, {
      label: "Threshold",
      alternativeValueInputType: InNodeInputType.Float,
      alternativeValue: {
        float: 0,
      }
    }],
    outSockets: [{
      label: "Result",
    }],
  } as NodeBlueprint),
}, {
  id: NodeTypeId.MathLessThan,
  name: "Less Than",
  category: mathCategory,
  factory: () => ({
    color: NodeColor.Blue,
    inNodeInputSlots: [],
    inSockets: [{
      label: "Value",
      alternativeValueInputType: InNodeInputType.Float,
      alternativeValue: {
        float: 0,
      }
    }, {
      label: "Threshold",
      alternativeValueInputType: InNodeInputType.Float,
      alternativeValue: {
        float: 1,
      }
    }],
    outSockets: [{
      label: "Result",
    }],
  } as NodeBlueprint),
}, {
  id: NodeTypeId.MathInvert,
  name: "Invert",
  category: mathCategory,
  factory: () => ({
    color: NodeColor.Blue,
    inNodeInputSlots: [],
    inSockets: [{
      label: "Vector",
    }],
    outSockets: [{
      label: "Result",
    }],
  } as NodeBlueprint),
}, {
  id: NodeTypeId.MathVectorRotate,
  name: "Vector Rotate",
  category: mathCategory,
  factory: () => ({
    color: NodeColor.Blue,
    inNodeInputSlots: [],
    inSockets: [{
      label: "Vector",
    }, {
      label: "Center",
      alternativeValueInputType: InNodeInputType.Vector3,
      alternativeValue: {
        vec3: new Vector3(0, 0, 0),
      }
    }, {
      label: "Axis",
      alternativeValueInputType: InNodeInputType.Vector3,
      alternativeValue: {
        vec3: new Vector3(0, 1, 0),
      }
    }, {
      label: "Angle",
      alternativeValueInputType: InNodeInputType.Float,
      alternativeValue: {
        float: 0,
      }
    }],
    outSockets: [{
      label: "Vector",
    }],
  } as NodeBlueprint),
}]
