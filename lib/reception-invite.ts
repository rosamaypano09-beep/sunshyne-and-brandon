import type { SiteConfig } from "@/lib/site-config"

/**
 * Reception-only invitation (/invitetwo): guests invited to the reception only.
 *
 * Returns a copy of the site config where the "main event" (ceremony.*, which the
 * hero, countdown, loading screen, RSVP card and FAQ read) points at the reception,
 * the ceremony venue card is hidden, and the program / reminders / FAQ skip the
 * ceremony. Wording lives in siteConfig.receptionInvite (content/site.ts).
 */
export function toReceptionInviteConfig(config: SiteConfig): SiteConfig {
  const { reception, receptionInvite: copy } = config
  const hiddenEvents = new Set(copy.hiddenTimelineEvents)
  const hiddenReminders = new Set(copy.hiddenReminders)
  const venues = config.eventDetails.venues
  const fillReception = (text: string) =>
    text
      .split("{day}").join(reception.day)
      .split("{date}").join(reception.date)
      .split("{time}").join(reception.time)
      .split("{venue}").join(reception.location)

  return {
    ...config,
    wedding: { ...config.wedding, time: reception.time, venue: reception.location },
    ceremony: {
      ...config.ceremony,
      location: reception.location,
      venue: reception.venue,
      map: reception.map,
      image: reception.image,
      time: reception.time,
      timeLabel: "Reception",
      guestsTime: reception.time,
    },
    hero: {
      ...config.hero,
      ...copy.hero,
      meta: fillReception(copy.hero.meta),
    },
    loadingScreen: {
      ...config.loadingScreen,
      topRight: reception.location,
      statusMessages: copy.loadingScreen.statusMessages,
      gala: {
        ...config.loadingScreen.gala,
        cardLine: copy.cardLine,
        eyebrow: copy.loadingScreen.eyebrow,
        promise: copy.loadingScreen.promise,
        kicker: copy.loadingScreen.kicker,
        occasion: copy.loadingScreen.occasion,
        dateLine: fillReception(copy.loadingScreen.dateLine),
      },
    },
    eventDetails: {
      ...config.eventDetails,
      venues: {
        ...venues,
        layout: "separate",
        ceremony: { ...venues.ceremony, show: false },
        reception: { ...venues.reception, show: true, showDate: true },
      },
      reminders: {
        ...config.eventDetails.reminders,
        items: config.eventDetails.reminders.items
          .filter((item) => !hiddenReminders.has(item.title))
          .map((item) =>
            item.title === "Arrival" ? { ...item, paragraphs: [copy.arrivalReminder] } : item,
          ),
      },
    },
    weddingTimeline: {
      ...config.weddingTimeline,
      events: config.weddingTimeline.events.map((event) =>
        hiddenEvents.has(event.title) ? { ...event, show: false } : event,
      ),
    },
    faq: {
      ...config.faq,
      items: config.faq.items.map((item) =>
        copy.faqAnswers[item.question] ? { ...item, answer: copy.faqAnswers[item.question] } : item,
      ),
    },
  }
}
