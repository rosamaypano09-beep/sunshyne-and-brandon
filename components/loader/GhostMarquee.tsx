import React from 'react';
import './ghost-marquee.css';

interface GhostMarqueeProps {
  /** Line repeated down both edges, e.g. "Sunshyne & Brandon  ·  A Tale as Old as Time" */
  text: string;
  /** Placement for this screen (position, z-index, fade-in) */
  className?: string;
  /** Font for the lettering (a next/font className) */
  fontClassName?: string;
  /** Hold the columns still (reduced motion) */
  still?: boolean;
  /**
   * Copies of the line per column (even number). 2 covers a screen; tall page sections
   * need more so the loop never runs out. The timing stretches to keep the same speed.
   */
  repeat?: number;
}

// Seconds to drift one copy of the line (left / right columns move at slightly different speeds)
const SECONDS_PER_COPY = { left: 46, right: 52 } as const;

// The Seasons is a demo cut: outside A–Z, most characters (&, 4, -, !) print a "DEMO" stamp and
// the rest come out blocky. Anything that isn't a plain letter is set in Cinzel instead.
const NON_LETTERS = /([^A-Za-z\s]+)/;

/**
 * Ghost lettering drifting along both screen edges: left reads upward and moves down,
 * right moves up. Each track holds the line `repeat` times so a -50% shift loops seamlessly.
 */
export function GhostMarquee({ text, className = '', fontClassName = '', still = false, repeat = 2 }: GhostMarqueeProps) {
  if (!text) return null;
  // 1.5× the ask: the lettering is smaller on phones, so each copy covers less of the column
  const copies = Math.max(2, Math.ceil((repeat * 1.5) / 2) * 2);
  // split() with a capture group puts the matches at the odd indexes
  const line = `${text}  ·  `.split(NON_LETTERS).map((part, i) =>
    i % 2 ? (
      <span key={i} className="ghost-marquee__mark">
        {part}
      </span>
    ) : (
      part
    ),
  );
  return (
    <div className={`ghost-marquee ${className}${still ? ' is-still' : ''}`} aria-hidden="true">
      {(['left', 'right'] as const).map((side) => (
        <div key={side} className={`ghost-marquee__col ghost-marquee__col--${side}`}>
          <div
            className={`ghost-marquee__track ${fontClassName}`}
            style={copies > 2 ? { animationDuration: `${(SECONDS_PER_COPY[side] * copies) / 2}s` } : undefined}
          >
            {Array.from({ length: copies }, (_, i) => (
              <span key={i}>{line}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
