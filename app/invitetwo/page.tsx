"use client"

import { InvitationPage } from "@/components/invitation-page"

// Reception-only invitation: shows the reception time and venue, never the ceremony,
// and leaves out the entourage section.
export default function InviteTwoPage() {
  return <InvitationPage receptionOnly showEntourage={false} />
}
