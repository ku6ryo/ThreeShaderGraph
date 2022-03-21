import {
  Scene,
  PerspectiveCamera,
  WebGL1Renderer,
  Mesh,
  SphereGeometry,
  MeshPhysicalMaterial,
  DirectionalLight,
  AmbientLight,
  ShaderMaterial,
  Uniform,
  UniformsUtils,
  UniformsLib,
  ShaderLib,
  TorusGeometry,
  Color,
} from "three"
import { ShaderGraph } from "../../backend/ShaderGraph"
import { BuiltIn } from "../../backend/ShaderNode"
import Stats from "stats.js"

const stats = new Stats()
document.body.appendChild(stats.dom)
stats.dom.style.position = "fixed"
stats.dom.style.right = "0"
stats.dom.style.left = "initial"

export class ShaderPreview {

  #scene: Scene
  #mesh: Mesh
  #renderer: WebGL1Renderer
  #camera: PerspectiveCamera
  #playing = false

  constructor(canvas: HTMLCanvasElement) {
    const renderer = new WebGL1Renderer({ antialias: true, canvas })
    renderer.setSize(300, 300)
    renderer.setClearColor("#222");

    const camera = new PerspectiveCamera(90, 1, 0.1, 1000);
    camera.position.z = 2;
    const scene = new Scene();

    const geometry = new TorusGeometry(1, 0.3, 16, 100);
    const material = new MeshPhysicalMaterial({
      color: "#ffffff",
      metalness: 0.5,
      roughness: 0.5,
    })
    const light = new DirectionalLight(0xffffff, 0.5);
    light.intensity = 10
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
    const uniforms: { [key: string ]: Uniform } = {} 
    const uMap = graph.getUniformValueMap()
    Object.keys(uMap).forEach(name => {
      uniforms[name] = new Uniform(uMap[name])
    })
    const builtIns = graph.getBuiltIns()
    const builtInUniforms: any[] = []
    const useLight = builtIns.includes(BuiltIn.DirectionalLight)
    if (useLight) {
      builtInUniforms.push(UniformsLib.lights)
    }
    graph.getNodes().forEach(n => {
      n.updateOnDraw()
    })

    const m = new ShaderMaterial({
      vertexShader: graph.generateVertCode(),
      fragmentShader: graph.generateFragCode(),
      uniforms: UniformsUtils.merge([
        ...builtInUniforms,
        uniforms, 
      ]),
      lights: useLight,
    })
    this.#mesh.onBeforeRender = () => {
      graph.getNodes().forEach(n => {
        n.updateOnDraw()
      })
      const values = graph.getUniformValueMap()
      Object.keys(values).forEach(name => {
        m.uniforms[name].value = values[name]
      })
    }
    m.needsUpdate = true
    m.uniformsNeedUpdate = true
    this.#mesh.material = m
  }

  render() {
    this.#mesh.rotation.set(0, performance.now() / 1000, 0)
    this.#renderer.render(this.#scene, this.#camera)
  }

  stop() {
    this.#playing = false
  }

  play() {
    this.#playing = true
    const loop = () => {
      if (!this.#playing) {
        return
      }
      stats.begin()
      this.render()
      stats.end()
      requestAnimationFrame(loop)
    }
    requestAnimationFrame(loop)
  }
}