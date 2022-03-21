import { useEffect, useMemo, useRef, useState } from "react";
import { ShaderGraph } from "../../backend/ShaderGraph"
import { Model, ShaderPreview } from "./ShaderPreview";
import style from "./style.module.scss"
import GUI from "lil-gui"
import shortUUID from "short-uuid";


type Props = {
  graph: ShaderGraph | null
}

export function Preview({
  graph
}: Props) {
  const [preview, setPreview] = useState<ShaderPreview | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fpsRef = useRef<HTMLDivElement | null>(null);
  const controlRef = useRef<HTMLDivElement | null>(null);
  const [controlChangeId, setControlChangeId] = useState("");

  useEffect(() => {
    if (canvasRef.current && fpsRef.current) {
      if (!preview) {
        const preview = new ShaderPreview(canvasRef.current, fpsRef.current);
        setPreview(preview);
        preview.play()
      }
    }
  }, [canvasRef.current, fpsRef.current])

  const controlValues = useMemo(() => {
    return {
      modelType: Model.Sphere,
      backgroundColor: 0xFFFFFF,
    }
  }, [])

  useEffect(() => {
    if (controlRef.current && preview) {
      const gui = new GUI();
      gui.domElement.style.position = "relative"
      gui.domElement.style.width = "100%"
      gui.domElement.style.right = "initial"
      gui.add(controlValues, "modelType", { ["Sphere"]: Model.Sphere, ["Box"]: Model.Box, Torus: Model.Torus } ).name("Model").onChange((v: any) => {
        preview.changeModel(v);
      })
      gui.addColor(controlValues, "backgroundColor", 0x000000).name("Background Color").onChange((v: any) => {
        console.log(v)
        setControlChangeId(shortUUID().generate())
      })
      controlRef.current.appendChild(gui.domElement)
    }
  }, [controlRef.current, preview])

  useEffect(() => {
    if (graph && preview) {
      preview.update(graph)
    }
  }, [graph])

  console.log("aaa")

  return (
    <div className={style.frame}>
      <div className={style.rederArea} style={{
        backgroundColor: "#" + controlValues.backgroundColor.toString(16)
      }}>
        <canvas ref={canvasRef} />
      </div>
      <div
        ref={fpsRef}
        className={style.fpsContainer}
      />
      <div
        ref={controlRef}
        className={style.control}
      />
    </div>
  )
}