"use client"

import type React from "react"
import type { ReactNode } from "react"
import { Section } from "@/components/section"
import { useSiteConfig } from "@/hooks/use-site-config"
import { useQrColors } from "@/hooks/use-css-color"
import { QRCodeSVG } from "qrcode.react"
import Image from "next/image"
import localFont from "next/font/local"
import { cinzel } from "@/lib/fonts"
import { BedDouble, CalendarDays, ChevronRight, ExternalLink, Navigation, X } from "lucide-react"
import * as Dialog from "@radix-ui/react-dialog"
import { useReducedMotion } from "motion/react"
import { PlainBubbles } from "@/components/loader/PlainBubbles"
import { RisingMotes } from "@/components/rising-motes"
import { RoseBloom } from "@/components/rose-bloom"
import { GhostMarquee } from "@/components/loader/GhostMarquee"
import { ghostTextFor } from "@/lib/ghost-text"
import "@/components/loader/loading-screen.css"
import "@/components/sections/love-story-red.css"

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

// Red velvet vibe (same as Details / Entourage / FAQ): white + gold text on the red
// circle pattern, ivory paper cards with wine + gold ink.
// Circle colors + blur: components/sections/love-story-red.css (.red-velvet-root)
const GOLD_INK = "color-mix(in srgb, var(--color-welcome-botanical) 85%, var(--color-motif-deep))"
const C = {
  heading: "var(--color-motif-deep)",
  body: "color-mix(in srgb, var(--color-welcome-text) 88%, var(--color-motif-deep))",
  soft: "color-mix(in srgb, var(--color-welcome-text) 70%, var(--color-motif-deep))",
  label: GOLD_INK,
  gold: "var(--color-welcome-gold)",
  paper: "var(--color-motif-soft)",
} as const

const sectionBg = "color-mix(in srgb, var(--color-motif-deep) 70%, var(--color-coastal-deep))"
const textLift =
  "0 1px 2px color-mix(in srgb, var(--color-coastal-deep) 60%, transparent), 0 2px 14px color-mix(in srgb, var(--color-coastal-deep) 45%, transparent)"
const onBg = { color: "#fff", textShadow: textLift } as const
const onBgGold = { color: "var(--color-welcome-gold)", textShadow: textLift } as const
const hairline = "color-mix(in srgb, var(--color-welcome-gold) 50%, transparent)"

const cardStyle = {
  background:
    "radial-gradient(120% 50% at 50% 0%, color-mix(in srgb, white 70%, transparent) 0%, transparent 60%), linear-gradient(180deg, var(--color-motif-soft) 0%, var(--color-motif-cream) 100%)",
  borderColor: hairline,
  borderWidth: "1px",
  borderStyle: "solid",
  boxShadow:
    "0 24px 50px -24px color-mix(in srgb, var(--color-coastal-deep) 75%, transparent), inset 0 0 0 1px color-mix(in srgb, var(--color-welcome-gold) 35%, transparent)",
} as const

const softPanelStyle = {
  borderColor: hairline,
  backgroundColor: "color-mix(in srgb, var(--color-motif-blush) 22%, var(--color-motif-soft))",
} as const

const primaryBtnStyle = {
  background: "linear-gradient(180deg, var(--color-motif-royal) 0%, var(--color-motif-deep) 100%)",
  borderColor: "color-mix(in srgb, var(--color-welcome-gold) 65%, transparent)",
  color: "#fff",
  boxShadow: "0 12px 24px -10px color-mix(in srgb, var(--color-coastal-deep) 65%, transparent)",
} as const

// Blank mapsLink → Google Maps search for the place, so every button / QR resolves
function mapsUrl(name: string, link?: string) {
  if (link) return link
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name}, Davao City`)}`
}

// The Seasons / Above the Beyond have no clean glyphs for symbols or digits — render
// only those characters (e.g. "'", "&", "·", "2027") in Cinzel, keep letters as-is.
function SpecialCharFont({ text }: { text: string }) {
  return (
    <>
      {text.split(/([^\p{L}\s]+)/u).map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className={`${cinzel.className} tracking-normal`}>
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  )
}

function GoldRule({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`block h-px ${className}`}
      style={{ background: `linear-gradient(to right, transparent, ${hairline}, transparent)` }}
    />
  )
}

function RoseDivider() {
  return (
    <div className="flex items-center justify-center gap-2 pt-1 sm:pt-2" aria-hidden>
      <span
        className="h-px w-10 sm:w-16 md:w-20"
        style={{ background: "linear-gradient(to right, transparent, var(--color-welcome-gold))" }}
      />
      <span
        className="flex h-7 w-7 items-center justify-center rounded-full sm:h-8 sm:w-8"
        style={{
          border: "1px solid color-mix(in srgb, var(--color-welcome-gold) 60%, transparent)",
          background: "var(--color-motif-deep)",
        }}
      >
        <RoseBloom className="h-3.5 w-auto sm:h-4" />
      </span>
      <span
        className="h-px w-10 sm:w-16 md:w-20"
        style={{ background: "linear-gradient(to left, transparent, var(--color-welcome-gold))" }}
      />
    </div>
  )
}

function SectionHeader({
  kicker,
  title,
  subtitle,
  intro,
}: {
  kicker: string
  title: string
  subtitle: string
  intro: string
}) {
  return (
    <div className="relative z-20 mx-auto mb-8 max-w-3xl px-4 text-center sm:mb-10 md:mb-12">
      {kicker && (
        <p
          className={`${cinzel.className} mb-2 text-[0.6rem] font-semibold uppercase tracking-[0.34em] min-[400px]:tracking-[0.38em] sm:text-[0.65rem] sm:tracking-[0.44em]`}
          style={onBgGold}
        >
          {kicker}
        </p>
      )}
      <h2
        className="relative mx-auto my-4 w-full max-w-full text-center sm:my-5 md:my-6"
        style={
          {
            "--title-size": "clamp(1.85rem, 9.5vw, 4.5rem)",
            "--script-size": "clamp(1.35rem, 6.6vw, 2.9rem)",
          } as React.CSSProperties
        }
      >
        <span
          className={`${theSeasons.className} block pb-1 uppercase leading-[0.78] tracking-[0.08em] min-[400px]:tracking-[0.11em] sm:pb-1.5 sm:tracking-[0.15em] md:tracking-[0.18em]`}
          style={{ fontSize: "var(--title-size)", ...onBg }}
        >
          <SpecialCharFont text={title} />
        </span>
        <span
          aria-hidden
          className={`${aboveTheBeyond.className} mx-auto block w-fit max-w-full px-1 leading-[1.25]`}
          style={{ fontSize: "var(--script-size)", marginTop: "0.4em", ...onBgGold }}
        >
          <SpecialCharFont text={subtitle} />
        </span>
        <span className="sr-only">{subtitle}</span>
      </h2>
      {intro && (
        <p
          className="font-goudy-italic mx-auto max-w-2xl px-2 text-[0.8rem] leading-[1.62] sm:text-[0.875rem] sm:leading-[1.65] md:text-[0.9375rem]"
          style={{ ...onBg, fontWeight: 600 }}
        >
          {intro}
        </p>
      )}
      <div className="mt-4 sm:mt-5">
        <RoseDivider />
      </div>
    </div>
  )
}

function LinkQr({ url, size, label }: { url: string; size: number; label: string }) {
  const { fg, bg } = useQrColors() // --color-qr-fg / --color-qr-bg in globals.css
  return (
    <div className="flex shrink-0 flex-col items-center gap-1">
      <div className="rounded-lg p-1.5 shadow-sm" style={{ backgroundColor: bg }}>
        <QRCodeSVG value={url} size={size} level="M" fgColor={fg} bgColor={bg} />
      </div>
      <p className="font-goudy-italic text-[0.625rem] leading-none sm:text-[0.6875rem]" style={{ color: C.label }}>
        {label}
      </p>
    </div>
  )
}

function LinkButton({
  url,
  label,
  ariaLabel,
  icon = "map",
}: {
  url: string
  label: string
  ariaLabel: string
  icon?: "map" | "external"
}) {
  const Icon = icon === "map" ? Navigation : ExternalLink
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={`${cinzel.className} flex w-full items-center justify-center gap-1.5 rounded-full border px-4 py-2.5 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] transition-all duration-300 hover:scale-[1.02] hover:brightness-110 active:scale-[0.98] sm:text-xs`}
      style={primaryBtnStyle}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
      <span>{label}</span>
    </a>
  )
}

// QR + button row at the foot of a card
function CardFooter({ url, qrSize, qrLabel, button }: { url: string; qrSize: number; qrLabel: string; button: ReactNode }) {
  return (
    <div className="mt-auto pt-4">
      <div className="flex items-center gap-3 border-t pt-4 sm:gap-4" style={{ borderColor: hairline }}>
        <LinkQr url={url} size={qrSize} label={qrLabel} />
        <div className="min-w-0 flex-1">{button}</div>
      </div>
    </div>
  )
}

type HotelItem = {
  name: string
  area?: string
  description?: string
  image?: string
  mapsLink?: string
}

function HotelCard({ hotel }: { hotel: HotelItem }) {
  const url = mapsUrl(hotel.name, hotel.mapsLink)
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.25rem] sm:rounded-[1.5rem]" style={cardStyle}>
      <div className="relative aspect-[16/10] w-full overflow-hidden" style={{ background: "var(--color-motif-silver)" }}>
        {hotel.image && (
          <Image
            src={hotel.image}
            alt={hotel.name}
            fill
            className="object-cover object-center transition-transform duration-[1200ms] ease-out group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
          />
        )}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
          style={{ background: "linear-gradient(to top, color-mix(in srgb, var(--color-coastal-deep) 35%, transparent), transparent)" }}
        />
        {hotel.area && (
          <span
            className={`${cinzel.className} absolute left-3 top-3 rounded-full border px-2.5 py-1 text-[0.5625rem] font-semibold uppercase tracking-[0.14em] shadow-sm backdrop-blur-sm sm:text-[0.625rem]`}
            style={{
              backgroundColor: "color-mix(in srgb, var(--color-motif-soft) 90%, transparent)",
              borderColor: hairline,
              color: C.heading,
            }}
          >
            {hotel.area}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3
          className={`${theSeasons.className} text-base uppercase leading-snug tracking-[0.06em] sm:text-lg`}
          style={{ color: C.heading }}
        >
          <SpecialCharFont text={hotel.name} />
        </h3>
        {hotel.description && (
          <p className="font-goudy-italic mt-2 text-[0.8125rem] leading-[1.6] sm:text-[0.875rem]" style={{ color: C.body }}>
            {hotel.description}
          </p>
        )}
        <CardFooter
          url={url}
          qrSize={64}
          qrLabel="Scan for map"
          button={<LinkButton url={url} label="Get Directions" ariaLabel={`Get directions to ${hotel.name}`} />}
        />
      </div>
    </article>
  )
}

type RoomRate = { name: string; single?: string; double?: string }
type SuiteRate = { name: string; tag?: string; capacity?: string; rate?: string }
type RatesData = {
  title?: string
  bookingNote?: string
  rooms?: RoomRate[]
  suites?: SuiteRate[]
  extraPerson?: string
  footnote?: string
}
type FeaturedHotelData = HotelItem & {
  show?: boolean
  kicker?: string
  rates?: RatesData
}

// "PHP 5,800" → small "PHP" + bold amount
function Price({ value, size = "md" }: { value?: string; size?: "md" | "lg" }) {
  if (!value) return <span style={{ color: C.soft }}>—</span>
  const m = value.match(/^([A-Za-z₱]+)\s*(.+)$/)
  return (
    <span className="inline-flex items-baseline gap-1 whitespace-nowrap">
      {m && (
        <span className={`${cinzel.className} text-[0.5625rem] font-semibold tracking-[0.12em] sm:text-[0.625rem]`} style={{ color: C.label }}>
          {m[1]}
        </span>
      )}
      <span
        className={`${cinzel.className} font-bold tabular-nums ${size === "lg" ? "text-[1.125rem] sm:text-[1.3rem]" : "text-[0.95rem] sm:text-[1.05rem]"}`}
        style={{ color: C.heading }}
      >
        {m ? m[2] : value}
      </span>
    </span>
  )
}

function RateGroupTitle({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <span className={`${cinzel.className} text-[0.625rem] font-bold uppercase tracking-[0.26em] sm:text-[0.6875rem]`} style={{ color: C.label }}>
        {children}
      </span>
      <span className="h-px flex-1" style={{ background: hairline }} aria-hidden />
      {hint && (
        <span className="font-goudy-italic text-[0.75rem]" style={{ color: C.soft }}>
          {hint}
        </span>
      )}
    </div>
  )
}

const rateCardStyle = {
  background: "color-mix(in srgb, white 55%, var(--color-motif-soft))",
  borderColor: hairline,
} as const
const rateName = `${theSeasons.className} text-[0.95rem] uppercase leading-snug tracking-[0.06em] sm:text-[1.05rem]`
const priceLabel = `${cinzel.className} text-[0.5625rem] font-semibold uppercase tracking-[0.18em]`

function RateSheet({ rates }: { rates: RatesData }) {
  const rooms = (rates.rooms ?? []).filter(Boolean)
  const suites = (rates.suites ?? []).filter(Boolean)
  return (
    <div className="space-y-6 sm:space-y-7">
      {rooms.length > 0 && (
        <section aria-label="Rooms">
          <RateGroupTitle>Rooms</RateGroupTitle>
          <ul className="grid gap-3 sm:grid-cols-2">
            {rooms.map((r) => (
              <li key={r.name} className="rounded-xl border p-3.5 sm:p-4" style={rateCardStyle}>
                <p className={rateName} style={{ color: C.heading }}>
                  <SpecialCharFont text={r.name} />
                </p>
                {/* Single / Double side by side, split by a gold hairline */}
                <dl className="mt-3 grid grid-cols-2 divide-x rounded-lg border" style={{ borderColor: hairline }}>
                  {[
                    { label: "Single", value: r.single },
                    { label: "Double", value: r.double },
                  ].map((p) => (
                    <div key={p.label} className="px-3 py-2.5 text-center" style={{ borderColor: hairline }}>
                      <dt className={priceLabel} style={{ color: C.soft }}>
                        {p.label}
                      </dt>
                      <dd className="mt-1">
                        <Price value={p.value} />
                      </dd>
                    </div>
                  ))}
                </dl>
              </li>
            ))}
          </ul>
        </section>
      )}

      {suites.length > 0 && (
        <section aria-label="Suites">
          <RateGroupTitle>Suites</RateGroupTitle>
          <ul className="grid gap-3 sm:grid-cols-3">
            {suites.map((s) => (
              <li
                key={s.name}
                className="flex items-center justify-between gap-3 rounded-xl border p-3.5 sm:flex-col sm:items-start sm:justify-start sm:p-4"
                style={rateCardStyle}
              >
                <div className="min-w-0">
                  <p className={rateName} style={{ color: C.heading }}>
                    <SpecialCharFont text={s.name} />
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    {s.capacity && (
                      <span className="font-goudy-italic text-[0.8125rem]" style={{ color: C.soft }}>
                        {s.capacity}
                      </span>
                    )}
                    {s.tag && (
                      <span
                        className={`${cinzel.className} rounded-full border px-1.5 py-px text-[0.5rem] font-bold tracking-[0.12em]`}
                        style={{ borderColor: hairline, color: C.label }}
                      >
                        {s.tag}
                      </span>
                    )}
                  </div>
                </div>
                <div className="shrink-0 sm:mt-auto sm:w-full sm:border-t sm:pt-3" style={{ borderColor: hairline }}>
                  <Price value={s.rate} size="lg" />
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {rates.extraPerson && (
        <div className="flex items-center justify-between gap-3 rounded-xl border px-4 py-3" style={softPanelStyle}>
          <div>
            <p className={rateName} style={{ color: C.heading }}>
              <SpecialCharFont text="Extra Person" />
            </p>
            <p className="font-goudy-italic text-[0.75rem]" style={{ color: C.soft }}>
              Added to any room or suite
            </p>
          </div>
          <Price value={rates.extraPerson} />
        </div>
      )}

      {rates.bookingNote && (
        <p className="font-goudy-italic border-l-2 pl-3 text-[0.875rem] leading-[1.6]" style={{ borderColor: C.gold, color: C.heading }}>
          {rates.bookingNote}
        </p>
      )}
      {rates.footnote && (
        <p className="font-goudy-italic text-center text-[0.75rem]" style={{ color: C.soft }}>
          {rates.footnote}
        </p>
      )}
    </div>
  )
}

function RatesDialog({ hotel, rates, mapsLink }: { hotel: string; rates: RatesData; mapsLink: string }) {
  const roomCount = (rates.rooms ?? []).length + (rates.suites ?? []).length
  return (
    <Dialog.Root>
      {/* Teaser panel — the whole panel opens the rates sheet */}
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="group mt-5 w-full rounded-2xl border p-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 sm:p-5"
          style={{ ...softPanelStyle, ["--tw-ring-color" as string]: "var(--color-welcome-gold)" }}
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border sm:h-12 sm:w-12"
              style={{ borderColor: hairline, background: "var(--color-motif-deep)" }}
              aria-hidden
            >
              <BedDouble className="h-5 w-5" style={{ color: C.gold }} />
            </span>
            <div className="min-w-0 flex-1">
              <p className={`${cinzel.className} text-[0.5625rem] font-bold uppercase tracking-[0.24em]`} style={{ color: C.label }}>
                Exclusive for our guests
              </p>
              <p className={`${theSeasons.className} mt-0.5 text-[0.95rem] uppercase leading-snug tracking-[0.06em] sm:text-[1.05rem]`} style={{ color: C.heading }}>
                <SpecialCharFont text={rates.title || "Wedding Room Rates"} />
              </p>
              {/* No prices here — amounts only show inside the rates sheet */}
              {roomCount > 0 && (
                <p className="font-goudy-italic mt-0.5 text-[0.8125rem]" style={{ color: C.body }}>
                  {roomCount} rooms &amp; suites · tap to see rates
                </p>
              )}
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1" style={{ color: C.label }} aria-hidden />
          </div>
          <span
            className={`${cinzel.className} mt-3 flex w-full items-center justify-center gap-1.5 rounded-full border px-4 py-2 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] sm:text-xs`}
            style={primaryBtnStyle}
          >
            View Room Rates
          </span>
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm" />
        {/* Bottom sheet on phones, centered card from sm up */}
        <Dialog.Content
          className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-8 data-[state=closed]:slide-out-to-bottom-8 fixed inset-x-0 bottom-0 z-[101] flex max-h-[92dvh] flex-col overflow-hidden rounded-t-[1.5rem] border duration-300 focus:outline-none sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:max-h-[88vh] sm:w-[calc(100%-3rem)] sm:max-w-3xl sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[1.75rem] sm:data-[state=open]:slide-in-from-bottom-4"
          style={cardStyle}
        >
          {/* Header band */}
          <div
            className="relative shrink-0 px-5 pb-5 pt-6 text-center sm:px-8 sm:pb-6 sm:pt-8"
            style={{ background: "linear-gradient(180deg, var(--color-motif-royal) 0%, var(--color-motif-deep) 100%)" }}
          >
            <span className="absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-white/40 sm:hidden" aria-hidden />
            <Dialog.Close
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 sm:right-4 sm:top-4"
              style={{ borderColor: hairline, color: "#fff" }}
              aria-label="Close room rates"
            >
              <X className="h-4 w-4" />
            </Dialog.Close>
            <p className={`${cinzel.className} text-[0.5625rem] font-bold uppercase tracking-[0.3em] sm:text-[0.625rem]`} style={onBgGold}>
              <SpecialCharFont text={hotel} />
            </p>
            <Dialog.Title
              className={`${theSeasons.className} mt-2 text-[1.35rem] uppercase leading-tight tracking-[0.08em] sm:text-[1.9rem]`}
              style={onBg}
            >
              <SpecialCharFont text={rates.title || "Wedding Room Rates"} />
            </Dialog.Title>
            <Dialog.Description className="font-goudy-italic mx-auto mt-1.5 max-w-md text-[0.8125rem] leading-[1.55] sm:text-[0.875rem]" style={{ color: "color-mix(in srgb, white 85%, transparent)" }}>
              Special rates arranged for our wedding guests.
            </Dialog.Description>
          </div>

          {/* Scrollable rates */}
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-8 sm:py-7">
            <RateSheet rates={rates} />
          </div>

          {/* Footer actions */}
          <div className="flex shrink-0 gap-2 border-t px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:gap-3 sm:px-8 sm:py-4" style={{ borderColor: hairline }}>
            <Dialog.Close
              className={`${cinzel.className} flex-1 rounded-full border px-4 py-2.5 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] transition-all hover:brightness-95 sm:text-xs`}
              style={{ borderColor: hairline, color: C.heading, background: C.paper }}
            >
              Close
            </Dialog.Close>
            <div className="flex-1">
              <LinkButton url={mapsLink} label="Directions" ariaLabel={`Get directions to ${hotel}`} />
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function FeaturedHotel({ hotel }: { hotel: FeaturedHotelData }) {
  const url = mapsUrl(hotel.name, hotel.mapsLink)
  return (
    <article className="relative mx-auto max-w-6xl overflow-hidden rounded-[1.5rem] sm:rounded-[2rem]" style={cardStyle}>
      <div className="grid md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        <div className="relative aspect-[16/10] w-full overflow-hidden md:aspect-auto md:min-h-[26rem]" style={{ background: "var(--color-motif-silver)" }}>
          {hotel.image && (
            <Image src={hotel.image} alt={hotel.name} fill className="object-cover object-center" sizes="(max-width: 768px) 100vw, 600px" />
          )}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background: "linear-gradient(to top, color-mix(in srgb, var(--color-coastal-deep) 45%, transparent) 0%, transparent 40%)" }}
          />
          {hotel.area && (
            <span
              className={`${cinzel.className} absolute left-3 top-3 rounded-full border px-2.5 py-1 text-[0.5625rem] font-semibold uppercase tracking-[0.14em] shadow-sm backdrop-blur-sm sm:left-4 sm:top-4 sm:text-[0.625rem]`}
              style={{ backgroundColor: "color-mix(in srgb, var(--color-motif-soft) 90%, transparent)", borderColor: hairline, color: C.heading }}
            >
              {hotel.area}
            </span>
          )}
        </div>

        <div className="flex flex-col p-5 sm:p-7 md:p-8 lg:p-10">
          {hotel.kicker && (
            <p className={`${cinzel.className} text-[0.5625rem] font-semibold uppercase tracking-[0.28em] sm:text-[0.625rem]`} style={{ color: C.label }}>
              {hotel.kicker}
            </p>
          )}
          <h3
            className={`${theSeasons.className} mt-2 text-[1.5rem] uppercase leading-[1.05] tracking-[0.06em] sm:text-[1.85rem] lg:text-[2.2rem]`}
            style={{ color: C.heading }}
          >
            <SpecialCharFont text={hotel.name} />
          </h3>
          <GoldRule className="mt-3 w-20" />
          {hotel.description && (
            <p className="font-goudy-italic mt-4 text-[0.875rem] leading-[1.65] sm:text-[0.9375rem]" style={{ color: C.body }}>
              {hotel.description}
            </p>
          )}
          {hotel.rates && <RatesDialog hotel={hotel.name} rates={hotel.rates} mapsLink={url} />}
          <CardFooter
            url={url}
            qrSize={72}
            qrLabel="Scan for map"
            button={<LinkButton url={url} label="Get Directions" ariaLabel={`Get directions to ${hotel.name}`} />}
          />
        </div>
      </div>
    </article>
  )
}

type Festival = {
  show?: boolean
  kicker?: string
  name: string
  year?: string
  dates?: string
  image?: string
  description?: string
  note?: string
  highlights?: string[]
  link?: string
  linkLabel?: string
}

function FestivalFeature({ festival }: { festival: Festival }) {
  const highlights = (festival.highlights ?? []).filter(Boolean)
  return (
    <article
      className="relative mx-auto grid max-w-5xl overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]"
      style={cardStyle}
    >
      {festival.image && (
        <div className="relative aspect-[4/3] w-full overflow-hidden md:aspect-auto md:min-h-full">
          <Image
            src={festival.image}
            alt={`${festival.name} ${festival.year ?? ""}`.trim()}
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 480px"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background: "linear-gradient(to top, color-mix(in srgb, var(--color-coastal-deep) 55%, transparent) 0%, transparent 45%)" }}
          />
          {festival.dates && (
            <span
              className={`${cinzel.className} absolute bottom-3 left-3 right-3 mx-auto flex w-fit items-center gap-1.5 rounded-full border px-3 py-1.5 text-[0.625rem] font-semibold uppercase tracking-[0.14em] shadow-md backdrop-blur-sm sm:bottom-4 sm:text-[0.6875rem] md:hidden`}
              style={{ backgroundColor: "color-mix(in srgb, var(--color-motif-deep) 82%, transparent)", borderColor: hairline, color: "#fff" }}
            >
              <CalendarDays className="h-3.5 w-3.5 shrink-0" style={{ color: C.gold }} aria-hidden />
              {festival.dates}
            </span>
          )}
        </div>
      )}

      <div className="flex flex-col p-5 sm:p-7 md:p-8 lg:p-10">
        {festival.kicker && (
          <p
            className={`${cinzel.className} text-[0.5625rem] font-semibold uppercase tracking-[0.28em] sm:text-[0.625rem]`}
            style={{ color: C.label }}
          >
            {festival.kicker}
          </p>
        )}
        <h3 className="mt-2">
          <span
            className={`${theSeasons.className} block text-[1.5rem] uppercase leading-[1.05] tracking-[0.06em] sm:text-[1.85rem] lg:text-[2.2rem]`}
            style={{ color: C.heading }}
          >
            <SpecialCharFont text={festival.name} />
          </span>
          {festival.year && (
            <span
              className={`${aboveTheBeyond.className} mt-1 block text-[1.6rem] leading-[1.2] sm:text-[2rem]`}
              style={{ color: "var(--color-motif-accent)" }}
            >
              <SpecialCharFont text={festival.year} />
            </span>
          )}
        </h3>

        {festival.dates && (
          <p
            className={`${cinzel.className} mt-3 hidden w-fit items-center gap-1.5 rounded-full border px-3 py-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] md:inline-flex`}
            style={{ ...softPanelStyle, color: C.heading }}
          >
            <CalendarDays className="h-3.5 w-3.5 shrink-0" style={{ color: C.label }} aria-hidden />
            {festival.dates}
          </p>
        )}

        {festival.description && (
          <p className="font-goudy-italic mt-4 text-[0.875rem] leading-[1.65] sm:text-[0.9375rem]" style={{ color: C.body }}>
            {festival.description}
          </p>
        )}

        {highlights.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-1.5 sm:gap-2" aria-label="Festival highlights">
            {highlights.map((h) => (
              <li
                key={h}
                className={`${cinzel.className} rounded-full border px-2.5 py-1 text-[0.5625rem] font-semibold uppercase tracking-[0.12em] sm:text-[0.625rem]`}
                style={{ ...softPanelStyle, color: C.heading }}
              >
                {h}
              </li>
            ))}
          </ul>
        )}

        {festival.note && (
          <p
            className="font-goudy-italic mt-5 border-l-2 pl-3 text-[0.8125rem] leading-[1.6] sm:text-[0.875rem]"
            style={{ borderColor: C.gold, color: C.heading }}
          >
            {festival.note}
          </p>
        )}

        {festival.link && (
          <CardFooter
            url={festival.link}
            qrSize={64}
            qrLabel="Scan to learn more"
            button={
              <LinkButton
                url={festival.link}
                label={festival.linkLabel || "Learn More"}
                ariaLabel={`Learn more about the ${festival.name}`}
                icon="external"
              />
            }
          />
        )}
      </div>
    </article>
  )
}

type ActivityItem = {
  name: string
  category?: string
  description?: string
  mapsLink?: string
}

// Editorial card: gold numeral + category, no icon
function ActivityCard({ activity, index }: { activity: ActivityItem; index: number }) {
  const url = mapsUrl(activity.name, activity.mapsLink)
  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-[1.25rem] p-5 sm:rounded-[1.5rem] sm:p-6" style={cardStyle}>
      <span
        aria-hidden
        className={`${cinzel.className} pointer-events-none absolute -right-1 -top-3 select-none text-[4.5rem] leading-none opacity-[0.09] sm:text-[5.5rem]`}
        style={{ color: C.heading }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="flex items-center gap-2">
        <span
          className={`${cinzel.className} text-[0.75rem] font-semibold tracking-[0.1em] sm:text-[0.8125rem]`}
          style={{ color: C.label }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="h-px w-6" style={{ background: hairline }} aria-hidden />
        {activity.category && (
          <span
            className={`${cinzel.className} text-[0.5625rem] font-semibold uppercase tracking-[0.2em] sm:text-[0.625rem]`}
            style={{ color: C.label }}
          >
            {activity.category}
          </span>
        )}
      </div>
      <h3
        className={`${theSeasons.className} mt-3 text-[1.05rem] uppercase leading-snug tracking-[0.06em] sm:text-[1.2rem]`}
        style={{ color: C.heading }}
      >
        <SpecialCharFont text={activity.name} />
      </h3>
      <GoldRule className="mt-3 w-16" />
      {activity.description && (
        <p className="font-goudy-italic mt-3 text-[0.8125rem] leading-[1.6] sm:text-[0.875rem]" style={{ color: C.body }}>
          {activity.description}
        </p>
      )}
      <CardFooter
        url={url}
        qrSize={56}
        qrLabel="Scan for map"
        button={<LinkButton url={url} label="View on Map" ariaLabel={`View ${activity.name} on the map`} />}
      />
    </article>
  )
}

export function RecommendedHotel() {
  const siteConfig = useSiteConfig()
  const reduceMotion = useReducedMotion()
  const { hotels, festival, activities } = siteConfig.recommendedStay
  const featured = hotels.featured
  const ghostText = ghostTextFor(siteConfig)

  const hotelItems = hotels.items.filter((h) => h && h.show !== false)
  const activityItems = activities.items.filter((a) => a && a.show !== false)
  const showFestival = !!festival && festival.show !== false

  const showFeatured = !!featured && featured.show !== false
  const showHotels = showFeatured || hotelItems.length > 0

  if (!showHotels && activityItems.length === 0 && !showFestival) return null

  return (
    <div
      className={`red-velvet-root ${theSeasons.variable} ${aboveTheBeyond.variable} relative w-full overflow-hidden`}
      style={{ background: sectionBg }}
    >
      {/* Red circle pattern (colors: components/sections/love-story-red.css) + gold dust */}
      <PlainBubbles />
      <RisingMotes count={40} />
      {/* Ghost lettering down the edges — tall section, so more copies */}
      <GhostMarquee
        text={ghostText}
        className="section-ghost"
        fontClassName={theSeasons.className}
        still={!!reduceMotion}
        repeat={10}
      />

      <Section id="stay" className="relative z-10 overflow-hidden pt-14 pb-12 sm:pt-16 sm:pb-14 md:pt-20 md:pb-16 lg:pt-24 lg:pb-20">
        {showHotels && (
          <div className="relative z-20">
            <SectionHeader kicker={hotels.kicker} title={hotels.title} subtitle={hotels.subtitle} intro={hotels.intro} />
            {showFeatured && (
              <div className="mb-10 px-2 sm:mb-12 sm:px-4">
                <FeaturedHotel hotel={featured} />
              </div>
            )}
            {showFeatured && hotelItems.length > 0 && (
              <div className="mx-auto mb-6 flex max-w-md items-center gap-3 px-6 sm:mb-8" aria-hidden>
                <span className="h-px flex-1" style={{ background: "linear-gradient(to right, transparent, var(--color-welcome-gold))" }} />
                <span className={`${cinzel.className} text-[0.6rem] font-semibold uppercase tracking-[0.3em] sm:text-[0.65rem]`} style={onBgGold}>
                  More places we love
                </span>
                <span className="h-px flex-1" style={{ background: "linear-gradient(to left, transparent, var(--color-welcome-gold))" }} />
              </div>
            )}
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-2 sm:grid-cols-2 sm:gap-5 sm:px-4 lg:grid-cols-3 lg:gap-6">
              {hotelItems.map((hotel) => (
                <HotelCard key={hotel.name} hotel={hotel} />
              ))}
            </div>
          </div>
        )}

        {(showFestival || activityItems.length > 0) && (
          <div id="explore" className={`relative z-20 ${showHotels ? "mt-16 sm:mt-20 md:mt-24" : ""}`}>
            <SectionHeader
              kicker={activities.kicker}
              title={activities.title}
              subtitle={activities.subtitle}
              intro={activities.intro}
            />

            {showFestival && (
              <div className="px-2 sm:px-4">
                <FestivalFeature festival={festival} />
              </div>
            )}

            {activityItems.length > 0 && (
              <>
                {showFestival && (
                  <div className="mx-auto mb-6 mt-12 flex max-w-md items-center gap-3 px-6 sm:mb-8 sm:mt-14" aria-hidden>
                    <span className="h-px flex-1" style={{ background: "linear-gradient(to right, transparent, var(--color-welcome-gold))" }} />
                    <span
                      className={`${cinzel.className} text-[0.6rem] font-semibold uppercase tracking-[0.3em] sm:text-[0.65rem]`}
                      style={onBgGold}
                    >
                      Around the city
                    </span>
                    <span className="h-px flex-1" style={{ background: "linear-gradient(to left, transparent, var(--color-welcome-gold))" }} />
                  </div>
                )}
                <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-2 sm:grid-cols-2 sm:gap-5 sm:px-4 lg:grid-cols-3 lg:gap-6">
                  {activityItems.map((activity, i) => (
                    <ActivityCard key={activity.name} activity={activity} index={i} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </Section>
    </div>
  )
}
