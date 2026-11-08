"use client"

import localFont from "next/font/local"
import { motion } from "motion/react"
import { useSiteConfig } from "@/hooks/use-site-config"
import { fillCelebrant } from "@/lib/celebrant"
import { sectionType } from "@/lib/section-typography"
import { cinzel } from "@/lib/fonts"


const theSeasons = localFont({
  src: "../../Font/Fontspring-DEMO-theseasons-reg.otf",
  display: "swap",
  variable: "--font-the-seasons",
})

const aboveTheBeyond = localFont({
  src: "../../Font/above-the-beyond-script.otf",
  display: "swap",
  variable: "--font-above-beyond",
})

// Storybook-page palette (colors from app/globals.css): midnight blue, crimson rose and antique
// gold on soft ivory. Small gold text uses the darker botanical gold so it stays readable on ivory.
const WELCOME_COLORS = {
  midnight: "var(--color-motif-deep)",
  rose: "var(--color-motif-accent)",
  gold: "color-mix(in srgb, var(--color-welcome-botanical) 85%, var(--color-motif-deep))",
  ink: "color-mix(in srgb, var(--color-welcome-text) 88%, var(--color-motif-deep))",
  hairline: "color-mix(in srgb, var(--color-welcome-gold) 45%, transparent)",
} as const

// The enchanted rose under its glass dome, between two gold rules, petals falling inside the glass
function EnchantedRose() {
  return (
    <div className="flex items-center justify-center gap-3 sm:gap-5" aria-hidden>
      <span
        className="h-px w-10 sm:w-24"
        style={{ background: "linear-gradient(to right, transparent, var(--color-welcome-gold))" }}
      />
      <svg viewBox="0 0 64 84" className="h-20 w-auto sm:h-24" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <defs>
          <radialGradient id="welcome-rose-glow">
            <stop offset="0%" stopColor="var(--color-welcome-gold)" stopOpacity={0.42} />
            <stop offset="100%" stopColor="var(--color-welcome-gold)" stopOpacity={0} />
          </radialGradient>
        </defs>
        <circle cx="32" cy="33" r="27" fill="url(#welcome-rose-glow)" />
        <g transform="translate(12 18) scale(1.25)">
          <g stroke="var(--color-welcome-botanical)" strokeWidth={0.9}>
            <path d="M16 15v25" />
            <path d="M16 23c-3 0-5-1.5-6-4 3 0 5 1.5 6 4ZM16 28c2.5 0 4.5-1.3 5.5-3.5-2.6 0-4.6 1.3-5.5 3.5Z" />
          </g>
          <path
            d="M16 15c-4 0-6.5-2.8-6.5-6.2C11.5 7 13 6.5 14 7c.5-2 3.5-2.5 4.5-.5 1.2-.6 3 .2 3 2.3C21.5 12.2 19.5 15 16 15Z"
            fill="var(--color-motif-accent)"
            stroke="var(--color-welcome-gold)"
            strokeWidth={0.6}
          />
          <path d="M14 7c.5 2 2.5 3 4.5 2.5" stroke="var(--color-welcome-gold)" strokeWidth={0.6} />
        </g>
        <g fill="var(--color-motif-accent)">
          <path d="M21 50c-1.3-.3-2-1.3-1.8-2.5 1.3.2 2.2 1.2 1.8 2.5Z" />
          <path d="M43 59c1.3-.2 2.2-1.1 2.2-2.4-1.3 0-2.4 1-2.2 2.4Z" />
          <path d="M39 69c1.2.4 2.4 0 3-1-1.1-.6-2.4-.3-3 1Z" />
        </g>
        <g stroke="var(--color-welcome-botanical)" strokeWidth={1.1}>
          <path d="M14 70V30C14 16 22 8 32 8s18 8 18 22v40" />
          <circle cx="32" cy="5.5" r="2.2" />
          <path d="M10 70h44l2 5H8l2-5ZM12 75v3h40v-3" />
        </g>
        <path d="M19 60V31c0-7 3-12 8-15" stroke="var(--color-welcome-gold)" strokeWidth={0.9} opacity={0.6} />
      </svg>
      <span
        className="h-px w-10 sm:w-24"
        style={{ background: "linear-gradient(to left, transparent, var(--color-welcome-gold))" }}
      />
    </div>
  )
}

// Storybook lockup: small caps kicker → midnight serif caps title → small-caps connector between
// gold rules → large crimson script. Each tier has its own line so the script never collides with the caps.
function LayeredWelcomeTitle({
  kicker,
  title,
  connector,
  script,
}: {
  kicker?: string
  title: string
  connector?: string
  script: string
}) {
  return (
    <h2
      className="welcome-title-lockup relative mx-auto flex w-full max-w-full flex-col items-center text-center"
      style={
        {
          "--welcome-size": "clamp(1.7rem, min(8.6vw, 10.5cqi), 3.75rem)",
          "--connector-size": "clamp(0.62rem, min(2.6vw, 3cqi), 0.88rem)",
          "--script-size": "clamp(2.1rem, min(11.5vw, 13cqi), 4.5rem)",
        } as React.CSSProperties
      }
    >
      {kicker ? (
        <span
          className={`${cinzel.className} ${sectionType.label} mb-3 block font-semibold uppercase tracking-[0.28em] sm:mb-4 sm:tracking-[0.34em]`}
          style={{ color: WELCOME_COLORS.gold, marginRight: "-0.28em" }}
        >
          {kicker}
        </span>
      ) : null}

      <span
        className={`${theSeasons.className} block uppercase leading-none tracking-[0.14em] min-[400px]:tracking-[0.18em] sm:tracking-[0.22em]`}
        style={{
          fontSize: "var(--welcome-size)",
          color: WELCOME_COLORS.midnight,
          // tracking adds trailing space after the last letter — nudge back to true center
          marginRight: "-0.18em",
        }}
      >
        {title}
      </span>

      {connector ? (
        <span className="mt-2.5 flex w-full items-center justify-center gap-2.5 sm:mt-3.5 sm:gap-3.5">
          <span
            aria-hidden
            className="h-px w-8 min-[400px]:w-12 sm:w-16"
            style={{ background: "linear-gradient(to right, transparent, var(--color-welcome-gold))" }}
          />
          <span
            className={`${cinzel.className} font-semibold uppercase tracking-[0.32em] sm:tracking-[0.4em]`}
            style={{ fontSize: "var(--connector-size)", color: WELCOME_COLORS.gold, marginRight: "-0.32em" }}
          >
            {connector}
          </span>
          <span
            aria-hidden
            className="h-px w-8 min-[400px]:w-12 sm:w-16"
            style={{ background: "linear-gradient(to left, transparent, var(--color-welcome-gold))" }}
          />
        </span>
      ) : null}

      <span
        className={`${aboveTheBeyond.className} relative z-10 mx-auto block w-fit max-w-full whitespace-nowrap px-2 leading-[1.1]`}
        style={{
          fontSize: "var(--script-size)",
          color: WELCOME_COLORS.rose,
          // The script's capitals rise above its line box and the "y" drops below it;
          // these keep them clear of the connector above and the rose below
          marginTop: "0.45em",
          marginBottom: "0.3em",
        }}
      >
        {script}
      </span>
    </h2>
  )
}

export function Welcome() {
  const siteConfig = useSiteConfig()
  const content = siteConfig.welcome
  const fill = (text: string) => fillCelebrant(text, siteConfig)

  return (
    <section
      id="welcome"
      className={`${theSeasons.variable} ${aboveTheBeyond.variable} relative px-4 py-10 sm:px-6 sm:py-14 md:px-8 md:py-16`}
    >
      <div className="mx-auto w-full max-w-3xl">
        <motion.article
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.65, ease: [0.22, 0.61, 0.36, 1] }}
          className="relative @container/welcome overflow-visible rounded-xl border px-5 py-8 sm:rounded-2xl sm:px-9 sm:py-10 md:px-11 md:py-12"
          style={{
            borderColor: WELCOME_COLORS.hairline,
            background:
              "radial-gradient(120% 60% at 50% 0%, color-mix(in srgb, white 70%, transparent) 0%, transparent 60%), linear-gradient(180deg, var(--color-motif-soft) 0%, var(--color-motif-cream) 100%)",
            boxShadow:
              "0 14px 36px color-mix(in srgb, var(--color-motif-deep) 18%, transparent), 0 2px 6px color-mix(in srgb, var(--color-coastal-deep) 8%, transparent)",
          }}
        >
          <div
            className="wedding-frame-inner"
            style={{ borderColor: "color-mix(in srgb, var(--color-welcome-gold) 38%, transparent)" }}
            aria-hidden
          />

          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-8 top-0 h-px sm:inset-x-10 md:inset-x-12"
            style={{
              background:
                "linear-gradient(to right, transparent, var(--color-welcome-gold), transparent)",
            }}
          />

          <div className="relative flex flex-col gap-8 sm:gap-9 md:gap-10">
            <header className="space-y-3 pt-2 text-center sm:space-y-3.5 sm:pt-3 md:space-y-4 md:pt-4">
              <LayeredWelcomeTitle
                kicker={content.kicker}
                title={content.title}
                connector={content.connector}
                script={content.script}
              />
              <EnchantedRose />
            </header>

            <div className="mx-auto max-w-[35rem] text-center">
              {content.opening ? (
                <p
                  className={`${aboveTheBeyond.className} mb-2 px-2 leading-[1.3] sm:mb-3`}
                  style={{ color: WELCOME_COLORS.rose, fontSize: "clamp(1.5rem, min(6.4vw, 8cqi), 2.25rem)" }}
                >
                  {content.opening}
                </p>
              ) : null}
              <div
                className="font-goudy-italic space-y-4 text-[0.9375rem] leading-[1.75] sm:space-y-5 sm:text-[1.0625rem] sm:leading-[1.8]"
                style={{ color: WELCOME_COLORS.ink }}
              >
                {content.paragraphs.map((paragraph, index) => (
                  <p key={index}>{fill(paragraph)}</p>
                ))}
              </div>
            </div>

            <footer className="space-y-3 pb-2 text-center sm:space-y-4">
              <div className="flex items-center justify-center gap-2 pb-2" aria-hidden>
                <span
                  className="h-px w-16 sm:w-28"
                  style={{ background: "linear-gradient(to right, transparent, var(--color-welcome-gold))" }}
                />
                <span className="h-1.5 w-1.5 rotate-45" style={{ background: "var(--color-motif-accent)" }} />
                <span
                  className="h-px w-16 sm:w-28"
                  style={{ background: "linear-gradient(to left, transparent, var(--color-welcome-gold))" }}
                />
              </div>
              <p
                className={`${aboveTheBeyond.className} text-[1.4rem] leading-[1.3] sm:text-[1.65rem]`}
                style={{ color: WELCOME_COLORS.midnight }}
              >
                {content.signOff}
              </p>
              <p
                className={`${cinzel.className} ${sectionType.subheader} font-semibold tracking-[0.12em] sm:tracking-[0.16em] md:tracking-[0.18em]`}
                style={{ color: WELCOME_COLORS.gold }}
              >
                {fill(content.signature)}
              </p>
            </footer>
          </div>
        </motion.article>
      </div>
    </section>
  )
}
