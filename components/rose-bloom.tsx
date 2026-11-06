// The enchanted rose: a crimson bloom with a gold outline, drawn in code so it costs no image download
export function RoseBloom({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="8 5 16 11" className={className} aria-hidden>
      <path
        d="M16 15c-4 0-6.5-2.8-6.5-6.2C11.5 7 13 6.5 14 7c.5-2 3.5-2.5 4.5-.5 1.2-.6 3 .2 3 2.3C21.5 12.2 19.5 15 16 15Z"
        fill="var(--color-motif-accent)"
        stroke="var(--color-welcome-gold)"
        strokeWidth={0.7}
        strokeLinejoin="round"
      />
      <path
        d="M14 7c.5 2 2.5 3 4.5 2.5"
        fill="none"
        stroke="var(--color-welcome-gold)"
        strokeWidth={0.7}
        strokeLinecap="round"
      />
    </svg>
  )
}
