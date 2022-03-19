import {
  Scene,
  PerspectiveCamera,
  WebGL1Renderer,
  BoxGeometry,
  Mesh,
  SphereGeometry,
  MeshPhysicalMaterial,
  DirectionalLight,
  AmbientLight,
  ShaderMaterial,
} from "three"
import { ShaderGraph } from "../../backend/ShaderGraph"
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
    const m = new ShaderMaterial({
      vertexShader: graph.generateVertCode(),
      fragmentShader: graph.generateFragCode(),
      uniforms: graph.createUniforms()
    })
    m.needsUpdate = true
    this.#mesh.onBeforeRender = () => {
      graph.getNodes().forEach(n => {
        n.updateOnDraw()
      })
      const values = graph.getUniformValueMap()
      Object.keys(m.uniforms).forEach(key => {
        m.uniforms[key].value = values[key]
      })
    }
    console.log(m.uniforms)
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