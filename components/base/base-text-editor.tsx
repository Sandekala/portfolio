'use client'

import { CKEditor, useCKEditorCloud } from '@ckeditor/ckeditor5-react'

/**
 * SETUP LOCAL INTERFACE
 */

type Props = {
  model: string
  onChange?: (data: string) => void
}

export default function BaseTextEditor({ model, onChange }: Props) {
  /**
   * SETUP HOOKS
   */
  const cloud = useCKEditorCloud({
    version: '48.0.1',
  })

  if (cloud.status === 'error') {
    return <div>Error!</div>
  }

  if (cloud.status === 'loading') {
    return <div>Loading...</div>
  }

  const {
    ClassicEditor,
    Essentials,
    Paragraph,
    Bold,
    Italic,
    Underline,
    Strikethrough,
    Code,
    Subscript,
    Superscript,
    Heading,
    Link,
    List,
    BlockQuote,
    CodeBlock,
    Table,
    TableToolbar,
    FontColor,
    Undo,
    FontSize,
  } = cloud.CKEditor

  return (
    <CKEditor
      editor={ClassicEditor}
      data={model}
      onChange={(_, editor) => {
        const data = editor.getData()
        console.log(data)
        onChange?.(data)
      }}
      config={{
        licenseKey: process.env.NEXT_PUBLIC_CK_EDITOR_KEY || '',
        plugins: [
          Essentials,
          Paragraph,
          Heading,
          FontSize,
          Bold,
          Italic,
          Underline,
          Strikethrough,
          Code,
          Subscript,
          Superscript,
          Link,
          List,
          BlockQuote,
          CodeBlock,
          Table,
          TableToolbar,
          FontColor,
          // Markdown,
          Undo,
        ],
        toolbar: [
          'undo',
          'redo',
          '|',
          'heading',
          'fontSize',
          'fontColor',
          '|',
          'bold',
          'italic',
          'underline',
          'strikethrough',
          'code',
          '|',
          'link',
          '|',
          'bulletedList',
          'numberedList',
          '|',
          'blockQuote',
          'codeBlock',
          '|',
          'insertTable',
        ],
        table: {
          contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
        },
      }}
    />
  )
}
