import TextNote from "./components/TextNote.tsx"
import {
  IconPlayerPlay,
  IconEdit,
  IconEye,
  IconPlus,
  IconScan,
  IconX,
  IconPencil,
} from "@tabler/icons-react"
import { useEffect, useState, createContext } from "react"
import classnames from "classnames"
import ScanDialog from "./components/ScanDialog.tsx"
import ImageNote from './components/ImageNote.tsx'
import type { Editor } from "@tiptap/react"

export interface Props {
  
}
export const UserStateContext = createContext<{
  mode: "edit" | "play",
  isView: boolean
}>({
  mode: 'edit',
  isView: true,
})
export const NoteIndexContext = createContext(0)

export default function(props: Props){
  const [mode, setMode] = useState<"edit" | "play">("edit")
  const [isView, setIsView] = useState(false)
  
  const [plusFubActive, setPlusFubActive] = useState(false)
  const [isScanActive, setIsScanActive] = useState(false)

  const [editor, setEditor] = useState<Editor | null>(null)
  
  const [noteElements, setNoteElements] = useState([])
  
  const createTextNote = (defaultContent: string) => {
    setNoteElements([...noteElements, 
                     <TextNote
                       defaultContent={defaultContent}
                       setEditorState={(editor) => null}
                       onRemove={index => {
                         const newNoteElements = [...noteElements]
                         setNoteElements(newNoteElements.splice(index, 1))
                       }}/>
                    ])
  }

  useEffect(() => {
    createTextNote(`<p>こんにちは！これはNanohaNoteです！</p>
        <p>NanohaNoteは、「じぶん」で作る、学習用ノートブックです！</p>
        <p>暗記をスムーズに行えます。</p>
        <p>例えば、こんなことができちゃいます:</p>
        <p>「Scratchでプログラミングするように、視覚的にプログラミングすることを、<span data-nanohasheet="true">ビジュアルプログラミング</span>という」</p>
        <p>じゃーん。すごいでしょ。<b>こんなふうに太字</b>にしたり、<del>証拠隠滅</del>したりできます。</p>
        <p>さあ、あなたの思いのままのノートにしましょう！この説明を消してもいいですよ〜</p>`)
    console.log(
      "%cここにコピペしろ",
      "font-size: 4em; color: red; font-weight: bold;",
    )
    console.log(
      "%cはすべて詐欺です",
      "font-size: 4em; color: red; font-weight: bold;",
      "\nここは開発者がウェブサイトを詳しく調べる場所です。ここに貼り付けることで、情報が抜き取られたりするかもしれません。"
    )
  }, [])
  return <>
    <div>
      { isScanActive && <ScanDialog onClose={(data) => {
        if (!data.failed) {
          setNoteElements([...noteElements, <ImageNote imageBlob={data.imageBlob} paths={data.paths} />])
        }
        setIsScanActive(false)
      }} /> }
    </div>
    <div className="bg-background text-on-background min-h-screen">
      <div className="p-4 flex gap-4 flex-col">
        <UserStateContext.Provider value={{
          mode,
          isView,
        }}>
          {
            noteElements.map((noteElement, index) => {
              return <div key={index} className=''>
                <NoteIndexContext.Provider value={index}>
                  { noteElement }
                </NoteIndexContext.Provider>
              </div>
            })
          }
        </UserStateContext.Provider>
      </div>
      <div className="h-24" />
      <div className="fixed bottom-0 w-full bg-secondary-container h-24">
        {/* Navbar */}
        <div className="flex gap-4 justify-center items-center m-2">
          <div className="flex justify-center items-center bg-lime-50 rounded-full">
            <button onClick={()=>setMode("edit")} className={classnames("p-4 rounded-full", { "bg-lime-300": mode === "edit" })}>
              <IconEdit />
            </button>
            <button onClick={()=>setMode("play")} className={classnames("p-4 rounded-full", { "bg-lime-300": mode === "play" })}>
              <IconPlayerPlay />
            </button>
          </div>
        </div>
      </div>
      <div className="fixed bottom-10 right-4">
        {/* 重要ボタンとか言うやつ */}
        { mode === "play" && <div className="flex justify-center items-center gap-2">
          <button className="fab" onClick={()=>setIsView(!isView)}>
            <IconEye />
          </button>
        </div> }

        { mode === "edit" && <>
          <div className="flex justify-center items-center gap-2 flex-col">
            {
              plusFubActive && <>
                <button className="small-fab flex justify-center items-center" onClick={() => setPlusFubActive(false)}>
                  <IconX />
                </button>
                <button className="small-fab flex justify-center items-center" onClick={() => {
                  createTextNote("New Note")
                }}>
                  <IconPencil />
                </button>
                <button className="small-fab flex justify-center items-center" onClick={() => {
                  setIsScanActive(true)
                }}>
                  <IconScan />
                </button>
              </>
            }
            <button className="fab" onClick={() => {
              setPlusFubActive(!plusFubActive)
            }}>
              <IconPlus />
            </button>
          </div>
        </> }
      </div>
    </div>
  </>
}
