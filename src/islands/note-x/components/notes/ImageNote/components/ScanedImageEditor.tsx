import { Show, createSignal } from "solid-js"
import { Dialog, createDialog } from "../../../utils/Dialog"
import EditorCore from "./EditorCore"

export interface Props {
  onEnd(): void
  scanedImage?: Blob
}
export const ScanedImageEditor = (props: Props) => {
  const [scanedImageBlob, setScanedImageBlob] = createSignal<Blob | undefined>(props.scanedImage)
  const dialog = createDialog()
  
  const reScan = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.onchange = () => {
      if (!input.files){
        return
      }
      
      const imageFile = input.files[0]
      setScanedImageBlob(imageFile)
    }
    input.click()
  }

  return <Dialog type="custom" dialog={dialog} title="編集" onClose={(result) => {
    console.log('close')
    props.onEnd()
  }}>
    <div>
      <Show when={!scanedImageBlob()}>
        <button class="outlined-button" onClick={reScan}>スキャン!</button>
      </Show>
    </div>
    <div>
      <Show when={scanedImageBlob()}>
        <div>
          <EditorCore scanedImage={scanedImageBlob()} />
        </div>
      </Show>
    </div>
  </Dialog>
}