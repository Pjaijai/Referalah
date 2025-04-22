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

serve(async (req: Request) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders })
    }

    const client = initSupabaseClient(req)
    const server = initSupabaseServer()

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

    const {
      data: { user },
    } = await client.auth.getUser(jwt)
    if (!user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Invalid user token" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401,
        },
      )
    }

    const input: ICreateJobJourneyRequest = await req.json()

    // Validate input
    if (!input.title || input.title.length > 100) {
      return new Response(
        JSON.stringify({ error: "Invalid title: Must be 1-100 characters" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      )
    }

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
      input.company !== null &&
      (typeof input.company !== "number" || input.company < 0)
    ) {
      return new Response(
        JSON.stringify({
          error: "Invalid company: Must be a non-negative number or null",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      )
    }

    if (input.new_company && input.new_company.length > 100) {
      return new Response(
        JSON.stringify({
          error: "Invalid new_company: Must not exceed 100 characters",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      )
    }

    if (!input.title || typeof input.industry !== "string") {
      return new Response(
        JSON.stringify({
          error: "Invalid title: Must not exceed 100 characters",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      )
    }

    if (!input.description || typeof input.description !== "string") {
      return new Response(
        JSON.stringify({
          error: "Invalid description: Must not exceed 100 characters",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      )
    }

    if (input.title && input.title.length > 100) {
      return new Response(
        JSON.stringify({
          error: "Invalid title: Must not exceed 100 characters",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      )
    }

    if (input.description && input.description.length > 3000) {
      return new Response(
        JSON.stringify({
          error: "Invalid description: Must not exceed 3000 characters",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      )
    }

    if (input.industry && typeof input.industry !== "string") {
      return new Response(
        JSON.stringify({ error: "Invalid industry: Must be a string" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      )
    }

    if (input.location && typeof input.location !== "string") {
      return new Response(
        JSON.stringify({ error: "Invalid location: Must be a string" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      )
    }

    if (!validJobTypes.includes(input.job_type)) {
      return new Response(
        JSON.stringify({
          error: `Invalid jobType: Must be one of ${validJobTypes.join(", ")}`,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      )
    }

    if (!validJobLevels.includes(input.job_level)) {
      return new Response(
        JSON.stringify({
          error: `Invalid jobLevel: Must be one of ${validJobLevels.join(
            ", ",
          )}`,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      )
    }

    const applicationDate = new Date(input.application_date)
    if (isNaN(applicationDate.getTime())) {
      return new Response(
        JSON.stringify({
          error: "Invalid applicationDate: Must be a valid ISO date string",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      )
    }

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

    if (input.description && input.description.length > 3000) {
      return new Response(
        JSON.stringify({
          error: "Invalid description: Must not exceed 3000 characters",
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

      // Validate step1 (position 1) date is not earlier than applicationDate
      const step1 = sortedSteps.find((step) => step.position === 1)
      if (step1) {
        const step1Date = new Date(step1.date)
        if (isNaN(step1Date.getTime())) {
          return new Response(
            JSON.stringify({
              error: "Invalid step date: Must be a valid ISO date string",
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
              error: "Step 1 date cannot be earlier than applicationDate",
            }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 400,
            },
          )
        }
      }

      // Validate step dates in order
      for (let i = 0; i < sortedSteps.length; i++) {
        const step = sortedSteps[i]
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

        const stepDate = new Date(step.date)
        if (isNaN(stepDate.getTime())) {
          return new Response(
            JSON.stringify({
              error: "Invalid step date: Must be a valid ISO date string",
            }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 400,
            },
          )
        }

        if (step.remarks && step.remarks.length > 1000) {
          return new Response(
            JSON.stringify({
              error: "Invalid remarks: Must not exceed 1000 characters",
            }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 400,
            },
          )
        }

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

      // Set last_step_status and last_step_status_updated_at if steps are provided
      if (sortedSteps.length > 0) {
        const lastStep = sortedSteps[sortedSteps.length - 1] // Highest position
        lastStepStatus = lastStep.type
        lastStepStatusUpdatedAt = new Date().toISOString() // Use current timestamp since created_at will be set on insert
      }
    }

    // Handle newCompany (create a new company if provided)

    // Insert job_journey record with last_step_status and last_step_status_updated_at
    const { data: jobJourneyData, error: jobJourneyError } = await server
      .from("job_journey")
      .insert({
        company_id: input.company,
        position_title: input.position_title,
        title: input.title,
        description: input.description,
        source: input.source,
        industry_uuid: input.industry || null,
        location_uuid: input.location || null,
        job_type: input.job_type,
        job_level: input.job_level,
        application_submitted_date: input.application_date,
        visibility: "public",
        status: "active",
        created_by: user.id,
        last_step_status: lastStepStatus,
        last_step_status_updated_at: lastStepStatusUpdatedAt,
        company_name: input.new_company,
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

    // Insert job_journey_steps if any
    if (input.steps && input.steps.length > 0) {
      const stepsToInsert = input.steps.map((step) => ({
        job_journey_uuid: jobJourneyUuid,
        step_date: step.date,
        step_type: step.type,
        remarks: step.remarks,
        position: step.position,
        created_by: user.id,
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
