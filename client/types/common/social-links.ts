// Define the social link values
export const socialLinkValues = [
  "linkedin",
  "instagram",
  "threads",
  "github",
  "gitlab",
  "twitch",
  "youtube",
  "custom",
  "telegram",
] as const

// Create a type from the values
export type TSocialLink = (typeof socialLinkValues)[number]

// Define the enum
export enum ESocialLink {
  LINKEDIN = "linkedin",
  INSTAGRAM = "instagram",
  THREADS = "threads",
  GITHUB = "github",
  GITLAB = "gitlab",
  TWITCH = "twitch",
  YOUTUBE = "youtube",
  TELEGRAM = "telegram",
  CUSTOM = "custom",
}
