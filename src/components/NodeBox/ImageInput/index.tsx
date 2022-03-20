import { useRef, MouseEventHandler } from "react"
import { InNodeInputValue } from ".."
import style from "./style.module.scss"

type Props = {
  index: number,
  value: InNodeInputValue,
  onChange: (index: number, value: InNodeInputValue) => void,
}

export function ImageInput({
  index,
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
          var img = new Image()
          img.src = imageUrl;
          img.onload = () => {
            onChange(index, {
              image: img,
            })
          }
        }
      }
    })()
  }
  return (
    <div className={style.frame}>
      <div className={style.imageInputRect} onClick={onImageInputRectClick}>
        {value.image && (
          <img src={value.image.src}/>
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