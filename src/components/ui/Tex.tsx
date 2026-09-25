import katex from 'katex'
import { useMemo } from 'react'

interface TexProps {
  math: string
  display?: boolean
  className?: string
}

/** KaTeX orqali formula chiqarish (natija keshlanadi) */
export function Tex({ math, display = false, className }: TexProps) {
  const html = useMemo(
    () => katex.renderToString(math, { throwOnError: false, displayMode: display, output: 'html' }),
    [math, display],
  )
  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />
}
