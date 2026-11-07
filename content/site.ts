import {
  proposalRoleDefinitions,
  proposalRoleIdAliases,
} from "@/content/proposal-roles"

export type TimelineIconName =
  | "arrival"
  | "rings"
  | "departure"
  | "cocktail"
  | "fireworks"
  | "dance"
  // Extra program icons
  | "sun"
  | "moon"
  | "crown"
  | "rose"
  | "gift"
  | "toast"
  | "candle"
  | "music"
  | "video"
  | "dinner"

export type AttireGroupId = "sponsors" | "entourage" | "guests"
// A palette color: "#9CAF88" or { name: "Sage", hex: "#9CAF88" }
export type AttireColor = string | { name: string; hex: string }

/* ============================================================================
   SOP — CREATING / UPDATING A WEDDING INVITATION
   ----------------------------------------------------------------------------
   This file is the single source of truth for the couple's content. Pages,
   metadata (link previews), robots.txt, sitemap.xml, QR codes, the table
   finder and proposal pages all read from here. Avoid hard-coding the
   couple's names, dates, URLs or image paths in components — add them here.

   Colors live in app/globals.css (→ "MOTIF COLORS — WEDDING"), not here.

   NEW INVITATION — work top to bottom:
     1. COUPLE          bride + groom ({celebrant} in any text → "Bride & Groom")
     2. DATE & TIMES    wedding date, day, guest arrival / ceremony / reception times
     3. VENUE           name, address, Google Maps link, photos;
                        VENUE_CARDS = labels on the Event Details venue card
     4. RSVP            deadline, coordinator, phone; HASHTAGS
     5. WEBSITE         SITE_URL = the live domain (keep the trailing "/").
                        LINK_PREVIEW_IMAGE = 1200×630 JPG for Facebook/Messenger.
                        NEXT_PUBLIC_SITE_URL (env, e.g. on Vercel) overrides SITE_URL.
     6. LOOK & FEEL     DISPLAY_MODE "plain" or "photos"
     7. SHARED IMAGES   monogram, name lettering, wax seal, theme song, COUPLE_PHOTOS
     8. googleAPI       new Apps Script / Form URLs for THIS couple's sheet —
                        never reuse a previous client's (guests would mix).
     9. SECTIONS        program flow, attire, reminders, FAQ, gift guide,
                        theme song, snap & share, socials.
    10. Search for "⚠ check" and replace anything still left over.

   BEFORE GOING LIVE:
     • Put every referenced file in /public (paths are case-sensitive on Vercel).
     • Run `npm run build` to catch typos.
     • Paste the live URL in https://developers.facebook.com/tools/debug/ and
       click "Scrape Again" so Facebook picks up the new title + preview image.
     • Test RSVP search, a test RSVP submission, messages and /table on mobile.

   CONVENTIONS:
     • Image paths start with "/" and are relative to /public.
     • "" on a decoration/image hides it; show: false hides a card/account/link.
     • Placeholders like {celebrant} (the couple), {name}, {deadline} are filled automatically —
       keep the braces when editing text.
     • ⚠ marks values that still need the client's confirmation.
   ============================================================================ */

/* ============================================================================
   QUICK SETUP — edit these first.
   Every section below reads from here, so one change updates the whole site
   (loader, envelope, hero, details, program, RSVP, FAQ, footer, …).
   ============================================================================ */

// ── The couple ──────────────────────────────────────────────────────────────
const COUPLE = {
  bride: "Sunshyne",
  brideNickname: "Sunshyne",
  groom: "Brandon",
  groomNickname: "Brandon",
}
const COUPLE_NAMES = `${COUPLE.brideNickname} & ${COUPLE.groomNickname}`

// Sections read "celebrant" for the display name — on a wedding that is the couple.
const CELEBRANT = {
  fullName: COUPLE_NAMES,
  nickname: COUPLE_NAMES, // Used everywhere as {celebrant}
  title: "Bride & Groom",
}

// ── Event details ───────────────────────────────────────────────────────────
const EVENT = {
  type: "Wedding",
  theme: "A Tale as Old as Time",
  motif: "Beauty and the Beast — The Enchanted Rose",
  colors: "Midnight Blue, Antique Gold, Crimson Rose, Soft Ivory",
  themeSong: {
    title: "Beauty and the Beast",
    artist: "Cello Cover",
  },
}

// ── Date & times ────────────────────────────────────────────────────────────
const EVENT_DATE = "August 14, 2027"
const EVENT_DAY = "Saturday"

const TIMES = {
  guestArrival: "9:00 AM", // ⚠ check — from the earlier draft, confirm with the couple
  program: "3:30 PM", // Ceremony — countdown target
  end: "5:30 PM", // Reception (cocktail hour at Dusit Thani)
}

// ── Venue ───────────────────────────────────────────────────────────────────
const VENUE = {
  name: "Dusit Thani", // ⚠ check — add the church / venue name once confirmed
  address: "Stella Hizon Reyes Drive, Bo Pampanga, Davao City, 8000, Philippines",
  map: "https://maps.app.goo.gl/JUsqPDCHCKBXAht69", // Google Maps pin (directions button + QR); "" hides the map QR and buttons
  // Step-by-step directions (FAQ) — add once the venue is confirmed
  directions: [] as string[],
  landmarks: [] as string[],
  // Venue card slideshow (Event Details) — [] shows the gold monogram panel
  photos: ["/Details/venue (6).jpg", "/Details/venue (7).jpg", "/Details/venue (8).jpg"] as string[],
}
const CEREMONY_VENUE = VENUE
const RECEPTION_VENUE = VENUE

// ── Venue card (Event Details section) ──────────────────────────────────────
// layout:
//   "combined" = ONE card (ceremony and reception at the same place)
//   "separate" = two cards (CEREMONY_VENUE + RECEPTION_VENUE)
// badge        = small pill on the photo
// sectionLabel = label above the venue name
// showDate     = show the big Month / Day / Year
// showArrival  = show "Arrival: <guest arrival time>" (otherwise "At <time>")
const VENUE_CARDS = {
  layout: "combined" as "separate" | "combined",
  combined: {
    badge: "The Wedding",
    sectionLabel: "Venue",
    showDate: true,
    showArrival: true,
    // Time rows on the card, e.g. "Ceremony 9:30 AM | Reception 12:00 noon"
    ceremonyLabel: "Ceremony",
    receptionLabel: "Reception",
    // true = also show the reception time on the card
    showReceptionTime: true,
  },
  ceremony: {
    show: true,
    badge: "Ceremony",
    sectionLabel: "Venue",
    showDate: true,
    showArrival: true,
  },
  reception: {
    show: true,
    badge: "Reception",
    sectionLabel: "Venue",
    showDate: false,
    showArrival: false,
  },
}

// ── RSVP & contact ──────────────────────────────────────────────────────────
const RSVP = {
  deadline: "", // ⚠ check — add the confirmed RSVP deadline
  coordinator: COUPLE_NAMES, // ⚠ check — add the coordinator's name
  phone: "", // ⚠ check — add the coordinator's number
  alternatePhone: "",
}

const HASHTAGS = [
  "#SunshyneAndBrandon", // ⚠ check — confirm with the couple
  "#TaleAsOldAsTime",
]
// ── Attire guide (Event Details → Attire Guidelines) ────────────────────────
// SHOW = which cards to display AND their order, top to bottom. Examples:
//   ["guests"]                            guests only
//   ["entourage", "guests"]               entourage + guests
//   []                                    hide the whole attire guide
// Each card: fill in only what you need — anything left "" or [] is hidden.
//   image:     illustration path in /public ("" = no image)
//   palette:   colors for this card — "#9CAF88" or { name: "Sage", hex: "#9CAF88" }
//   ladies / gentlemen:
//     label:     e.g. "Ladies", "Gentlemen" — leave "" to hide the heading (good for one inclusive blurb)
//     details:   the dress code text ("" hides this half of the card)
//     highlight: phrase inside details shown bold + underlined ("" for none)
// ⚠ check — dress code drawn from the motif; confirm with the couple
const DRESS_PALETTE: AttireColor[] = [
  { name: "Deep Navy", hex: "#0B1E4A" },
  { name: "Royal Navy", hex: "#153368" },
  { name: "Sapphire", hex: "#2B5C9B" },
  { name: "Burgundy", hex: "#6B0F1A" },
]

const ATTIRE = {
  show: ["guests"] as AttireGroupId[], // one dress code for everyone

  sponsors: {
    title: "Principal Sponsors",
    image: "",
    palette: [],
    ladies: {
      label: "Ninang",
      details: "Elegant formal gowns in navy, sapphire blue, or burgundy.",
      highlight: "Formal Gowns",
    },
    gentlemen: {
      label: "Ninong",
      details: "Barong Tagalog or a dark formal suit with tailored slacks.",
      highlight: "Barong Tagalog",
    },
  },

  entourage: {
    title: "Entourage",
    image: "",
    palette: [],
    ladies: {
      label: "Ladies",
      details: "Floor-length gowns in the colors of the motif.",
      highlight: "Floor-length Gowns",
    },
    gentlemen: {
      label: "Gentlemen",
      details: "Dark formal suits with touches of sapphire blue or burgundy.",
      highlight: "Dark Formal Suits",
    },
  },

  guests: {
    title: "", // no heading — this dress code is for everyone
    image: "/Details/guestAttire.png",
    palette: DRESS_PALETTE,
    // One inclusive blurb (no Ladies / Gentlemen headings); \n starts a new line
    ladies: {
      label: "",
      details:
        "Come in your most elegant best — formal wear fit for an enchanted ball.\n\n" +
        "Kindly dress in navy, sapphire blue, or burgundy, and leave white and ivory for the bride.",
      highlight: "navy, sapphire blue, or burgundy",
    },
    gentlemen: {
      label: "",
      details: "",
      highlight: "",
    },
  },
}

// ── Website address (used for QR codes, link previews, table finder) ────────
// NEXT_PUBLIC_SITE_URL (env) overrides this when set.
const SITE_URL = "https://sunshyne-and-brandon.weddinginvitationrsvp.com/" // ⚠ check — replace if the couple gets a custom domain
// Image shown when the link is shared (Facebook, Messenger, Viber, X, …).
// Messenger is strict: use a JPG exactly 1200×630, under ~300 KB. When you replace it,
// change the file name (or bump ?v=) so Facebook fetches the new one instead of its cache.
const LINK_PREVIEW_IMAGE = "/Details/LinkPreview.png?v=1"
const LINK_PREVIEW_IMAGE_SIZE = { width: 1200, height: 630, type: "image/jpeg" }

// Site address with env override applied and no trailing slash — no need to edit
export const canonicalSiteUrl = (process.env.NEXT_PUBLIC_SITE_URL || SITE_URL).replace(/\/$/, "")
// A leftover NEXT_PUBLIC_SITE_URL from another client's project makes every link preview
// point at the wrong site (Messenger follows og:url) — flag it in the build log.
if (canonicalSiteUrl !== SITE_URL.replace(/\/$/, "")) {
  console.warn(
    `[site] NEXT_PUBLIC_SITE_URL (${canonicalSiteUrl}) differs from SITE_URL (${SITE_URL}). ` +
      "Link previews, QR codes and canonical URLs will use the env value.",
  )
}

// ── Look & feel ─────────────────────────────────────────────────────────────
// "plain"  = no photos anywhere: pearl pattern backgrounds, gold ornaments,
//            hides photo-only blocks (best until the couple's photos arrive)
// "photos" = couple photos on the loader, envelope, hero, messages,
//            reminders, snap & share and the closing section
const DISPLAY_MODE = "photos" as "photos" | "plain"

// ── Shared images ───────────────────────────────────────────────────────────
const BRAND = {
  monogram: "/image/beauty-and-beast.png", // Belle & Beast silhouette (tinted per section)
  // Transparent cut-out of the couple, shown large on the loading poster
  couplePortrait: "/Details/couple.png",
  // Name lettering image (hero, loader, envelope, proposals). "" = name in script text
  nameImage: "/image/couple-name.webp",
  seal: "/image/seal.webp", // envelope wax seal
  // Theme song — drop the MP3 into /public/background_music with this exact name
  backgroundMusic: "/background_music/BEAUTY AND THE BEAST CELLO COVER.mp3",
}

// Portrait couple photos used in "photos" mode (loader, envelope, hero, reminders,
// snap & share, closing). The /gallery page reads every file in
// /public/mobile-background and /public/desktop-background.
// File extensions differ — paths are case-sensitive on Vercel.
const COUPLE_PHOTOS = [
  "/mobile-background/couple (1).jpeg",
  "/mobile-background/couple (2).jpeg",
  "/mobile-background/couple (3).JPG",
  "/mobile-background/couple (4).JPG",
  "/mobile-background/couple (5).jpg",
  "/mobile-background/couple (6).jpg",
]
// Favorites picked for specific spots (index = file number − 1)
const PHOTO = (n: number) => COUPLE_PHOTOS[n - 1]
// Portraits in the order they appear on the loader and hero (ballgown first)
const FEATURED_PHOTOS = [PHOTO(2), PHOTO(5), PHOTO(3), PHOTO(6), PHOTO(4), PHOTO(1)]
// Landscape photos for wide screens
const WIDE_PHOTO = (file: string) => `/desktop-background/couple (${file}`

// ── Decorations ─────────────────────────────────────────────────────────────
// The botanical PNGs are tinted antique gold by --deco-filter in app/globals.css.
// Change a path here to swap it on every section at once.
// To change ONE section only, override it there, e.g. decos: { ...SECTION_DECOS, footerVine: "" }
const DECOR = {
  cornerTopLeft: "/deco/top-left-deco.png",
  cornerTopRight: "/deco/top-right-deco.png",
  cornerBottomLeft: "/deco/bottom-left-deco.png",
  cornerBottomRight: "/deco/bottom-right-deco.png",
  headerOrnament: "/deco/lovestorydeco/Elegant-Eucalyptus-centerdot.png", // small sprig above titles
  footerVine: "/deco/lovestorydeco/Elegant-Eucalyptus-bottom.png", // long vine at section ends
  sideLeft: "/deco/lovestorydeco/Elegant-Eucalyptus-Left.png", // side sprigs
  sideRight: "/deco/lovestorydeco/Elegant-Eucalyptus-Right.png",
}

// The four corners as one set
const CORNER_DECOS = {
  topLeft: DECOR.cornerTopLeft,
  topRight: DECOR.cornerTopRight,
  bottomLeft: DECOR.cornerBottomLeft,
  bottomRight: DECOR.cornerBottomRight,
}

// Default decoration set used by most sections (corners + ornament + vine)
const SECTION_DECOS = {
  ...CORNER_DECOS,
  headerOrnament: DECOR.headerOrnament,
  footerVine: DECOR.footerVine,
}

/* ============================================================================
   SECTIONS — wording and per-section options. Values above are referenced here.
   ============================================================================ */

// Principal sponsors Google Apps Script — used by the main page and /inviteone
const SPONSORS_API = "https://script.google.com/macros/s/AKfycbwRjDNJ_VK5qbPYI6-F8DtOCwP6h058I-9VQiFy8cgHNFRxaTSTovBC7Y-gfZL5aXC9/exec"

export const siteConfig = {
  siteUrl: SITE_URL,
  linkPreviewImage: LINK_PREVIEW_IMAGE,
  linkPreviewImageSize: LINK_PREVIEW_IMAGE_SIZE,
  // The couple's display name — read by every section. {celebrant} in any text → "Sunshyne & Brandon".
  celebrant: {
    ...CELEBRANT,
    monogram: BRAND.monogram,
  },
  event: EVENT,
  // Navbar links (components/navbar.tsx) — same order as the sections on the page.
  // wideOnly: shown in the desktop bar only on extra-wide screens (always in the phone menu).
  nav: {
    links: [
      { href: "#home", label: "Home" },
      { href: "#welcome", label: "Welcome", wideOnly: true },
      { href: "#love-story", label: "Our Story" },
      { href: "#countdown", label: "Countdown", wideOnly: true },
      { href: "#gallery", label: "Gallery" },
      { href: "#messages", label: "Messages" },
      { href: "#details", label: "Details" },
      { href: "#wedding-timeline", label: "Program" },
      { href: "#stay", label: "Stay & Explore" },
      { href: "#entourage", label: "Entourage" },
      { href: "#guest-list", label: "RSVP" },
      { href: "#guests", label: "Guests" },
      { href: "#faq", label: "FAQ" },
      { href: "#registry", label: "Gifts" },
      { href: "#playlist", label: "Theme Song" },
      { href: "#snap-share", label: "Snap & Share" },
      { href: "#see-you-there", label: "See You There", wideOnly: true },
    ] as { href: string; label: string; wideOnly?: boolean }[],
  },
  couple: {
    ...COUPLE,
    monogram: BRAND.monogram,
    backgroundMusic: BRAND.backgroundMusic,
  },
  googleAPI:{
    messageForm: "https://docs.google.com/forms/d/e/1FAIpQLSfnnT3Az9zCbJk9vxa_20FMwYj1n_-17uDqHYHS27rj9eon5Q/formResponse",
    message: "https://script.google.com/macros/s/AKfycbzaWTfuQYnZ0FSIUSxeYUjdYxS6OyzQGyTCg4evHNrdYQPYHpfBQ3TD5THUU2w_A90u/exec",
    guestList: "https://script.google.com/macros/s/AKfycbzOuquXRVxaajjhmGRPYOfxjz_qAYv1tUBxacTfpdPB7CT0vLx4Q3851HtWd1qpaFXA/exec",
    guestRequest: "https://script.google.com/macros/s/AKfycbxMRURFTG18O6rqUShJeI26g0DsBlinHztCUyIhkSYxuMfxO-EwUeY3SyNyUJKRF1tu/exec",
    entourage: "https://script.google.com/macros/s/AKfycby_pMOvwFt4fqXUltkfoeyT4JkzZ4HoRAVCymfDaaRnLIc7TI1u_yMcOP2K5KRdAQQL/exec",
    sponsors: SPONSORS_API,
    // Principal sponsors shown on /inviteone and /invitetwo (entourage section)
    sponsorsInviteOne: SPONSORS_API,
    sponsorsInviteTwo: SPONSORS_API,
    googleShare: "https://docs.google.com/spreadsheets/d/1H0jEyW9VOMBVLSPBgVlPZ1Mlg_vhO-UUv2epgcy1Llk/edit?usp=sharing",
    videoMessageForm:
      "https://docs.google.com/forms/d/e/1FAIpQLSfeGlEl4CMXWefdvCw6AOPHFS1ROku_rs-Gbofa2LkVJ0sLGQ/viewform",
  },
  wedding: {
    date: EVENT_DATE,
    time: TIMES.program,
    venue: VENUE.name,
    tagline: "are getting married",
    theme: EVENT.theme,
    motif: EVENT.colors,
  },
  // Top hero on the main page (components/sections/hero.tsx)
  hero: {
    // Kicker → names → titleScript read as one sentence, like a printed invitation
    srTitle: "Together with their families, {celebrant} invite you to their wedding",
    kicker: "Together with their families", // Small line above the names ("" hides it)
    titleMain: "{celebrant}", // Shown as text when nameImage is ""; breaks onto two lines before the "&"
    nameImage: "", // "" sets the names in script (Above the Beyond); BRAND.nameImage uses the lettering image
    eyebrow: "", // Caps line under the names ("" hides it)
    titleScript: "invite you to their wedding", // Script line above the date ("" hides it)
    meta: `${EVENT_DAY} · ${TIMES.program} · ${VENUE.name}`, // Caps line under the date ("" hides it)
    countdownHeading: "Counting down to happily ever after",
    countdownLabels: {
      days: "Days",
      hours: "Hours",
      minutes: "Minutes",
      seconds: "Seconds",
    },
  },
  // Welcome letter (components/sections/welcome.tsx)
  welcome: {
    // Header lockup: kicker (small caps) → title (serif caps) → connector (small caps between gold rules) → script
    kicker: "A tale as old as time", // "" hides this line
    title: "Welcome",
    connector: "to our", // "" hides this line
    script: "Fairy Tale",
    // ⚠ check — placeholder letter; replace with the couple's own words
    opening: "Once upon a time,", // Script line that opens the letter ("" hides it)
    paragraphs: [
      "a simple hello began the greatest adventure of our lives. Every love story is beautiful, but ours will always be our favorite.",
      "No tale is written alone. We are grateful for the families who raised us, the friends who stood beside us, and above all for God's grace, which brought our two hearts together.",
      "Now our next chapter begins. As we prepare to say \"I do,\" you will find everything you need in the pages ahead: the date, the program, the dress code, and a few gentle reminders.",
      "Your presence would make our day all the more meaningful. Come and be our guest, and thank you for being part of our story.",
    ],
    signOff: "With all our love and gratitude,",
    signature: "{celebrant}",
  },
  // Opening "Save the Date" loading screen (components/loader/LoadingScreen.tsx).
  // Styled like an enchanted-ball poster: the couple's names in gold lettering,
  // midnight velvet curtains, the couple's portrait and gold details.
  loadingScreen: {
    // "photos" = sliding photo background + photo date cards
    // "plain"  = no photos: midnight velvet backdrop with engraved date
    display: DISPLAY_MODE,
    // Wedding poster (midnight blue + gold). {celebrant} → the couple; "" hides a line.
    // Date / time / venue in the details row come from ceremony.
    gala: {
      photo: BRAND.couplePortrait, // the couple in the middle of the poster
      eyebrow: EVENT.theme,
      nameImage: "", // envelope card lettering image; "" writes the name in script text (Above the Beyond)
      cardEyebrow: "You're Invited", // top line on the paper card inside the envelope
      // Invitation line on the paper card, above the names ("" hides it)
      cardLine: "Together with their families, you are joyfully invited to the wedding of",
      title: "{celebrant}", // gold script on the poster; on the envelope card when nameImage is ""
      subtitle: "", // caps line beneath ("" hides it)
      promise: "Two hearts, one enchanted promise", // line under the names on the poster ("" hides it)
      kicker: "Please join us for",
      dateLine: `${EVENT_DATE}  ·  ${VENUE.name}`, // gold caps under the occasion ("" hides it)
      // Ghost lettering that drifts down the left edge and up the right ([] hides it)
      ghostText: ["{celebrant}", EVENT.theme], // symbols and digits switch to Cinzel (The Seasons demo font stamps "DEMO" on them)
      occasionNumber: "", // "" hides the number
      occasionSuffix: "",
      occasion: "The Wedding",
    },
    // Colors used when display is "plain"
    plainTheme: {
      background: "var(--color-welcome-bg)",
      text: "var(--color-welcome-text)",
      accent: "var(--color-welcome-gold)",
    },
    // Sliding background photos (display: "photos"); files live in /public
    backgroundPhotos: FEATURED_PHOTOS,
    // Poster corners: small caps at the very top (left sits beside the monogram). "" hides one.
    topLeft: "The Wedding",
    topRight: VENUE.name,
    headline: "Save the Date",
    // {days} is replaced with the number of days left before the wedding
    countdownText: "{days} days until happily ever after",
    countdownOneDayText: "One day until happily ever after",
    countdownTodayText: "Today, we say I do",
    countdownPastText: "Thank you for celebrating with us",
    coupleNameImage: BRAND.nameImage,
    // Polaroids that rise out of the envelope: [left, right, then extra desktop spots]
    photos: [
      "/box/box (1).jpeg", // left
      "/box/box (2).JPG", // right
      "/box/box (1).jpg",
      PHOTO(5),
    ],
    dateLabels: ["Month", "Day", "Year"],
    // Wording around the couple's names (both modes; "" to hide a line)
    plainInvite: {
      ornament: DECOR.headerOrnament, // sprig on the envelope letter ("" = none)
      lineAbove: "With love and joy, you are invited to celebrate the wedding of",
      lineBelow: "",
    },
    // Two numbered highlights, like a poster's "01 / 02" offers ([] hides the row)
    highlights: [
      { label: "Dress Code", text: "Navy, sapphire & burgundy" },
      { label: "The Day", text: "Roses, candlelight & gold" },
    ],
    // Bottom details row — {guestsTime}, {programTime}, {endTime}, {venue} are filled in
    showCeremonyDetails: true,
    details: [
      { label: "Ceremony", value: "{programTime}" },
      { label: "Venue", value: "{venue}" },
      { label: "Reception", value: "{endTime}" },
    ],
    // Used by the envelope (components/loader/Hero.tsx)
    eyebrow: "You are invited",
    message: "A tale as old as time",
    // Rotates under the progress bar while the invitation loads
    statusMessages: [
      "Arranging the roses",
      "Lighting the candles",
      "Tuning the cellos",
      "Saving your seat",
    ],
    durationMs: 8000, // minimum — longer only if the files are still loading
    // Invitation envelope (components/loader/Hero.tsx) — shares display + photos with loader above
    hintText: "Tap the Seal to Open",
    enterButtonText: "View the Invitation",
    sealImage: BRAND.seal,
    cornerDecos: { ...CORNER_DECOS },
  },
  // Our Story section (components/sections/love-story.tsx + StorySection)
  // Plain mode shows each note as a card; photos mode adds the chapter image.
  loveStory: {
    title: "Our Love Story",
    subtitle: "in six enchanted chapters",
    // Word before each card's number, e.g. "Chapter 01"
    chapterLabel: "Chapter",
    closingQuote: "Love bears all things, believes all things, hopes all things, endures all things.",
    closingCitation: "1 Corinthians 13:7",
    eucalyptusDecos: {
      topLeft: DECOR.sideLeft,
      bottomRight: DECOR.sideRight,
      timelineTop: DECOR.headerOrnament,
      sectionBottom: DECOR.footerVine,
    },
    // Six chapters, one per photo (PHOTO(n) = n-th file in COUPLE_PHOTOS).
    // imagePosition: which part of the photo stays in frame when the card crops it.
    // Keep each to one or two short paragraphs so the cards stay light on phones.
    // ⚠ check — placeholder story; replace with how the couple really met
    chapters: [
      {
        title: "Once Upon a Time",
        theme: "light" as const,
        layout: "image-left" as const,
        image: PHOTO(1),
        imagePosition: "center 75%",
        paragraphs: [
          "Every fairy tale begins somewhere, and ours began with two people who had no idea what was waiting for them.",
          "One hello was all it took for an ordinary day to become the first page of our story.",
        ],
      },
      {
        title: "An Enchanted Evening",
        theme: "dark" as const,
        layout: "image-right" as const,
        image: PHOTO(2),
        imagePosition: "center 60%",
        paragraphs: [
          "Little by little, friendship became something more. In long talks and shared laughter, we found the quiet feeling of finally being home.",
          "Together, every room felt like a ballroom, and every song felt written just for us.",
        ],
      },
      {
        title: "Hand in Hand",
        theme: "light" as const,
        layout: "image-left" as const,
        image: PHOTO(3),
        imagePosition: "center 75%",
        paragraphs: [
          "Through every season, we chose each other, and God's faithfulness carried us through them all.",
          "The people we love most walked with us along the way, and we are forever grateful.",
        ],
      },
      {
        title: "Beauty in the Quiet",
        theme: "dark" as const,
        layout: "image-right" as const,
        image: PHOTO(4),
        imagePosition: "center bottom",
        paragraphs: [
          "We learned that real love is patient and kind, and that it lives in the smallest moments.",
          "Sitting side by side, saying nothing at all, became our favorite kind of magic.",
        ],
      },
      {
        title: "The Enchanted Rose",
        theme: "light" as const,
        layout: "image-left" as const,
        image: PHOTO(5),
        imagePosition: "center 30%",
        paragraphs: [
          "Like a rose kept with care, our love grew stronger with every passing day.",
          "Somewhere along the way, we stopped counting the days and simply knew that this was forever.",
        ],
      },
      {
        title: "Happily Ever After",
        theme: "dark" as const,
        layout: "image-right" as const,
        image: PHOTO(6),
        imagePosition: "center bottom",
        paragraphs: [
          "Now we are ready to write our favorite chapter yet, and there is no one we would rather share it with than you.",
          "Come celebrate, share a dance, and help us begin our happily ever after.",
          "With all our love, {celebrant}",
        ],
      },
    ],
  },
  // Gallery section (components/sections/gallery.tsx)
  gallery: {
    eyebrow: "Our Moments",
    title: "Gallery",
    subtitle: "moments we treasure",
    description: "A few of our favorite memories together, on the way to forever.",
    footnote:
      "More pictures will be added after the wedding. Please check back — this gallery is still growing.",
    buttonText: "View Full Gallery",
    buttonHref: "/gallery",
    decos: { ...SECTION_DECOS },
    images: FEATURED_PHOTOS.map((image) => ({ image, text: "" })),
  },
  // Countdown section (components/sections/countdown.tsx)
  countdown: {
    title: "Counting Down",
    script: "to our forever",
  },
  // Event details section (components/sections/details.tsx)
  // Venue name, address, date, times, map and photos come from VENUE above.
  // In reminder text, {guestsTime}, {ceremonyTime} and {endTime} are filled in.
  eventDetails: {
    eyebrow: "The Celebration",
    title: "Event Details",
    subtitle: "the day we say I do",
    description: "Everything you need to know before our happily ever after begins.",
    decos: { ...SECTION_DECOS },
    venues: VENUE_CARDS,
    labels: {
      arrival: "Arrival",
      at: "At",
      scanForDirections: "Scan for directions",
      getDirections: "Get Directions",
      copyAddress: "Copy Address",
      copied: "Copied!",
    },
    attire: {
      title: "Dress for the Ball",
      description: "Kindly join us in formal attire, as if stepping into an enchanted ballroom.",
      paletteTitle: "Dress Code Palette",
      paletteSubtitle: "Navy, Sapphire & Burgundy",
      colorGuideTitle: "Dress Code: Formal",
      colorGuideNote:
        "Think classic silhouettes and refined details in the colors of our motif. Kindly leave white and ivory for the bride, and avoid overly casual outfits.",
      // Order and visibility come from ATTIRE.show (skips blanks, typos and repeats)
      groups: ATTIRE.show
        .filter((id, i, list) => ["sponsors", "entourage", "guests"].includes(id) && list.indexOf(id) === i)
        .map((id) => ({ id, ...ATTIRE[id] })),
      palette: DRESS_PALETTE, // shown (without names) in the Dress Code reminder
    },
    reminders: {
      title: "Gentle Reminders",
      description: "A few thoughtful notes to keep the day magical for everyone.",
      // Shown as 9:16 portrait cards; the 1st sits in front, the rest fan out behind it
      images: [PHOTO(5), PHOTO(2), PHOTO(3), PHOTO(6)],
      // showPalette: shows the dress code palette after the first paragraph
      items: [
        {
          title: "Dress Code",
          variant: "accent" as "accent" | "soft",
          showPalette: true, // color strip after the first paragraph
          paragraphs: [
            "Kindly keep it elegant, formal, and in the colors of our motif.",
          ],
        },
        {
          title: "Arrival",
          variant: "soft" as "accent" | "soft",
          showPalette: false,
          paragraphs: [
            "Please arrive by {guestsTime} so you can find your seat and settle in before the ceremony begins at {ceremonyTime}.",
          ],
        },
        {
          title: "Unplugged Ceremony",
          variant: "accent" as "accent" | "soft",
          showPalette: false,
          paragraphs: [
            "We kindly ask that you keep your phones away during the ceremony and let our official photographers capture every moment. You are welcome to take photos at the reception!",
          ],
        },
      ],
    },
  },
  // Program flow (components/sections/wedding-timeline.tsx)
  weddingTimeline: {
    kicker: `The Wedding of ${COUPLE.groom} & ${COUPLE.bride}`,
    title: "Wedding Day",
    subtitle: "timeline",
    description: "From our vows at sunset to the last dance of the night, here is how our day will unfold.",
    quote: "Therefore what God has joined together, let no one separate.",
    quoteCitation: "Mark 10:9",
    // Optional corner decorations — leave "" to hide
    decos: {
      topLeft: "",
      topRight: "",
      bottomLeft: "",
      bottomRight: "",
    },
    // Each event — shown top to bottom in this order (move a block to reorder):
    //   show:     false = hide it (kept here to edit later)
    //   time:     "" hides the time (ranges like "3:30 – 4:30 PM" are fine)
    //   location: text under the title; {ceremony} / {reception} → venue name ("" to hide)
    //   image:    line-art illustration in /public/weddingtimeline (black on transparent,
    //             shown white); "" uses the icon instead
    //   icon:     "rings" | "toast" | "dinner" | "dance" | "arrival" | "departure" | …
    //   description: optional extra line ("" to hide)
    events: [
      {
        show: true,
        time: "3:30 – 4:30 PM",
        title: "Ceremony",
        description: "Two hearts, one promise.",
        location: "The View",
        image: "/weddingtimeline/WeddingCeremony.png",
        icon: "rings" as TimelineIconName,
      },
      {
        show: true,
        time: "4:30 – 5:00 PM",
        title: "Pictorials",
        description: "Moments to keep forever.",
        location: "",
        image: "/weddingtimeline/PhotoSession.png",
        icon: "video" as TimelineIconName,
      },
      {
        show: true,
        time: "5:00 – 5:30 PM",
        title: "Travel Time",
        description: "From The View to Dusit Thani.",
        location: "",
        image: "/weddingtimeline/Minimal Van Journey Icon.png",
        icon: "departure" as TimelineIconName,
      },
      {
        show: true,
        time: "5:30 – 6:30 PM",
        title: "Cocktail Hour",
        description: "Raise a glass to the happy couple.",
        location: "Dusit Thani",
        image: "/weddingtimeline/CockTailHour.png",
        icon: "toast" as TimelineIconName,
      },
      {
        show: true,
        time: "6:30 – 7:00 PM",
        title: "Pre-Program",
        description: "Speeches & dances.",
        location: "",
        image: "/weddingtimeline/reception welcom.png",
        icon: "fireworks" as TimelineIconName,
      },
      {
        show: true,
        time: "7:00 – 8:00 PM",
        title: "Dinner Time",
        description: "Come, be our guest.",
        location: "",
        image: "/weddingtimeline/DinnerService.png",
        icon: "dinner" as TimelineIconName,
      },
      {
        show: true,
        time: "8:00 PM Onwards",
        title: "Games & Party",
        description: "And they lived happily ever after.",
        location: "",
        image: "/weddingtimeline/SendOff.png",
        icon: "dance" as TimelineIconName,
      },
    ],
  },
  // Wedding entourage (components/sections/entourage.tsx)
  // Names and roles come from the Google Sheet (googleAPI.entourage).
  entourage: {
    show: true,
    eyebrow: "Our Wedding Party",
    title: "The Entourage",
    subtitle: "the people beside us",
    description: "Honoring the people who walk with us into our happily ever after",
    coupleKicker: "The Bride & Groom",
    coupleLine: EVENT.theme,
    coupleHeading: "The Couple",
    brideRole: "Bride",
    groomRole: "Groom",
    loadingText: "Loading the entourage...",
    retryingText: "Still gathering the entourage. Trying again...",
    errorText: "Unable to load the entourage",
    retryText: "Try again",
    // Sheet RoleCategory values shown first ([] keeps the standard wedding order)
    categoryOrder: [] as string[],
    // Leave any path "" to hide that decoration
    decos: { ...SECTION_DECOS },
    // Rename any heading shown in the entourage card: "Heading as shown": "Your text"
    headingLabels: {} as Record<string, string>,
  },
  // RSVP / guest list (components/sections/guest-list.tsx) — card, search, RSVP form and all modals.
  // Placeholders: {name}, {count}, {n}, {celebrant}. The deadline comes from details.rsvp.deadline.
  rsvp: {
    headerOrnament: DECOR.headerOrnament, // "" to hide
    title: "RSVP",
    script: "Will you be there",
    intro: "Kindly confirm your attendance so a seat can be saved for you on our special day.",
    deadlineLabel: "RSVP Deadline",
    openButton: "Tap here to respond",
    search: {
      title: "RSVP",
      script: "Find your Name",
      placeholder: "Begin with your first name",
      loading: "Preparing the guest list. We'll keep trying until names appear.",
      refine: "Keep typing to refine results",
      notFoundTitle: "Not finding your name?",
      notFoundText: "We'd love to have you there. Send a request to join the celebration.",
      requestButton: "Request to Join",
    },
    invite: {
      title: "You are Invited",
      scriptFallback: "to our wedding",
      greeting: "Dear {name}, we'd be honored to have you with us.",
      seats: "{count} reserved for you",
      seatSingular: "seat",
      seatPlural: "seats",
    },
    responded: {
      title: "Thank You for Responding!",
      text: "Your RSVP is in — we can't wait to celebrate with you!",
      attending: "You're Attending!",
      declined: "Unable to Attend",
      guestCountLabel: "Number of Guests",
      closeButton: "Close",
    },
    form: {
      attendLabel: "Can you attend? *",
      yes: "Yes!",
      no: "Sorry, No",
      companionsLabel: "Who's Coming With You?",
      companionsHint: "Please provide names and relationships for your {count} additional {guests}",
      guestSingular: "guest",
      guestPlural: "guests",
      companionTitle: "Guest {n}",
      companionNameLabel: "Full Name",
      companionNamePlaceholder: "Name of guest {n}",
      relationshipLabel: "Relationship with {name}",
      relationshipFallbackName: "Primary Guest",
      relationshipPlaceholder: "e.g., Spouse, Friend, Child, Parent",
      relationshipOptions: ["Spouse", "Partner", "Child", "Parent", "Sibling", "Friend"],
      companionProgress: "Guest {n} of {total}",
      companionsAdded: "{done} of {total} added",
      prevButton: "Back",
      nextButton: "Next guest",
      phoneLabel: "Phone Number *",
      phonePlaceholder: "09XX XXX XXXX",
      phoneNote: "For wedding updates only. Your number stays private and will never be shown to other guests.",
      submitting: "Submitting...",
      submit: "Submit RSVP",
    },
    phoneAlert: {
      title: "A phone number is needed",
      paragraphs: [
        "We ask for your number so we can reach you with important updates — seating, timing, or anything you may need on the day.",
        "Your number will not appear on this invitation and will not be shared with other guests. It is kept private and used only by the couple and their coordinators.",
      ],
      button: "Add my number",
    },
    success: {
      title: "RSVP Confirmed",
      attending: "We're so happy you'll be there — your seat is saved!",
      declined: "You'll be missed, but thank you for letting us know.",
      neutral: "Thank you for your response!",
      messagePrompt:
        "Before you go, leave a message for {celebrant} — your words will be a keepsake from our wedding day.",
      messageButton: "Leave a Message",
      laterButton: "Maybe later — close",
    },
    request: {
      title: "Request",
      script: "to join",
      greetingNamed: "Hi {name} — want to celebrate with us? Send a request!",
      greeting: "Want to celebrate with us? Send a request!",
      optional: "(Optional)",
      nameLabel: "Full Name *",
      namePlaceholder: "Enter your full name",
      emailLabel: "Email Address",
      emailPlaceholder: "your.email@example.com",
      phoneLabel: "Phone Number",
      phonePlaceholder: "+63 912 345 6789",
      guestsLabel: "Number of Guests *",
      guestsPlaceholder: "How many guests?",
      messageLabel: "Message",
      messagePlaceholder: "Share why you'd like to join...",
      submitting: "Submitting...",
      submit: "Send Request",
      sentTitle: "Request Sent!",
      sentText: "Your request has been received",
      sentSubtext: "The couple will review it and get back to you soon",
      autoClose: "This will close automatically",
    },
    messages: {
      thankYou: "Thank you for your response!",
      requestSubmitted: "Request submitted! The couple will review and get back to you.",
      loadFailed: "Failed to load guest list",
      selectAttendance: "Please select if you can attend",
      nameRequired: "Name is required",
      requestFailed: "Failed to submit request. Please try again.",
      submitFailed: "We couldn't save your RSVP. Please check your connection and try again.",
    },
  },
  // Messages section (components/sections/messages.tsx)
  messages: {
    title: "Love Notes",
    script: "for the bride & groom",
    description: "Every love story is written with the people who share it. Leave a note, a wish, or a prayer for {celebrant}, and it will stay with us as a keepsake.",
    formTitle: "Add to Our Story",
    formSubtitle: "Leave a note for {celebrant} to read and keep.",
    messagePlaceholder: "Write your wishes, prayer, or kind words for {celebrant}...",
    wallTitle: "Pages from Our Storybook",
    wallSubtitle: "Warm words from family and friends",
  },
  // Messages wall (components/sections/message-wall-display.tsx)
  // Small decorations on each message card — leave "" to hide
  messageWall: {
    emptyTitle: "The first page awaits",
    emptyText: "Be the first to leave a note for the couple.",
    cardDecos: {
      topRight: "",
      bottomLeft: "",
    },
  },
  // Book of guests (components/sections/book-of-guests.tsx) — confirmed guests come from the guest list API.
  bookOfGuests: {
    title: "Book of Guests",
    subtitle: "celebrating with us",
    description:
      "Meet the cherished people joining the celebration — your presence makes this day truly special.",
    statsEyebrow: "The Celebration",
    guestSingular: "Guest",
    guestPlural: "Guests",
    statsCaption: "Celebrating With Us",
    rsvpSingular: "RSVP",
    rsvpPlural: "RSVPs",
    partySingular: "Party",
    partyPlural: "Parties",
    thankYou: "Thank you for confirming your RSVP — your presence means the world to us.",
    updatedLabel: "Updated",
    refreshLabel: "Refresh guest counts",
    listEyebrow: "Joining Us",
    listDescription: "A glimpse of the wonderful guests celebrating with us",
    vipLabel: "VIP",
    noTable: "No Table Yet",
    companionsLabel: "With Them",
    companionsMore: "+{count} more",
    companionsLess: "Show less",
    confirmedLabel: "Confirmed",
    emptyTitle: "Guest list updating",
    emptyText: "Confirmed guests will appear here as RSVPs come in.",
    cardsPerView: 4,
    decos: { ...SECTION_DECOS },
  },
  // FAQ (components/sections/faq.tsx)
  // In answers you can use:
  //   {deadline}    → details.rsvp.deadline
  //   {coordinator} → details.rsvp.coordinator
  //   {contact}     → " at <phone>" when details.rsvp.phone is set (empty while "to be announced")
  //   {celebrant}   → celebrant nickname
  //   [link text](#section-id) → a link that smoothly scrolls to that section
  //   A blank line (\n\n) starts a new paragraph; lines starting with "• " show as a bulleted list
  faq: {
    eyebrow: "Before the Big Day",
    title: "Frequently Asked Questions",
    subtitle: "everything you need to know",
    description: "A few gentle notes so you can simply arrive, celebrate, and enjoy the day with us.",
    decos: { ...SECTION_DECOS },
    // In answers: {deadline}, {coordinator}, {contact}, {celebrant}, {guestsTime},
    // {programTime}, {endTime}, {venueName}, {venueAddress} are filled in, and
    // [label](#section-id) becomes a link that scrolls to that section.
    items: [
      {
        question: "How do I RSVP?",
        // ⚠ check — add "Kindly respond by {deadline}." once the deadline is set
        answer:
          "Simply open the [RSVP](#guest-list) card on this invitation, search for your name, and confirm whether you can join us.\n\nKindly respond as early as you can so we can prepare your seat.",
      },
      {
        question: "What should I wear?",
        answer:
          "Come in your most elegant best, in navy, sapphire blue, or burgundy. Kindly leave white and ivory for the bride.\n\nSee [Dress for the Ball](#details) for more.",
      },
      {
        question: "What time should I arrive?",
        answer:
          "Please arrive by {guestsTime}. The ceremony begins at {programTime}, and we would love for you to be seated before the bride walks down the aisle.",
      },
      {
        question: "Where is the wedding?",
        answer:
          "We will be celebrating in {venueName}. The exact venue, map, and directions will be added to [Event Details](#details) — please check back soon.",
      },
      {
        question: "May I bring a plus one?",
        answer:
          "Seating is limited and the celebration is by invitation only. Kindly RSVP only for the number of seats reserved under your name.",
      },
      {
        question: "What if I can no longer attend?",
        answer: "Please let us know as soon as you can, so your seat can be offered to another guest.",
      },
      {
        question: "May I take photos and videos?",
        answer:
          "During the ceremony, kindly keep your phones away and let our official photographers capture the moment.\n\nAt the reception, snap away! Share your photos using the hashtags in [Snap & Share](#snap-share).",
      },
      {
        question: "I have dietary restrictions or allergies.",
        answer: "Please let us know ahead of time so we can do our best to prepare something for you.",
      },
    ],
  },
  // Gift guide (components/sections/registry.tsx).
  registry: {
    eyebrow: "A Token of Love",
    title: "Gift Guide",
    subtitle: "with gratitude",
    description: "Your presence on our wedding day is the best gift we could ask for.",
    paragraphs: [
      "Having you with us on our wedding day is already a precious blessing. If you wish to give a gift, a monetary gift toward our new life together would be deeply appreciated — but your love, prayers, and presence mean the most.",
    ],
    thankYou: "", // "" hides the line
    signOff: "With a grateful heart,",
    signature: "", // "" falls back to the couple's names
    // Colors — any CSS color or a palette token from app/globals.css (e.g. "var(--color-motif-accent)")
    colors: {
      title: "var(--color-motif-deep)",                                       // account names / numbers: wine
      script: "color-mix(in srgb, var(--color-welcome-gold) 78%, var(--color-motif-deep))", // drop cap, signature: gold
      eyebrow: "color-mix(in srgb, var(--color-welcome-gold) 78%, var(--color-motif-deep))", // small caps labels, heart
      body: "color-mix(in srgb, var(--color-welcome-text) 85%, var(--color-motif-deep))",  // paragraphs: warm ink
      soft: "color-mix(in srgb, var(--color-motif-deep) 70%, transparent)",   // "With love," and secondary text
      card: "var(--color-motif-soft)",                                        // letter card (top)
      cardEdge: "var(--color-motif-cream)",                                   // letter card (bottom of the paper gradient)
      accountCard: "color-mix(in srgb, var(--color-motif-blush) 22%, var(--color-motif-soft))", // e-gift account cards
      button: "var(--color-motif-accent)",                                    // tab shadow tint (seal + selected tab use a crimson → wine gradient)
      line: "color-mix(in srgb, var(--color-welcome-gold) 45%, transparent)", // card edge + seal ring
      glow: "color-mix(in srgb, var(--color-welcome-gold) 22%, transparent)", // tab track / letter badge
      background: "transparent",                                              // section has no background
    },
    // E-gift accounts — optional, as many as you like.
    //   showAccounts: false hides the whole block
    //   show:  false hides one account
    //   qr:    "/QR/BPI.png" to show a QR image, or "" when you have no QR
    showAccounts: false, // ⚠ check — set true once the couple sends their real QR codes
    accountsTitle: "For e-gifts",
    // Small italic note under the QR ("" hides it)
    accountsNote: "",
    accounts: [] as { show: boolean; label: string; accountName: string; accountNumber: string; qr: string }[],
    // Leave any path "" to hide that decoration
    decos: { ...SECTION_DECOS },
  },
  // Table finder page (/table — components/table-finder.tsx)
  tableFinder: {
    decos: { ...CORNER_DECOS },
    // "Find Your Table" QR card on the dashboard (components/table-finder-qr-card.tsx)
    // {celebrant} → the couple. "" hides a line or image.
    qrCard: {
      coupleNameImage: BRAND.nameImage, // name lettering; "" shows the name as text
      coupleImage: "", // illustration beside the text
      eyebrow: "The wedding of",
      title: "Find Your Table",
      script: "please be seated",
      description:
        "Place this code at the entrance. Guests scan it, search their name, and go straight to their table.",
      scanLabel: "Scan to find your table",
      buttonText: "Download QR",
      downloadNote: "Saves a print-ready PNG for signs and table cards.",
      previewText: "Preview seating page",
    },
  },
  // Entourage proposal pages (components/proposal-page.tsx)
  // Roles live in content/proposal-roles.ts (Best Man, Bridesmaids, Sponsors, …).
  // Text placeholders: {name} = invitee, {role} = role title, {celebrant} = the couple.
  // Each invitation type has its own wording:
  //   party      → wedding party roles
  //   sponsor    → Principal Sponsors
  //   bearer     → Ring / Coin / Bible bearers
  //   flowerGirl → Flower Girl and Little Bride
  // A list ([...]) shows one paragraph per line; "" or [] hides that part.
  proposal: {
    decos: { ...CORNER_DECOS },
    coupleNameImage: BRAND.nameImage, // name lettering at the top of the card; "" shows the name as text
    coupleImage: "", // illustration above the question
    ornament: DECOR.headerOrnament, // small sprig at the top of the card; "" to hide
    // Eucalyptus sprigs on either side of the couple name; "" to hide one
    nameDecos: { left: DECOR.sideLeft, right: DECOR.sideRight },
    showDate: true, // big date under the couple name (Month / Day / Day-number / Time / Year)
    // Use "Maid of Honor" for unmarried, "Matron of Honor" for married
    honorAttendant: "Matron of Honor" as "Matron of Honor" | "Maid of Honor",
    roles: proposalRoleDefinitions,
    roleIdAliases: proposalRoleIdAliases,
    // Shared labels used on every invitation
    labels: {
      // Two lines above the picture ("" hides one)
      topEyebrow: "A Personal Invitation",
      topLine: "From our hearts to yours",
      headerEyebrow: "A Special Place", // small gold line above the heading
      headerScript: "in our Wedding", // big heading under the image
      saveTheDate: "Save the Date",
      roleOffered: "Role offered",
      preparedFor: "Prepared for",
      askQuestion: "Will you be", // + role title, e.g. "Will you be our Best Man?"
      registeredName: "Registered name",
      returnButton: "Return to the Invitation",
      saving: "Saving...",
      sending: "Sending...",
      sendButton: "Send Response",
      goBack: "Go Back",
      saveError: "We couldn't save your response. Please try again.",
      // Shown when the invite link has no name and the guest says yes
      nameForm: {
        title: "You Said Yes",
        script: "we're so happy",
        subheader: "One quick detail",
        body: "We couldn't be happier to have you by our side! Please confirm the name you'd like on the invitation and guest lists.",
        label: "Your Preferred Name",
        placeholder: "e.g. Aunt Maria Clara / Mr. James Bond",
        required: "Please type your preferred name so we can add it to our invitation.",
        submit: "Submit Response",
        cancel: "Cancel",
      },
    },
    copy: {
      party: {
        greeting: "Dear",
        intro: [],
        body: [
          "Your presence would make our wedding day even more meaningful. We would be honored to have you by our side as a symbol of love, friendship, and the beautiful memories we share.",
        ],
        askLead: "",
        askNote: "",
        yesButton: "Yes, I'd Love To!",
        noButton: "No, With Love & Warm Wishes",
        signOff: "With love,", // followed by the couple's names
        yes: {
          title: "You Said Yes",
          script: "thank you",
          subheader: "We couldn't be happier",
          roleLine: "As {role}",
          body: [
            "Thank you for saying yes! We can't wait to celebrate, laugh, and make memories with you on our wedding day. Having you beside us will make it even more special.",
          ],
          signOff: "With love,",
        },
        no: {
          title: "Thank You",
          script: "for responding",
          subheader: "We completely understand",
          body: [
            "Thank you for taking the time to consider it. There are absolutely no hard feelings — we're grateful to have you in our lives, and we hope to celebrate with you in any way you can.",
          ],
        },
        sent: {
          title: "Response Sent",
          script: "successfully",
          subheader: "Your message has reached us",
          body: [
            "Your love and warmest wishes mean the world to us. Thank you!",
          ],
          signOff: "With love,",
        },
      },
      sponsor: {
        greeting: "Dear",
        intro: [
          "We have some wonderful news that we would love to share with you.",
          "We are getting married, and we are about to begin a brand-new chapter of our lives.",
        ],
        body: [
          "This is not a general invitation. This is a personal ask, especially meant for you.",
          "As we prepare for our wedding, we keep thinking of the people we would be grateful to have by our side on one of the most meaningful days of our lives.",
          "To us, a {role} is more than a part in the program. It is someone we look up to, someone whose wisdom and blessings we would be grateful to carry with us into married life.",
        ],
        askLead: "With great respect and sincerity, we would like to ask you a very special question:",
        askNote: "Having you share this moment with us would make our wedding truly meaningful.",
        yesButton: "Yes, I'd Be Honored 🤍",
        noButton: "No, With Love & Warm Wishes",
        signOff: "With love and respect,",
        yes: {
          title: "You Said Yes",
          script: "thank you",
          subheader: "Thank you for saying yes!",
          roleLine: "Our {role}",
          body: [
            "We are truly happy and honored that you accepted this special role in our wedding. Your support means so much to us, and we look forward to celebrating with you and creating a memory we will cherish for years to come.",
          ],
          signOff: "With love and heartfelt gratitude,",
        },
        no: {
          title: "Thank You",
          script: "for responding",
          subheader: "We completely understand and respect your decision",
          body: [
            "Thank you for taking the time to read our letter and consider our request. There are no hard feelings at all — we are simply grateful to have you in our lives and to have you celebrate with us in your own way.",
          ],
        },
        sent: {
          title: "Response Sent",
          script: "successfully",
          subheader: "Your message has reached us",
          body: [
            "Thank you for sharing this moment with us. Your love and warmest wishes mean the world to us.",
          ],
          signOff: "With love,",
        },
      },
      bearer: {
        greeting: "Hi",
        intro: [
          "We have a very special day coming up, and we would love for you to be part of it! 🤍",
          "{celebrant} are getting married!",
        ],
        body: [
          "Our wedding day is a very important moment for us, and we would love to have you take part in making it even more special.",
        ],
        askLead: "So we have a very important question for you:",
        askNote: "We would be so happy to have you walk down the aisle and carry this special part of our wedding ceremony.",
        yesButton: "Yes, I'd Love To! 🤍",
        noButton: "Maybe Next Time 🤍",
        signOff: "With lots of love,",
        yes: {
          title: "Yay!",
          script: "you said yes!",
          subheader: "We are so excited to have you on our team!",
          roleLine: "Our {role}",
          body: [
            "We are so excited to have you as our {role}! We can't wait to see you walk down the aisle and be part of our special day. Your little role will be a very special part of our wedding, and we hope you have lots of fun celebrating with us! See you on our big day! 🤍",
          ],
          signOff: "With lots of love,",
        },
        no: {
          title: "That's Okay!",
          script: "we understand",
          subheader: "We completely understand 😊",
          body: [
            "Thank you for considering being our {role}. We hope you know that you are special to us, and we'll be happy to have you celebrate our wedding with us in any way.",
          ],
        },
        sent: {
          title: "Response Sent",
          script: "successfully",
          subheader: "Thank you for letting us know",
          body: ["We hope you know how special you are to us, and we look forward to celebrating with you."],
          signOff: "With lots of love,",
        },
      },
      flowerGirl: {
        greeting: "Hi",
        intro: [
          "We have a very special day coming up, and we would love for you to be part of it! 🤍",
          "{celebrant} are getting married!",
        ],
        body: [
          "Our wedding day wouldn't be complete without some extra sweetness, smiles, and a little bit of magic.",
        ],
        askLead: "And we have a very special role we would love for you to have.",
        askNote: "We would love to have you walk down the aisle and help make our wedding day even more beautiful and memorable.",
        yesButton: "Yes, I'd Love To! 🌸",
        noButton: "Maybe Next Time 🤍",
        signOff: "With lots of love,",
        yes: {
          title: "Yay!",
          script: "you said yes!",
          subheader: "We are so happy to have you as our Flower Girl!",
          roleLine: "Our {role}",
          body: [
            "We can't wait to see you walk down the aisle and be part of our special day. We hope you have lots of fun, smile big, and enjoy every moment! We can't wait to see you on our big day! 🤍",
          ],
          signOff: "With lots of love,",
        },
        no: {
          title: "That's Okay!",
          script: "we understand",
          subheader: "We completely understand 😊",
          body: [
            "Thank you for taking the time to consider being our Flower Girl. Whether you're able to be part of our wedding or not, we hope you know how special you are to us. We'll still be very happy to celebrate our special day with you!",
          ],
        },
        sent: {
          title: "Response Sent",
          script: "successfully",
          subheader: "Thank you for letting us know",
          body: ["We hope you know how special you are to us, and we look forward to celebrating with you."],
          signOff: "With lots of love,",
        },
      },
    },
  },
  details: {
    rsvp: { ...RSVP },
  },
  contact: {
    bridePhone: "to be announced",
    groomPhone: "to be announced",
    email: "to be announced",
  },
  giftRegistry: {
    // QR_1:{
    // id: "BPI",
    // src: "/QR/BPI.png",
    // label: "BPI",
    // accountNumber: "KAMS : ***********569",
    // },
    // QR_2:{
    // id: "MariBank",
    // src: "/QR/MariBank.png",
    // label: "MariBank",
    // accountNumber: "****7672",
    // }
    // ,
    // QR_3:{
    // id: "Gcash",
    // src: "/QR/pleaseProvideQR.png",
    // label: "Gcash",
    // accountNumber: "to be announced",
    // }
  },
  // Built from QUICK SETUP — edit the values at the top of the file
  ceremony: {
    location: CEREMONY_VENUE.name,
    venue: CEREMONY_VENUE.address,
    map: CEREMONY_VENUE.map,
    date: EVENT_DATE,
    day: EVENT_DAY,
    time: TIMES.program,
    entourageTime: TIMES.guestArrival,
    guestsTime: TIMES.guestArrival,
    image: CEREMONY_VENUE.photos,
  },
  reception: {
    location: RECEPTION_VENUE.name,
    venue: RECEPTION_VENUE.address,
    map: RECEPTION_VENUE.map,
    date: EVENT_DATE,
    day: EVENT_DAY,
    time: TIMES.end,
    image: RECEPTION_VENUE.photos,
  },
  // Legacy blocks (not shown on the main page) — kept so older components compile.
  dressCode: {
    theme: EVENT.theme,
    sponsors: {
      title: "Sponsors",
      ninang: { label: "Ninang", description: ATTIRE.sponsors.ladies.details, image: "", palette: ["#0B1E4A", "#2B5C9B"] },
      ninong: { label: "Ninong", description: ATTIRE.sponsors.gentlemen.details, image: "", palette: ["#0B1E4A", "#F5EFE3"] },
    },
    entourage: {
      title: "Entourage",
      bridesmaid: { label: "Bridesmaids", description: ATTIRE.entourage.ladies.details, image: "", palette: ["#2B5C9B", "#6B0F1A"] },
      groomsmen: { label: "Groomsmen", description: ATTIRE.entourage.gentlemen.details, image: "", palette: ["#0B1E4A", "#6B0F1A"] },
    },
    guests: {
      title: "Guests",
      label: "Guests",
      description: "Your best formal look in navy, sapphire blue, or burgundy.",
      image: "",
      palette: ["#0B1E4A", "#153368", "#2B5C9B", "#6B0F1A"],
    },
    paletteNote: `Our theme is ${EVENT.theme}: navy, sapphire blue, and burgundy.`,
    closing: "Thank you for helping make this day so special. We can't wait to celebrate with you!",
    note: "Kindly wear navy, sapphire blue, or burgundy.",
  },
  narratives: {
    ourStory: "",
    groom: "",
    bride: "",
  },
  colors: {
    primary: "#14264F",
    secondary: "#C9A24A",
  },
  // Theme song (components/sections/wedding-playlist.tsx). {celebrant} → the couple.
  // spotifyUrl "" shows a simple play button for the background song instead of the Spotify player.
  playlist: {
    eyebrow: "Now Playing",
    title: "The Sound of Our Story",
    script: "a tale as old as time",
    subtitle: "Every love story has a soundtrack — this is ours.",
    // Shown on the player card: small label (artist), big title (song), then the note
    cardEyebrow: `Theme song · ${EVENT.themeSong.artist}`,
    playlistName: EVENT.themeSong.title,
    cardNote: "The song that sets the mood for our wedding day. Press play and step into our story.",
    buttonText: "Listen on Spotify",
    // Leave any path "" to hide that decoration
    decos: { ...CORNER_DECOS, headerOrnament: DECOR.headerOrnament },
    embedUrl: "", // ⚠ check — add the couple's Spotify link if they have one
    spotifyUrl: "",
  },
  // Closing "See you there!" section (components/sections/see-you-there.tsx).
  //   photos mode (loadingScreen.display "photos") → full-screen couple photo
  //   plain mode  (loadingScreen.display "plain")  → ornamental card, no photo
  // {celebrant} → the couple.
  seeYouThere: {
    titleLine1: "See you",
    titleLine2: "there!",
    // Photos mode — lines around the title (like the closing card of the invitation); "" hides one
    eyebrow: "Until we say I do",
    script: "with love, {celebrant}",
    message: "We can't wait to celebrate our wedding with you.",
    // Photos mode — full-screen background that slowly crossfades between the photos.
    // Phones (portrait) use "mobile", tablets / desktops (landscape) use "desktop".
    photos: {
      mobile: [PHOTO(2), PHOTO(5), PHOTO(3), PHOTO(6)],
      desktop: [WIDE_PHOTO("1).jpeg"), WIDE_PHOTO("8).JPG"), WIDE_PHOTO("3).jpeg"), WIDE_PHOTO("6).jpg")],
    },
    photoAlt: "{celebrant}",
    // Plain mode
    plain: {
      eyebrow: `Until ${EVENT_DATE.replace(/,\s*\d{4}$/, "")}`,
      script: "with love, {celebrant}",
      message: "We can't wait to celebrate our wedding with you.",
      decos: { ...CORNER_DECOS, footerVine: DECOR.footerVine },
    },
  },
  // Footer (components/sections/footer.tsx).
  // {celebrant} → the couple, {year} → current year. Date comes from ceremony, deadline from details.rsvp.
  footer: {
    showMonogram: true, // couple monogram, tinted to the motif
    // Small line under the names ("" to hide)
    nameLine: "are getting married",
    dateLabel: "Wedding Date",
    // Ceremony & reception at a glance (times and places come from ceremony / reception)
    summary: {
      show: true,
      ceremonyLabel: "Ceremony",
      receptionLabel: "Reception",
    },
    noteTitle: "A Note From Us",
    // Typed out one after another
    quotes: [
      "Love bears all things, believes all things, hopes all things, endures all things. – 1 Corinthians 13:7",
      "Welcome to our wedding website! We are so grateful to share this new chapter with you.",
      "Thank you for your love, prayers, and support. We can't wait to celebrate with you!",
    ],
    rsvp: {
      show: true,
      title: "RSVP Deadline",
      label: "Please respond by",
      note: "Please confirm your attendance by this date.",
      button: "Tap here to respond",
      href: "#guest-list",
    },
    // Social links — replace each href with your own profile link.
    //   show: false hides one; platforms: facebook | instagram | tiktok | youtube | twitter | threads | messenger | email
    //   email: use "mailto:you@example.com"; messenger: use "https://m.me/yourpage"
    followTitle: "Follow Along",
    followNote: "Share your photos and tag us — we'd love to see the day through your eyes.",
    socials: [
      { show: true, platform: "facebook", href: "https://www.facebook.com" },
      { show: true, platform: "instagram", href: "https://www.instagram.com/" },
      { show: true, platform: "tiktok", href: "https://www.tiktok.com/" },
      { show: true, platform: "youtube", href: "https://www.youtube.com" },
      { show: true, platform: "twitter", href: "https://x.com/" },
      { show: false, platform: "threads", href: "https://www.threads.net/" },
      { show: false, platform: "messenger", href: "https://m.me/" },
      { show: false, platform: "email", href: "mailto:" },
    ] as {
      show: boolean
      platform: "facebook" | "instagram" | "tiktok" | "youtube" | "twitter" | "threads" | "messenger" | "email"
      href: string
    }[],
    quickLinksTitle: "Quick Links",
    links: [
      { label: "Home", href: "#home" },
      { label: "Event Details", href: "#details" },
      { label: "Gallery", href: "#gallery" },
      { label: "RSVP", href: "#guest-list" },
      { label: "Program", href: "#wedding-timeline" },
      { label: "Messages", href: "#messages" },
      { label: "FAQ", href: "#faq" },
    ],
    copyright: "© {year} {celebrant} — crafted with love, prayers, and gratitude.",
    tagline: "This celebration site was made to share the joy of our wedding day with you.",
    // Hashtag chips under the date in the footer header ([] hides them)
    hashtags: HASHTAGS,
    credit: {
      show: true,
      developedBy: "Developed by",
      developerName: "Lance Valle",
      developerUrl: "https://lance28-beep.github.io/portfolio-website/",
      promoText: "Want a website like this? Visit",
      promoName: "Wedding Invitation Naga",
      promoUrl: "https://www.facebook.com/WeddingInvitationNaga",
    },
  },
  // Snap & Share (components/sections/snap-share.tsx). {celebrant} → the couple.
  snapShare: {
    // ⚠ check — add the couple's own Google Drive upload folder ("" hides the upload card)
    googleDriveLink: "",
    albumQR: "",
    hashtag: HASHTAGS,
    instructions: "Please scan this QR code and upload the photos and videos you took during the wedding. We'd love to see the day through your eyes!",
    title: "Snap and Share",
    subtitle: "Share your memories",
    description:
      "Help capture the little moments of our wedding day — every smile, dance, and candid laugh. Your photos and clips complete the story of the day.",
    // "Favorite Moments" photo card — always hidden when loadingScreen.display is "plain"
    moments: {
      show: false, // hidden — set true to bring back the photo card
      title: "Favorite Moments",
      caption: "Share your snapshots to be featured in the keepsake gallery.",
      // 3 photos: two side by side on top (3:4 frames), one wider frame below (4:3, framed on the face)
      images: [PHOTO(5), PHOTO(3), PHOTO(2)],
    },
    website: {
      show: true,
      title: "Share the Wedding Website",
      description:
        "Spread the word about our celebration. Share this QR code so friends and family can find every detail.",
      downloadButton: "Download QR",
      note: "Scan with any camera app to open the full invitation and schedule.",
    },
    hashtags: {
      show: true,
      title: "Wedding Hashtags",
      copy: "Copy",
      copied: "Copied",
      copyAll: "Copy All",
      allCopied: "All Copied!",
    },
    social: {
      show: true,
      title: "Share on Social Media",
      description: "Help spread the word about our wedding across your favorite platforms.",
      // Remove any you don't want: "instagram" | "facebook" | "tiktok" | "twitter"
      platforms: ["instagram", "facebook", "tiktok", "twitter"] as ("instagram" | "facebook" | "tiktok" | "twitter")[],
      shareText: "Celebrate the wedding of {celebrant}! Explore the details and share your special memories:",
    },
    // Shown only when googleDriveLink is set
    upload: {
      badge: "Upload Your Photos & Videos",
      scanNote: "Scan with your camera app",
      copyLink: "Copy Link",
      copied: "Copied!",
      downloadQr: "Download QR",
      uploadButton: "Upload Photos",
    },
    closing:
      "Thank you for helping make our wedding day unforgettable. Your photos and messages become memories we will treasure for a lifetime.",
    closingTag: "Thank you for sharing the joy",
  },
  // Where to stay + things to do (components/sections/recommended-hotel.tsx)
  // mapsLink: "" builds a Google Maps search from the name, so the button + QR always work.
  // Paste a real maps.app.goo.gl pin to point at an exact spot.
  // Set show: false on a hotel / activity to hide it; hide a whole list by emptying it.
  recommendedStay: {
    hotels: {
      kicker: "For our traveling guests",
      title: "Where to Stay",
      subtitle: "our picks for you",
      intro:
        "So many of you are traveling to Davao to celebrate with us, and that means the world to us. We've gathered a few places we personally recommend, starting with special wedding rates at our reception venue, Dusit D2 Davao. Choose whichever suits your plans and budget. Our wedding falls during the Kadayawan Festival, when the city fills up fast, so we suggest booking early.",
      // Featured hotel at the reception venue, with the wedding room rates (show: false hides it)
      featured: {
        show: true,
        kicker: "Stay where we celebrate",
        name: "Dusit D2 Davao",
        area: "Lanang · Our Reception Venue",
        description:
          "The most convenient choice of all: stay right where our reception happens. After a night of dinner, dancing and games, your room is just an elevator ride away. The hotel has kindly given our guests special wedding room rates.",
        image: VENUE.photos[0] ?? "",
        mapsLink: VENUE.map,
        rates: {
          title: "Wedding Event Room Rates",
          // ⚠ check — how should guests book / which name to mention? ("" hides it)
          bookingNote: "",
          rooms: [
            { name: "D'Luxe Room", single: "PHP 5,800", double: "PHP 7,400" },
            { name: "D'Suite Room", single: "PHP 8,400", double: "PHP 9,400" },
          ],
          suites: [
            { name: "Presidential Suite", tag: "", capacity: "Good for 4 adults", rate: "PHP 30,000" },
            { name: "Chairman Suite", tag: "DTRD", capacity: "Good for 6 adults", rate: "PHP 40,000" },
            { name: "Corner Suite", tag: "DTRD", capacity: "Good for 4 adults", rate: "PHP 15,000" },
          ],
          extraPerson: "PHP 2,300",
          footnote: "DTRD · Dusit Thani Residence Davao",
        },
      },
      items: [
        {
          show: true,
          name: "Waterfront Insular Hotel Davao",
          area: "Lanang · Seaside",
          description:
            "A classic Davao seaside resort with palm-lined gardens and views of the gulf. A calm, breezy place to unwind between celebrations, and close to the airport.",
          image: "/suggestedHotel/Waterfront insular hotel Davao.jpeg",
          mapsLink: "",
        },
        {
          show: true,
          name: "Seda Abreeza Davao",
          area: "J.P. Laurel Ave · City Center",
          description:
            "Modern and polished, right beside Abreeza Mall. Perfect if you'd like shops, cafés and restaurants just steps from your room.",
          image: "/suggestedHotel/Seda Abreeza Davao.jpg",
          mapsLink: "",
        },
        {
          show: true,
          name: "Acacia Hotel Davao",
          area: "J.P. Laurel Ave · City Center",
          description:
            "An elegant, refined stay with warm Filipino hospitality and a lovely pool, a favorite of ours for a relaxing weekend in the city.",
          image: "/suggestedHotel/Acacia Hotel Davao.jpg",
          mapsLink: "",
        },
        {
          show: true,
          name: "Park Inn by Radisson Davao",
          area: "Lanang · SM Lanang",
          description:
            "Bright, comfortable rooms connected to SM Lanang Premier. Very convenient for dining, shopping and getting around.",
          image: "/suggestedHotel/Park inn by Radisson.png",
          mapsLink: "",
        },
        {
          show: true,
          name: "Go Hotels Lanang",
          area: "Lanang · Budget-friendly",
          description:
            "Clean, simple and wallet-friendly. A great home base if you plan to spend most of your days out exploring.",
          image: "/suggestedHotel/Go Hotels Lanang.jpeg",
          mapsLink: "",
        },
        {
          show: true,
          name: "Hop Inn Hotel Davao",
          area: "Davao City · Budget-friendly",
          description:
            "A cozy, no-fuss option with everything you need for a good night's rest and an early start the next day.",
          image: "/suggestedHotel/Hop inn Hotel.jpg",
          mapsLink: "",
        },
      ],
    },
    // Featured festival card, shown between the hotels and Explore Davao (show: false hides it)
    festival: {
      show: true,
      kicker: "Happening during our wedding week",
      name: "Kadayawan Festival",
      year: "2027",
      dates: "August 6 – August 22, 2027",
      image: "/kadayawan/kadayawan.png",
      description:
        "Davao's grandest celebration, a city-wide thanksgiving for the bounty of the harvest and a tribute to the culture of its indigenous peoples. Expect streets alive with color, music and flowers.",
      note: "Our wedding falls right in the middle of the festivities, so come early or stay a few extra days and celebrate with the whole city!",
      highlights: ["Street dancing parade", "Floral float parade", "Fruit & flower showcases", "Tribal arts & crafts"],
      link: "https://en.wikipedia.org/wiki/Kadayawan_Festival", // "" hides the button + QR
      linkLabel: "About the Festival",
    },
    activities: {
      kicker: "Make a trip of it",
      title: "Explore Davao",
      subtitle: "while you're here",
      intro:
        "Since you're coming all this way, why not stay a little longer? Here are a few of our favorite things to see, eat and do around the city. We hope you fall in love with Davao the way we have.",
      // ⚠ check — suggested list; swap in the couple's own favorites
      items: [
        {
          show: true,
          name: "Philippine Eagle Center",
          category: "Nature",
          description:
            "Meet the majestic Philippine Eagle, our national bird, in a forest sanctuary up in the cool hills of Malagos.",
          mapsLink: "",
        },
        {
          show: true,
          name: "Samal Island",
          category: "Beach",
          description:
            "A short boat ride across the gulf to white-sand beaches, clear water and island resorts. Perfect for a day trip.",
          mapsLink: "",
        },
        {
          show: true,
          name: "Eden Nature Park",
          category: "Mountain Escape",
          description:
            "Pine trees, fresh mountain air and farm-to-table meals, a refreshing escape just outside the city.",
          mapsLink: "",
        },
        {
          show: true,
          name: "People's Park",
          category: "City Stroll",
          description:
            "A green oasis downtown filled with sculptures inspired by Mindanao's indigenous peoples. A lovely afternoon walk.",
          mapsLink: "",
        },
        {
          show: true,
          name: "Roxas Night Market",
          category: "Food",
          description:
            "Grilled skewers, fresh fruit and local street food. Come hungry, and brave enough to try durian!",
          mapsLink: "",
        },
        {
          show: true,
          name: "Jack's Ridge",
          category: "Dining & Views",
          description:
            "Hilltop dining with a sweeping view of the city lights. Lovely for a relaxed dinner after a full day.",
          mapsLink: "",
        },
      ],
    },
  },
  // Accommodation (components/sections/accommodation.tsx — not on the main page)
  accommodation: {
    coordinator: {
      name: RSVP.coordinator,
      phone: RSVP.phone,
    },
    hotels: [] as { name: string; discount?: string; phone?: string; facebook?: string }[],
    carRentals: [] as { name: string; facebook?: string }[],
  },
}
