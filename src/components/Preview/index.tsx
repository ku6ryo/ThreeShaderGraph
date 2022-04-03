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
  const [, setControlChangeId] = useState("");

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
      backgroundColor: "#EEEEEE",
      rotating: false,
    }
  }, [])

  useEffect(() => {
    if (controlRef.current && preview) {
      const gui = new GUI();
      gui.domElement.style.position = "relative"
      gui.domElement.style.width = "100%"
      gui.domElement.style.right = "initial"
      gui.add(controlValues, "modelType", {
        Sphere: Model.Sphere,
        Box: Model.Box,
        Torus: Model.Torus
      }).name("Model").onChange((v: Model) => {
        preview.changeModel(v);
      })
      gui.addColor(controlValues, "backgroundColor", 0x000000)
        .name("Background Color")
        .onChange(() => {
          setControlChangeId(shortUUID().generate())
        })
      gui.add(controlValues, "rotating").name("Rotate model").onChange((v: boolean) => {
        preview.setRotate(v)
      })
      controlRef.current.appendChild(gui.domElement)
    }
  }, [controlRef.current, preview])

  useEffect(() => {
    if (graph && preview) {
      preview.update(graph)
    }
  }, [graph])

  return (
    <div className={style.frame}>
      <div className={style.rederArea} style={{
        backgroundColor: controlValues.backgroundColor,
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