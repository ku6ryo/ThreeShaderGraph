import { NodeTypeId } from "./NodeTypeId"
import { NodeColor } from "../components/NodeBox"
import { NodeCategory } from "./types"
import { NodeBlueprint } from "../components/Board/types"

export const mathCategory: NodeCategory = {
  id: "math",
  label: "Math",
  icon: "calculator",
}

export const mathFactories = [{
  id: NodeTypeId.MathAdd,
  name: "Add",
  category: mathCategory,
  factory: () => {
    return {
      color: NodeColor.Blue,
      inNodeInputSlots: [],
      inSockets: [{
        label: "Value 1",
      }, {
        label: "Value 2",
      }],
      outSockets: [{
        label: "Result",
      }]
    } as NodeBlueprint
  }
}, {
  id: NodeTypeId.MathSine,
  name: "Sine",
  category: mathCategory,
  factory: () => {
    return {
      color: NodeColor.Blue,
      inNodeInputSlots: [],
      inSockets: [{
        label: "Value",
      }],
      outSockets: [{
        label: "Result",
      }]
    } as NodeBlueprint
  }
}, {
  id: NodeTypeId.MathCosine,
  name: "Cosine",
  category: mathCategory,
  factory: () => {
    return {
      color: NodeColor.Blue,
      inNodeInputSlots: [],
      inSockets: [{
        label: "Value",
      }],
      outSockets: [{
        label: "Result",
      }]
    } as NodeBlueprint
  }
}, {
  id: NodeTypeId.MathTangent,
  name: "Tangent",
  category: mathCategory,
  factory: () => {
    return {
      color: NodeColor.Blue,
      inNodeInputSlots: [],
      inSockets: [{
        label: "Value",
      }],
      outSockets: [{
        label: "Result",
      }]
    } as NodeBlueprint
  }
}, {
  id: NodeTypeId.MathDot,
  name: "Dot",
  category: mathCategory,
  factory: () => {
    return {
      color: NodeColor.Blue,
      inNodeInputSlots: [],
      inSockets: [{
        label: "Value 1",
      }, {
        label: "Value 2",
      }],
      outSockets: [{
        label: "Result",
      }]
    } as NodeBlueprint
  }
}, {
  id: NodeTypeId.MathFrac,
  name: "Frac",
  category: mathCategory,
  factory: () => {
    return {
      color: NodeColor.Blue,
      inNodeInputSlots: [],
      inSockets: [{
        label: "Value",
      }],
      outSockets: [{
        label: "Result",
      }]
    } as NodeBlueprint
  }
}, {
  id: NodeTypeId.MathSubtract,
  name: "Subtract",
  category: mathCategory,
  factory: () => {
    return {
      color: NodeColor.Blue,
      inNodeInputSlots: [],
      inSockets: [{
        label: "Value 1",
      }, {
        label: "Value 2",
      }],
      outSockets: [{
        label: "Result",
      }]
    } as NodeBlueprint
  }
}, {
  id: NodeTypeId.MathMultiply,
  name: "Multiply",
  category: mathCategory,
  factory: () => {
    return {
      color: NodeColor.Blue,
      inNodeInputSlots: [],
      inSockets: [{
        label: "Value 1",
      }, {
        label: "Value 2",
      }],
      outSockets: [{
        label: "Result",
      }]
    } as NodeBlueprint
  }
}, {
  id: NodeTypeId.MathCombine,
  name: "Combine",
  category: mathCategory,
  factory: () => {
    return {
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
      }]
    } as NodeBlueprint
  }
}, {
  id: NodeTypeId.MathSeparate,
  name: "Separate",
  category: mathCategory,
  factory: () => {
    return {
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
      }]
    } as NodeBlueprint
  }
}, {
  id: NodeTypeId.MathGreaterThan,
  name: "Greater Than",
  category: mathCategory,
  factory: () => {
    return {
      color: NodeColor.Blue,
      inNodeInputSlots: [],
      inSockets: [{
        label: "Value",
      }, {
        label: "Threshold",
      }],
      outSockets: [{
        label: "Result",
      }]
    } as NodeBlueprint
  }
}, {
  id: NodeTypeId.MathLessThan,
  name: "Less Than",
  category: mathCategory,
  factory: () => {
    return {
      color: NodeColor.Blue,
      inNodeInputSlots: [],
      inSockets: [{
        label: "Value",
      }, {
        label: "Threshold",
      }],
      outSockets: [{
        label: "Result",
      }]
    } as NodeBlueprint
  }
}]