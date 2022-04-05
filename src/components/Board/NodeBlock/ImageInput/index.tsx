import { useRef, MouseEventHandler } from "react"
import { TextureLoader } from "three"
import { NodeInputValue } from "../../../../definitions/types"
import style from "./style.module.scss"

type Props = {
  value: NodeInputValue,
  onChange: (value: NodeInputValue) => void,
}

export function ImageInput({
  value,
  onChange
}: Props) {
  const imageInputRef = useRef<HTMLInputElement>(null)

  const onImageInputRectClick: MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation()
    if (imageInputRef.current) {
      imageInputRef.current.click()
    }
  }

  const onImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    ;(async () => {
      const files = e.target.files
      if (files) {
        const file = files.item(0)
        if (file) {
          var arrayBufferView = new Uint8Array(await file.arrayBuffer())
          var blob = new Blob( [ arrayBufferView ], { type: "image/jpeg" } );
          var urlCreator = window.URL || window.webkitURL;
          var imageUrl = urlCreator.createObjectURL( blob );
          const loader = new TextureLoader()
          const tex = await loader.loadAsync(imageUrl)
          onChange({
            image: tex,
          })
        }
      }
    })()
  }
  return (
    <div className={style.frame}>
      <div className={style.imageInputRect} onClick={onImageInputRectClick}>
        {value.image && value.image.image && (
          <img src={value.image.image.src}/>
        )}
      </div>
      <input
        type="file"
        accept="image/jpeg,image/png"
        onChange={onImageInputChange}
        ref={imageInputRef}
        className={style.imageInput}
      />
    </div>
  )
}