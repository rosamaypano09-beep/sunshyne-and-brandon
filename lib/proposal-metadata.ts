import type { Metadata } from "next"
import { siteConfig, canonicalSiteUrl } from "@/content/site"

const canonicalBase = canonicalSiteUrl

export const PROPOSAL_OG_IMAGE_PATH = siteConfig.linkPreviewImage
export const PROPOSAL_OG_IMAGE_URL = `${canonicalBase}${PROPOSAL_OG_IMAGE_PATH}`

const celebrant = siteConfig.celebrant.nickname

export function buildProposalMetadata(options?: {
  roleTitle?: string
  path?: string
}): Metadata {
  const roleTitle = options?.roleTitle
  const path = options?.path ?? "/will-you-be-proposal"
  const url = `${canonicalBase}${path}`

  const title = roleTitle
    ? `Will You Be ${roleTitle}?`
    : "Will You Be Part of Our Wedding?"

  const description = roleTitle
    ? `${celebrant} would love for you to be ${/^One of My/i.test(roleTitle) ? roleTitle.replace(/^One of My/i, "one of their") : `their ${roleTitle}`} at their wedding. Open this special invitation and share your response.`
    : `${celebrant} have a special wedding invitation for you. Open your link to view it and respond.`

  const ogTitle = `${title} | ${celebrant} Wedding`

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: ogTitle,
      description,
      url,
      siteName: `${celebrant} Wedding`,
      locale: "en_PH",
      type: "website",
      images: [
        {
          url: PROPOSAL_OG_IMAGE_URL,
          secureUrl: PROPOSAL_OG_IMAGE_URL,
          width: siteConfig.linkPreviewImageSize.width,
          height: siteConfig.linkPreviewImageSize.height,
          type: siteConfig.linkPreviewImageSize.type,
          alt: roleTitle
            ? `Will you be ${roleTitle}? — ${celebrant} Wedding`
            : `${celebrant} Wedding`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [PROPOSAL_OG_IMAGE_URL],
    },
  }
}
