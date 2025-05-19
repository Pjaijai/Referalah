import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"
import { initSupabaseClient } from "../_shared/client.ts"
import { initSupabaseServer } from "../_shared/server.ts"

// Define interfaces for input data
interface IStep {
  type: string
  date: string
  remarks: string | null
  position: number
  interview_type: string | null
  interview_location: string | null
}

interface ICreateJobJourneyRequest {
  title: string
  position_title: string
  company: number | null
  industry: string
  location: string
  job_type: string
  job_level: string
  application_date: string
  source: string
  description: string
  steps: IStep[]
  new_company: string | null
}

// Validation lists
const validSources = [
  "referral",
  "company_website",
  "recruiter",
  "career_fair",
  "social_media",
  "networking_event",
  "university_portal",
  "staffing_agency",
  "walk_in",
  "linkedin",
  "indeed",
  "glassdoor",
  "referalah",
  "other_job_platform",
  "other",
]

const validJobTypes = [
  "internship",
  "co_op",
  "full_time",
  "contract",
  "part_time",
  "temporary",
  "seasonal",
  "apprenticeship",
  "volunteer",
  "other",
]

const validJobLevels = [
  "entry_level",
  "junior",
  "mid_level",
  "senior",
  "management_level",
  "executive_level",
  "lead",
  "principal",
  "director",
  "vice_president",
  "c_level",
  "trainee",
  "other",
]

const validStepTypes = [
  "interview",
  "take_home_challenge",
  "offer",
  "rejected",
  "withdrawn",
]

const validInterviewLocations = ["on_site", "virtual", "other"]

const validInterviewTypes = [
  "hr_screening",
  "technical",
  "regular",
  "behavioral",
  "informal",
  "cultural_fit",
  "group_interview",
]

// Helper to get the end of today for date validation
const getEndOfToday = () => {
  const today = new Date()
  today.setHours(23, 59, 59, 999)
  return today
}

serve(async (req: Request) => {
  try {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders })
    }

    const client = initSupabaseClient(req)
    const server = initSupabaseServer()

    // Validate Authorization header
    const jwt = req.headers.get("Authorization")?.split(" ")[1]
    if (!jwt) {
      return new Response(
        JSON.stringify({
          error: "Unauthorized: No valid Authorization header",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401,
        },
      )
    }

    // Verify user
    const {
      data: { user: authUser },
      error: authError,
    } = await client.auth.getUser(jwt)

    const { data: user, error } = await server
      .from("user")
      .select("uuid,username, email, status")
      .eq("uuid", authUser.id)
      .single()

    if (authError || !user || user.status !== "active") {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Invalid user token" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401,
        },
      )
    }

    // Parse input
    const input: ICreateJobJourneyRequest = await req.json()

    // Validate input fields
    if (
      !input.title ||
      typeof input.title !== "string" ||
      input.title.length > 100
    ) {
      return new Response(
        JSON.stringify({ error: "Invalid title: Must be 1-100 characters" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      )
    }

    if (
      !input.position_title ||
      typeof input.position_title !== "string" ||
      input.position_title.length > 100
    ) {
      return new Response(
        JSON.stringify({
          error: "Invalid position_title: Must be 1-100 characters",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      )
    }

    if (
      !input.industry ||
      typeof input.industry !== "string" ||
      input.industry.length > 100
    ) {
      return new Response(
        JSON.stringify({ error: "Invalid industry: Must be 1-100 characters" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      )
    }

    if (
      !input.location ||
      typeof input.location !== "string" ||
      input.location.length > 100
    ) {
      return new Response(
        JSON.stringify({ error: "Invalid location: Must be 1-100 characters" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      )
    }

    if (
      !input.description ||
      typeof input.description !== "string" ||
      input.description.length < 10 ||
      input.description.length > 3000
    ) {
      return new Response(
        JSON.stringify({
          error: "Invalid description: Must be 10-3000 characters",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      )
    }

    // Validate company or new_company
    const hasCompany = input.company !== null && input.company !== undefined
    const hasNewCompany =
      typeof input.new_company === "string" && input.new_company.trim() !== ""
    if ((hasCompany && hasNewCompany) || (!hasCompany && !hasNewCompany)) {
      return new Response(
        JSON.stringify({
          error: "Either company or new_company must be provided, but not both",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      )
    }

    if (
      hasCompany &&
      (typeof input.company !== "number" || input.company < 0)
    ) {
      return new Response(
        JSON.stringify({
          error: "Invalid company: Must be a non-negative number",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      )
    }

    if (hasNewCompany && input.new_company!.length > 100) {
      return new Response(
        JSON.stringify({
          error: "Invalid new_company: Must be 1-100 characters",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      )
    }

    // Validate job_type
    if (!validJobTypes.includes(input.job_type)) {
      return new Response(
        JSON.stringify({
          error: `Invalid job_type: Must be one of ${validJobTypes.join(", ")}`,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      )
    }

    // Validate job_level
    if (!validJobLevels.includes(input.job_level)) {
      return new Response(
        JSON.stringify({
          error: `Invalid job_level: Must be one of ${validJobLevels.join(
            ", ",
          )}`,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      )
    }

    // Validate source
    if (!validSources.includes(input.source)) {
      return new Response(
        JSON.stringify({
          error: `Invalid source: Must be one of ${validSources.join(", ")}`,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      )
    }

    // Validate application_date
    const applicationDate = new Date(input.application_date)
    if (
      isNaN(applicationDate.getTime()) ||
      applicationDate < new Date(1900, 0, 1) ||
      applicationDate > getEndOfToday()
    ) {
      return new Response(
        JSON.stringify({
          error:
            "Invalid application_date: Must be a valid ISO date between 1900 and today",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      )
    }

    // Validate steps
    let lastStepStatus: string | null = null
    let lastStepStatusUpdatedAt: string | null = null

    if (input.steps) {
      if (!Array.isArray(input.steps)) {
        return new Response(
          JSON.stringify({ error: "Invalid steps: Must be an array" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          },
        )
      }

      const sortedSteps = [...input.steps].sort(
        (a, b) => a.position - b.position,
      )

      // Validate step1 date against application_date
      const step1 = sortedSteps.find((step) => step.position === 1)
      if (step1) {
        const step1Date = new Date(step1.date)
        if (isNaN(step1Date.getTime()) || step1Date < new Date(1900, 0, 1)) {
          return new Response(
            JSON.stringify({
              error:
                "Invalid step date: Must be a valid ISO date between 1900 and today",
            }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 400,
            },
          )
        }
        if (step1Date < applicationDate) {
          return new Response(
            JSON.stringify({
              error: "Step 1 date cannot be earlier than application_date",
            }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 400,
            },
          )
        }
      }

      // Validate each step
      for (let i = 0; i < sortedSteps.length; i++) {
        const step = sortedSteps[i]

        // Validate step type
        if (!validStepTypes.includes(step.type)) {
          return new Response(
            JSON.stringify({
              error: `Invalid step type: Must be one of ${validStepTypes.join(
                ", ",
              )}`,
            }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 400,
            },
          )
        }

        // Validate step date
        const stepDate = new Date(step.date)
        if (isNaN(stepDate.getTime())) {
          return new Response(
            JSON.stringify({
              error:
                "Invalid step date: Must be a valid ISO date between 1900 and today",
            }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 400,
            },
          )
        }

        // Validate remarks
        if (
          step.remarks &&
          (typeof step.remarks !== "string" || step.remarks.length > 1000)
        ) {
          return new Response(
            JSON.stringify({
              error:
                "Invalid remarks: Must be a string up to 1000 characters or null",
            }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 400,
            },
          )
        }

        // Validate position
        if (typeof step.position !== "number" || step.position <= 0) {
          return new Response(
            JSON.stringify({
              error: "Invalid position: Must be a positive number",
            }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 400,
            },
          )
        }

        // Validate interview_type and interview_location for interview steps
        if (step.type === "interview") {
          if (
            !step.interview_type ||
            !validInterviewTypes.includes(step.interview_type)
          ) {
            return new Response(
              JSON.stringify({
                error: `Invalid interview_type: Must be one of ${validInterviewTypes.join(
                  ", ",
                )}`,
              }),
              {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 400,
              },
            )
          }
          if (
            !step.interview_location ||
            !validInterviewLocations.includes(step.interview_location)
          ) {
            return new Response(
              JSON.stringify({
                error: `Invalid interview_location: Must be one of ${validInterviewLocations.join(
                  ", ",
                )}`,
              }),
              {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 400,
              },
            )
          }
        } else {
          // Ensure interview_type and interview_location are null for non-interview steps
          if (step.interview_type !== null) {
            return new Response(
              JSON.stringify({
                error:
                  "Invalid interview_type: Must be null for non-interview steps",
              }),
              {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 400,
              },
            )
          }
          if (step.interview_location !== null) {
            return new Response(
              JSON.stringify({
                error:
                  "Invalid interview_location: Must be null for non-interview steps",
              }),
              {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 400,
              },
            )
          }
        }

        // Validate step date order
        if (i > 0) {
          const prevStep = sortedSteps[i - 1]
          const prevStepDate = new Date(prevStep.date)
          if (stepDate < prevStepDate) {
            return new Response(
              JSON.stringify({
                error: `Step ${step.position} date (${step.date}) cannot be earlier than Step ${prevStep.position} date (${prevStep.date})`,
              }),
              {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 400,
              },
            )
          }
        }
      }

      // Set last_step_status and last_step_status_updated_at
      if (sortedSteps.length > 0) {
        const lastStep = sortedSteps[sortedSteps.length - 1]
        lastStepStatus = lastStep.type
        lastStepStatusUpdatedAt = new Date().toISOString()
      }
    }

    // Insert job_journey record
    const { data: jobJourneyData, error: jobJourneyError } = await server
      .from("job_journey")
      .insert({
        company_id: input.company,
        position_title: input.position_title.trim(),
        title: input.title.trim(),
        description: input.description.trim(),
        source: input.source,
        industry_uuid: input.industry,
        location_uuid: input.location,
        job_type: input.job_type,
        job_level: input.job_level,
        application_submitted_date: input.application_date,
        visibility: "public",
        status: "active",
        created_by: user.uuid,
        last_step_status: lastStepStatus,
        last_step_status_updated_at: lastStepStatusUpdatedAt,
        company_name: input.new_company?.trim(),
      })
      .select("uuid")
      .single()

    if (jobJourneyError || !jobJourneyData) {
      return new Response(
        JSON.stringify({
          error: `Failed to create job journey: ${
            jobJourneyError?.message || "Unknown error"
          }`,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      )
    }

    const jobJourneyUuid = jobJourneyData.uuid

    // Insert job_journey_steps
    if (input.steps && input.steps.length > 0) {
      const stepsToInsert = input.steps.map((step) => ({
        job_journey_uuid: jobJourneyUuid,
        step_date: step.date,
        step_type: step.type,
        remarks: step.remarks?.trim(),
        position: step.position,
        created_by: user.uuid,
        interview_type: step.interview_type,
        interview_location: step.interview_location,
      }))

      const { error: stepsError } = await server
        .from("job_journey_step")
        .insert(stepsToInsert)

      if (stepsError) {
        // Rollback by deleting the job_journey record
        await server.from("job_journey").delete().eq("uuid", jobJourneyUuid)
        return new Response(
          JSON.stringify({
            error: `Failed to create job journey steps: ${stepsError.message}`,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          },
        )
      }
    }

    // Success response
    const res = {
      data: {
        job_journey_uuid: jobJourneyUuid,
      },
      success: true,
    }

    return new Response(JSON.stringify(res), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    })
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        message:
          error.message || "Create Job journey - An unexpected error occurred",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      },
    )
  }
})
