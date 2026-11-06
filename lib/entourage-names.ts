// Tidies names typed into the Google Sheet / RSVP forms for display on the invitation.

const ROMAN_NUMERAL = /^(I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII|XIII|XIV|XV)$/i

// Dropped from the start of a name so a list reads consistently: not everyone typed one
const DROPPED_PREFIXES = new Set([
  "mr", "mrs", "ms", "miss", "tito", "tita", "aunt", "auntie", "uncle", "ninong", "ninang",
])

// Earned titles are kept, in their proper spelling
const KEPT_PREFIXES: Record<string, string> = {
  ar: "Ar.",
  arch: "Arch.",
  atty: "Atty.",
  dr: "Dr.",
  engr: "Engr.",
  fr: "Fr.",
  hon: "Hon.",
  msgr: "Msgr.",
  pastor: "Pastor",
  pbgen: "PBGEN",
  ptr: "Ptr.",
  rev: "Rev.",
}

const GENERATION_SUFFIXES: Record<string, string> = { jr: "Jr.", sr: "Sr." }
const CREDENTIAL_SUFFIXES: Record<string, string> = {
  cpa: "CPA",
  md: "MD",
  phd: "PhD",
  rn: "RN",
}

const EMOJI = /[\p{Extended_Pictographic}\u{FE0F}\u{200D}]/gu

const bareWord = (word: string) => word.replace(/[.,]+$/, "")

/** Keeps deliberate mixed case (McDonald); fixes ALL CAPS and all lowercase. */
function capitalize(word: string) {
  return word
    .split("-")
    .map((part) => {
      const isMixedCase = part !== part.toLowerCase() && part !== part.toUpperCase()
      if (isMixedCase && part.charAt(0) === part.charAt(0).toUpperCase()) return part
      return part.toLowerCase().replace(/(^|['’])(\p{L})/gu, (_, start, letter) => start + letter.toUpperCase())
    })
    .join("-")
}

function formatPerson(value: string) {
  const words = value
    .replace(/(\p{L})\.(?=\p{L})/gu, "$1. ") // "A.Lagrosas" → "A. Lagrosas"
    .split(/\s+/)
    .map(bareWord)
    .filter(Boolean)

  const prefixes: string[] = []
  while (words.length > 1) {
    const key = words[0].toLowerCase()
    if (DROPPED_PREFIXES.has(key)) words.shift()
    else if (KEPT_PREFIXES[key]) prefixes.push(KEPT_PREFIXES[words.shift()!.toLowerCase()])
    else break
  }

  const suffixes: string[] = []
  while (words.length > 1) {
    const key = words[words.length - 1].toLowerCase()
    const suffix = GENERATION_SUFFIXES[key] ?? CREDENTIAL_SUFFIXES[key]
    if (!suffix) break
    suffixes.unshift(CREDENTIAL_SUFFIXES[key] ? `, ${suffix}` : ` ${suffix}`)
    words.pop()
  }

  const name = words.map((word, index) => {
    if (/^\p{L}$/u.test(word)) return `${word.toUpperCase()}.` // middle initial
    if (index === 0 && /^ma$/i.test(word)) return "Ma." // Filipino short form of Maria
    if (index > 0 && ROMAN_NUMERAL.test(word)) return word.toUpperCase()
    return capitalize(word)
  })

  return [...prefixes, ...name].join(" ") + suffixes.join("")
}

/**
 * "Mr Efren A.lagrosas"            → "Efren A. Lagrosas"
 * "Mrs. Ann Cruz/Mr. Jude Cruz"    → "Ann Cruz & Jude Cruz"
 * "Leo Santos / Mr. Grounded 😊"   → "Leo Santos" (a one-word alias is not a second person)
 */
export function toDisplayName(value: string) {
  const people = value
    .replace(EMOJI, "")
    .split(/\s*[/&]\s*|\s+and\s+/i)
    .filter((person) => /\p{L}/u.test(person)) // a lone "-" means no one
    .map(formatPerson)
  const fullNames = people.filter((person) => person.includes(" "))
  return (fullNames.length > 0 ? fullNames : people.slice(0, 1)).join(" & ")
}

/** "MOTHER OF THE BRIDE" → "Mother of the Bride" */
export function toDisplayRole(value: string) {
  return value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word, index) =>
      index > 0 && /^(of|the|and)$/i.test(word) ? word.toLowerCase() : capitalize(word),
    )
    .join(" ")
}
