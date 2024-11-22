import { TSocialLink } from "@/types/common/social-links"

export interface ISocialLinksData {
  type: TSocialLink
  name: string | null
  url: string
}
