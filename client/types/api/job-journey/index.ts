import { TCompanyMetaData } from "@/types/api/company"
import { IFilterMeta } from "@/types/api/request/search/filter-meta"
import { IIndustryResponse } from "@/types/api/response/industry"
import { TLocationData } from "@/types/api/response/location"
import { EInterviewLocation } from "@/types/common/enums/interview-location"
import { EInterviewType } from "@/types/common/enums/interview-type"
import { EJobLevel } from "@/types/common/enums/job-level"
import { EJobType } from "@/types/common/enums/job-type"
import { EStepType } from "@/types/common/enums/step-type"

export interface IJobJourneyFilterMeta
  extends Pick<IFilterMeta, "keywords" | "sorting"> {
  jobLevel: EJobLevel | "all"
  industry: string
  locations: string[]
  companyId?: number
}

export type TStep = {
  type: string
  date: string
  remarks: string | null
  position: number
  interviewLocation: string | null
  interviewType: string | null
}

export type TCreateJobJourneyRequest = {
  title: string
  company: number | null
  positionTitle: string
  industry: string
  location: string
  jobType: string
  jobLevel: string
  applicationDate: string
  source: string
  description: string | null
  steps: TStep[]
  newCompany: string | null
}

export type TJobJourney = {
  id: number
  title: string
  uuid: string
  company_id: number
  company_name: string | null
  position_title: string
  description: string
  source: string | null
  industry_uuid: string | null
  location_uuid: string | null
  job_type: EJobType
  job_level: EJobLevel
  application_submitted_date: string // ISO date string
  visibility: string | null
  content: string | null
  status: string | null
  created_by: string // UUID
  created_at: string // ISO timestamp
  updated_at: string | null
  last_step_status: EStepType
  last_step_status_updated_at: string
  company: {
    id: number
    name: string
    meta_data: TCompanyMetaData
  } | null
  user: {
    username: string
    uuid: string
  }
  location: Pick<TLocationData, "english_name" | "cantonese_name" | "uuid">
  industry: Pick<IIndustryResponse, "english_name" | "cantonese_name" | "uuid">
  fire_count: number
}

// Type for Job Journey Step
export type TJobJourneyStep = {
  id: number
  uuid: string
  job_journey_uuid: string
  step_date: string // ISO date string
  step_type: EStepType
  interview_type: EInterviewType | null
  interview_location: EInterviewLocation | null
  remarks: string | null
  position: number
  created_at: string // ISO timestamp
  updated_at: string | null
  fire_count: number
}

// Type for Job Journey with Steps
export type TJobJourneyWithSteps = TJobJourney & {
  job_journey_step: TJobJourneyStep[]
}
