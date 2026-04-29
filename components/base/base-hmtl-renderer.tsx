import DOMPurify from 'dompurify'

export default function BaseHtmlRenderer({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cleanHtml = DOMPurify.sanitize(children as string)

  return <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />
}
