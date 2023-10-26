import { ContributedArea } from "@/modules/contributors/types/contributed-area"

export interface IContributor {
  name: string
  links: {
    github?: string
    linkedin?: string
    instagram?: string
    website?: string
  }
  contributedArea: ContributedArea[]
}
