import {
  Scene,
  PerspectiveCamera,
  WebGL1Renderer,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  SphereGeometry,
  MeshPhysicalMaterial,
  DirectionalLight,
  AmbientLight,
  ShaderMaterial,
  Uniform,
  Vector3,
  Texture,
} from "three"
import { ShaderDataType } from "../../materials/graph/data_types"
import { ShaderGraph } from "../../materials/graph/ShaderGraph"
export class ShaderPreview {

  #scene: Scene
  #mesh: Mesh
  #renderer: WebGL1Renderer
  #camera: PerspectiveCamera

  constructor() {
    const renderer = new WebGL1Renderer({ antialias: true })
    renderer.setSize(300, 300)
    renderer.setClearColor("#000000");

    const camera = new PerspectiveCamera(90, 1, 0.1, 1000);
    camera.position.z = 2;
    const scene = new Scene();

    const geometry = new SphereGeometry(1, 32, 32);
    const material = new MeshPhysicalMaterial({
      color: "#ffffff",
      metalness: 0.5,
      roughness: 0.5,
    })
    const light = new DirectionalLight(0xffffff, 0.5);
    scene.add(light);

    const ambient = new AmbientLight(0xffffff, 0.5);
    scene.add(ambient)

    const mesh = new Mesh(geometry, material);
    this.#scene = scene
    this.#mesh = mesh
    this.#renderer = renderer
    this.#camera = camera
    scene.add(mesh)
  }

  getCanvas() {
    return this.#renderer.domElement
  }

  update(graph: ShaderGraph) {
    console.log(graph.generateFragCode())
    const uniforms: { [key: string]: Uniform } = {}
    graph.getResolvedNodes().forEach(n => {
      n.getInSockets().forEach((s, i)=> {
        if (!s.connected() && n.getUniforms()[i]) {
          const { name, type, valueVector3, valueFloat, valueVector2, valueSampler2D, valueVector4 } = n.getUniforms()[i]
          if (type === ShaderDataType.Float && valueFloat !== undefined) {
            uniforms[name] = new Uniform(valueFloat)
          }
          if (type === ShaderDataType.Vector3 && valueVector3) {
            uniforms[name] = new Uniform(valueVector3)
          }
          if (type === ShaderDataType.Vector2 && valueVector2) {
            uniforms[name] = new Uniform(valueVector3)
          }
          if (type === ShaderDataType.Vector4 && valueVector4) {
            uniforms[name] = new Uniform(valueVector4)
          }
          if (type === ShaderDataType.Sampler2D && valueSampler2D) {
            uniforms[name] = new Uniform(new Texture(valueSampler2D))
          }
          return
        }
      })
    })
    console.log(uniforms)
    const m = new ShaderMaterial({
      fragmentShader: graph.generateFragCode(),
      uniforms,
    })
    console.log(m.vertexShader)
    console.log(m.fragmentShader)
    this.#mesh.material = m
  }

  render() {
    this.#renderer.render(this.#scene, this.#camera)
  }

  start() {
    const loop = () => {
      this.render()
      requestAnimationFrame(loop)
    }
    requestAnimationFrame(loop)
  }
}