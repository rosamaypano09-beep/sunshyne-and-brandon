import { fillCelebrant } from "@/lib/celebrant"
import type { SiteConfig } from "@/lib/site-config"

/** The ghost-marquee line (loadingScreen.gala.ghostText), e.g. "Sunshyne & Brandon  ·  A Tale as Old as Time". */
export function ghostTextFor(siteConfig: SiteConfig): string {
  return (siteConfig.loadingScreen?.gala?.ghostText ?? [])
    .map((t) => fillCelebrant(t, siteConfig))
    .filter(Boolean)
    .join("  ·  ")
}
