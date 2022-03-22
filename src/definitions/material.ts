import { Vector3 } from 'three';
import { NodeTypeId } from './NodeTypeId';
import { InNodeInputType, NodeColor } from '../components/NodeBox';
import { NodeCategory } from './types';
import { NodeBlueprint } from '../components/Board/types';

export const materialCategory: NodeCategory = {
  id: 'material',
  label: 'Material',
  icon: 'cube',
};

export const materialFactories = [{
  id: NodeTypeId.Material_Lambert,
  name: 'Lambert',
  category: materialCategory,
  factory: () => ({
    color: NodeColor.Green,
    inNodeInputSlots: [],
    inSockets: [{
      label: 'Diffuse',
      alternativeValue: {
        vec3: new Vector3(1, 1, 1),
      },
      alternativeValueInputType: InNodeInputType.Vector3,
    }, {
      label: 'Emissive',
      alternativeValue: {
        vec3: new Vector3(),
      },
      alternativeValueInputType: InNodeInputType.Vector3,
    }],
    outSockets: [{
      label: 'Color',
    }],
  } as NodeBlueprint),
}, {
  id: NodeTypeId.Material_Phong,
  name: 'Phong',
  category: materialCategory,
  factory: () => ({
    color: NodeColor.Green,
    inNodeInputSlots: [],
    inSockets: [{
      label: 'Diffuse',
      alternativeValue: {
        vec3: new Vector3(1, 1, 1),
      },
      alternativeValueInputType: InNodeInputType.Vector3,
    }, {
      label: 'Emissive',
      alternativeValue: {
        vec3: new Vector3(),
      },
      alternativeValueInputType: InNodeInputType.Vector3,
    }, {
      label: 'Specular',
      alternativeValue: {
        vec3: new Vector3(),
      },
      alternativeValueInputType: InNodeInputType.Vector3,
    }, {
      label: 'Shininess',
      alternativeValue: {
        float: 1,
      },
      alternativeValueInputType: InNodeInputType.Float,
    }, {
      label: 'Opacity',
      alternativeValue: {
        float: 1,
      },
      alternativeValueInputType: InNodeInputType.Float,
    }],
    outSockets: [{
      label: 'Color',
    }],
  } as NodeBlueprint),
}];
