import { NodeTypeId } from "./NodeTypeId"
import { InNodeInputType, NodeColor } from "../../graph/NodeBox"
import { NodeBlueprint } from "../../graph/Board"
import { mathTypes } from "./data_types"

export const mathFactories = [{
  id: NodeTypeId.MathAdd,
  name: "Add",
  factory: () => {
    return {
      color: NodeColor.Blue,
      inNodeInputSlots: [],
      inSockets: [{
        label: "Value 1",
        alternativeValueInputType: InNodeInputType.Float,
        alternativeValue: {
          float: 1
        },
        dataTypes: mathTypes,
      }, {
        label: "Value 2",
        alternativeValueInputType: InNodeInputType.Float,
        alternativeValue: {
          float: 1
        },
        dataTypes: mathTypes,
      }],
      outSockets: [{
        label: "Result",
      }]
    } as NodeBlueprint
  }
}, {
  id: NodeTypeId.MathSine,
  name: "Math / Sine",
  factory: () => {
    return {
      color: NodeColor.Blue,
      inNodeInputSlots: [],
      inSockets: [{
        label: "Value",
        dataTypes: mathTypes,
      }],
      outSockets: [{
        label: "Result",
      }]
    } as NodeBlueprint
  }
}, {
  id: NodeTypeId.MathCosine,
  name: "Cosine",
  factory: () => {
    return {
      color: NodeColor.Blue,
      inNodeInputSlots: [],
      inSockets: [{
        label: "Value",
        dataTypes: mathTypes,
      }],
      outSockets: [{
        label: "Result",
      }]
    } as NodeBlueprint
  }
}, {
  id: NodeTypeId.MathTangent,
  name: "Math / Tangent",
  factory: () => {
    return {
      color: NodeColor.Blue,
      inNodeInputSlots: [],
      inSockets: [{
        label: "Value",
        dataTypes: mathTypes,
      }],
      outSockets: [{
        label: "Result",
      }]
    } as NodeBlueprint
  }
}, {
  id: NodeTypeId.MathDot,
  name: "Math / Dot",
  factory: () => {
    return {
      color: NodeColor.Blue,
      inNodeInputSlots: [],
      inSockets: [{
        label: "Value 1",
        dataTypes: mathTypes,
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
  name: "Math / Frac",
  factory: () => {
    return {
      color: NodeColor.Blue,
      inNodeInputSlots: [],
      inSockets: [{
        label: "Value",
        dataTypes: mathTypes,
      }],
      outSockets: [{
        label: "Result",
      }]
    } as NodeBlueprint
  }
}, {
  id: NodeTypeId.MathSubtract,
  name: "Math / Subtract",
  factory: () => {
    return {
      color: NodeColor.Blue,
      inNodeInputSlots: [],
      inSockets: [{
        label: "Value 1",
        dataTypes: mathTypes,
      }, {
        label: "Value 2",
        dataTypes: mathTypes,
      }],
      outSockets: [{
        label: "Result",
      }]
    } as NodeBlueprint
  }
}, {
  id: NodeTypeId.MathMultiply,
  name: "Math / Multiply",
  factory: () => {
    return {
      color: NodeColor.Blue,
      inNodeInputSlots: [],
      inSockets: [{
        label: "Value 1",
        dataTypes: mathTypes,
      }, {
        label: "Value 2",
        dataTypes: mathTypes,
      }],
      outSockets: [{
        label: "Result",
      }]
    } as NodeBlueprint
  }
}, {
  id: NodeTypeId.MathCombine,
  name: "Math / Combine",
  factory: () => {
    return {
      color: NodeColor.Blue,
      inNodeInputSlots: [],
      inSockets: [{
        label: "R",
        dataTypes: mathTypes,
      }, {
        label: "G",
        dataTypes: mathTypes,
      }, {
        label: "B",
        dataTypes: mathTypes,
      }, {
        label: "A",
        dataTypes: mathTypes,
      }],
      outSockets: [{
        label: "Vec",
      }]
    } as NodeBlueprint
  }
}, {
  id: NodeTypeId.MathSeparate,
  name: "Math / Separate",
  factory: () => {
    return {
      color: NodeColor.Blue,
      inNodeInputSlots: [],
      inSockets: [{
        label: "Vec",
        dataTypes: mathTypes,
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
}]