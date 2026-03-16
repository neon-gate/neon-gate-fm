import { Progress, Volume } from './domain'

/* =================
  System Data
================== */
export const isAuthenticated = false

/* =================
  Player State Data
================== */
export const progress = {
  milliseconds: 0
} satisfies Progress
export const volume = Volume.Quiet
export const theme = 'system'
export const isPaused = true

/* =================
  Page Metadata
================== */
export const description = 'The app that hates your > 2000s songs. 😤'
export const robots = {
  index: false,
  follow: false
}
