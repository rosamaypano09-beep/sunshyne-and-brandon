import type React from "react"

interface TintedDecoProps {
  src: string
  className?: string
  style?: React.CSSProperties
}

/**
 * Decoration image tinted to the motif by --deco-filter (app/globals.css).
 * Sizing classes go on the wrapper. An empty src renders nothing.
 */
export function TintedDeco({ src, className = "", style }: TintedDecoProps) {
  if (!src) return null
  return (
    <span className={`tinted-deco ${className}`} aria-hidden="true" style={style}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="tinted-deco__img" />
    </span>
  )
}
