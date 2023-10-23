import { ContributedArea } from "@/app/contributors/types/ contributed-area"

export interface IContributor {
  name: string
  links: {
    github?: string
    linkedin?: string
    instagram?: string
  }
  contributedArea: ContributedArea[]
}
