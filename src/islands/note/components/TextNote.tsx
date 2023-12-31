//    <TextNote mode={mode} isView={isView} />
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import type { Editor } from "@tiptap/core"
import { TipTapPluginSheet } from "../utils/tiptap-plugin-sheet"
import { TiptapPluginImageNote } from "../utils/tiptap-plugin-imagenote"
import { UserStateContext, NoteIndexContext } from "../index.tsx"
import { viewClasses, hideClasses } from '../const/sheetClasses.ts'
import { classListAddAll, classListRemoveAll } from "../utils/classListAll.ts"
import {
  IconBold,
  IconBoldOff,
  IconNote,
  IconNoteOff,
  IconX,
  IconUnderline,
} from "@tabler/icons-react"
import { useEffect, useRef, useContext, useState } from "react"
import classNames from "classnames"

export interface Props {
  data: {
    data: {
      html: string
    }
    blobs: Record<string, Blob>
  }
}
export default (props: Props) => {
  const userState = useContext(UserStateContext)
  
  const editor = useEditor({
    extensions: [StarterKit, TipTapPluginSheet, TiptapPluginImageNote],
    content: props.data.data.html,
  })
  
  const viewEditorRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    for (const nanohaSheetElement of viewEditorRef?.current?.getElementsByClassName(
      "nanoha-sheet"
    ) || []) {
      nanohaSheetElement.dataset.isview = userState.isView
      nanohaSheetElement?.onresetsheet()
    }
  }, [userState.isView])
  useEffect(() => {
    for (const nanohaSheetElement of viewEditorRef?.current?.getElementsByClassName(
      "nanoha-sheet"
    ) || []) {
      nanohaSheetElement.dataset.isview = "true"
      nanohaSheetElement.style = ""
      nanohaSheetElement.classList.add("select-none")
      const getIsView = (): boolean =>
        nanohaSheetElement.dataset.isview === "true"
      const reset = () => {
        if (getIsView()) {
          classListAddAll(nanohaSheetElement, viewClasses)
          classListRemoveAll(nanohaSheetElement, hideClasses)
        } else {
          classListRemoveAll(nanohaSheetElement, viewClasses)
          classListAddAll(nanohaSheetElement, hideClasses)
        }
      }
      reset()
      nanohaSheetElement.onclick = () => {
        nanohaSheetElement.dataset.isview = !getIsView()
        const isView = getIsView()
        reset()
      }
      nanohaSheetElement.onresetsheet = () => reset()
    }
  }, [userState.mode])
  
  useEffect(() => {
    props.data.data.html = editor?.getHTML()
  }, [editor?.getHTML()])
  
  const rootRef = useRef(null)
  const [rect, setRect] = useState<DOMRect>(new DOMRect(0, 0, 0, 0))
  window.addEventListener('scroll', () => {
    if (rootRef.current) {
      setRect(rootRef.current.getBoundingClientRect())
    }
  })
  return (
    <>
      <div className="mx-4" ref={rootRef}>
        <div className={classNames({ hidden: userState.mode === "play" })}>
          {/* Edit Mode */}
          <div className="p-4 rounded-md border">
            <EditorContent editor={editor} />
          </div>
          <div>
            {/* コントロールパネル */}
            <div className={classNames("flex justify-center items-center bottom-24 w-full", {
              'fixed': (
                (0 < rect.bottom && rect.top < window.innerHeight) && // 少しでも要素が中に入っている
                (rect.bottom > window.innerHeight - 26*4)
              )
            })}>
              <button
                className="p-2 rounded-full border"
                onClick={() => {
                  editor?.chain().focus().toggleSheet().run()
                }}
              >
                {editor?.isActive("sheet") ? <IconNote /> : <IconNoteOff />}
              </button>
              <button
                className="p-2 rounded-full border"
                onClick={() => {
                  editor?.chain().focus().toggleBold().run()
                }}
              >
                {editor?.isActive("bold") ? <IconBold /> : <IconBoldOff />}
              </button>
              <button
                className={classNames("p-2 rounded-full border", classNames({
                  'bg-gray-200': editor?.isActive("underline")
                }))}
                onClick={() => {
                  editor?.chain().focus().toggleUnderline().run()
                }}
              >
                <IconUnderline />
              </button>
            </div>
          </div>
        </div>
        <div className={classNames({ hidden: userState.mode === "edit" })}>
          {/* View Mode */}
          <div className="p-4 rounded-md border">
            <div
              ref={viewEditorRef}
              dangerouslySetInnerHTML={{
                __html: editor?.getHTML() as string,
              }}
              className=""
            />
          </div>
        </div>
      </div>
    </>
  )
}
