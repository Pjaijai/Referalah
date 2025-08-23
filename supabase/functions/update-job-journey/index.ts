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

interface IUpdateJobJourneyRequest {
  uuid: string
  description: string
  steps: IStep[]
}

// Validation lists
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

    if (authError || !authUser) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Invalid user token" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401,
        },
      )
    }

    const { data: user, error: userError } = await server
      .from("user")
      .select("uuid,username, email, status")
      .eq("uuid", authUser.id)
      .single()

    if (userError || !user || user.status !== "active") {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Invalid user token" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401,
        },
      )
    }

    // Parse input
    const input: IUpdateJobJourneyRequest = await req.json()

    // Validate UUID
    if (!input.uuid || typeof input.uuid !== "string") {
      return new Response(
        JSON.stringify({ error: "Invalid uuid: UUID is required" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      )
    }

    // Check if job journey exists and user is the creator
    const { data: existingJobJourney, error: fetchError } = await server
      .from("job_journey")
      .select(
        "uuid, created_by, application_submitted_date, description, last_step_status",
      )
      .eq("uuid", input.uuid)
      .eq("status", "active")
      .single()

    if (fetchError || !existingJobJourney) {
      return new Response(JSON.stringify({ error: "Job journey not found" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 404,
      })
    }

    // Check if user is the creator
    if (existingJobJourney.created_by !== user.uuid) {
      return new Response(
        JSON.stringify({
          error: "Unauthorized: You can only update your own job journeys",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 403,
        },
      )
    }

    // Check if job journey is in final status (cannot be updated)
    const finalStatuses = ["offer", "rejected", "withdrawn"]
    if (
      existingJobJourney.last_step_status &&
      finalStatuses.includes(existingJobJourney.last_step_status)
    ) {
      return new Response(
        JSON.stringify({
          error: `Cannot update job journey: Job journey is in final status '${existingJobJourney.last_step_status}'`,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      )
    }

    // Validate description
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

    // Validate steps
    if (!input.steps || !Array.isArray(input.steps)) {
      return new Response(
        JSON.stringify({
          error: "Invalid steps: Steps must be provided as an array",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      )
    }

    // Check for changes - either description or steps must change
    const descriptionChanged =
      input.description.trim() !== (existingJobJourney.description || "").trim()

    // Fetch existing steps to compare
    const { data: existingSteps, error: stepsError } = await server
      .from("job_journey_step")
      .select(
        "step_type, step_date, remarks, position, interview_type, interview_location",
      )
      .eq("job_journey_uuid", input.uuid)
      .order("position")

    if (stepsError) {
      return new Response(
        JSON.stringify({
          error: `Failed to fetch existing steps: ${stepsError.message}`,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      )
    }

    // Compare steps to detect changes
    const sortedNewSteps = [...input.steps].sort(
      (a, b) => a.position - b.position,
    )
    const existingStepsFormatted = (existingSteps || []).map((step) => ({
      type: step.step_type,
      date: new Date(step.step_date).toISOString(),
      remarks: step.remarks,
      position: step.position,
      interview_type: step.interview_type,
      interview_location: step.interview_location,
    }))

    // Normalize new steps for comparison
    const normalizedNewSteps = sortedNewSteps.map((step) => ({
      type: step.type,
      date: new Date(step.date).toISOString(),
      remarks: step.remarks,
      position: step.position,
      interview_type: step.interview_type,
      interview_location: step.interview_location,
    }))

    // Check if no changes detected
    if (!descriptionChanged && sortedNewSteps.length === 0) {
      return new Response(
        JSON.stringify({
          error:
            "No changes detected: Either description or steps must be modified",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      )
    }

    const applicationDate = new Date(
      existingJobJourney.application_submitted_date,
    )

    // Validate step1 date against application_date
    const step1 = sortedNewSteps.find((step) => step.position === 1)
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

    // Find the highest existing step position
    const maxExistingPosition =
      existingStepsFormatted.length > 0
        ? Math.max(...existingStepsFormatted.map((step) => step.position))
        : 0

    // Validate each step and ensure new positions come after existing ones
    for (let i = 0; i < sortedNewSteps.length; i++) {
      const step = sortedNewSteps[i]

      // Check that new step positions are sequential and start right after existing steps
      const expectedPosition = maxExistingPosition + 1 + i
      if (step.position !== expectedPosition) {
        return new Response(
          JSON.stringify({
            error: `New step position ${step.position} is invalid. Expected position is ${expectedPosition}. New steps must be sequential and start immediately after existing steps.`,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          },
        )
      }

      // Validate step type
      if (!validStepTypes.includes(step.type)) {
        return new Response(
          JSON.stringify({
            error: `Invalid step type: Must be one of ${validStepTypes.join(", ")}`,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          },
        )
      }

      // Validate step date
      const stepDate = new Date(step.date)
      const endOfToday = new Date()
      endOfToday.setHours(23, 59, 59, 999) // Set to end of today
      if (
        isNaN(stepDate.getTime()) ||
        stepDate < new Date(1900, 0, 1) ||
        stepDate > endOfToday
      ) {
        return new Response(
          JSON.stringify({
            error:
              "Invalid step date: Must be a valid ISO date between 1900 and the end of today (inclusive)",
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
              error: `Invalid interview_type: Must be one of ${validInterviewTypes.join(", ")}`,
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
              error: `Invalid interview_location: Must be one of ${validInterviewLocations.join(", ")}`,
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
    }

    // Combine all steps (existing + new) for validation
    const allSteps = [...existingStepsFormatted, ...normalizedNewSteps]
    const allStepsSorted = allSteps.sort((a, b) => a.position - b.position)

    // Validate chronological order of all steps (existing + new)
    for (let i = 1; i < allStepsSorted.length; i++) {
      const prevStep = allStepsSorted[i - 1]
      const currentStep = allStepsSorted[i]
      const prevStepDate = new Date(prevStep.date)
      const currentStepDate = new Date(currentStep.date)

      if (currentStepDate < prevStepDate) {
        return new Response(
          JSON.stringify({
            error: `Step ${currentStep.position} date (${currentStep.date}) cannot be earlier than Step ${prevStep.position} date (${prevStep.date})`,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          },
        )
      }
    }

    // Calculate last step status from all steps (existing + new)
    const lastStep = allStepsSorted[allStepsSorted.length - 1]
    const lastStepStatus = lastStep.type
    const lastStepStatusUpdatedAt = new Date().toISOString()

    // Only insert new steps that don't already exist
    const newStepsToInsert: Array<{
      job_journey_uuid: string
      step_date: string
      step_type: string
      remarks: string | null
      position: number
      created_by: string
      interview_type: string | null
      interview_location: string | null
    }> = []

    for (const newStep of sortedNewSteps) {
      // Since we've validated that all new step positions are after existing ones,
      // all new steps should be inserted
      newStepsToInsert.push({
        job_journey_uuid: input.uuid,
        step_date: newStep.date,
        step_type: newStep.type,
        remarks: newStep.remarks?.trim() || null,
        position: newStep.position,
        created_by: user.uuid,
        interview_type: newStep.interview_type,
        interview_location: newStep.interview_location,
      })
    }

    // Insert only the new steps
    if (newStepsToInsert.length > 0) {
      const { error: insertStepsError } = await server
        .from("job_journey_step")
        .insert(newStepsToInsert)

      if (insertStepsError) {
        return new Response(
          JSON.stringify({
            error: `Failed to insert new steps: ${insertStepsError.message}`,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          },
        )
      }
    }

    // Update job journey description and last step status
    const { error: updateJobJourneyError } = await server
      .from("job_journey")
      .update({
        description: input.description.trim(),
        last_step_status: lastStepStatus,
        last_step_status_updated_at: lastStepStatusUpdatedAt,
        updated_at: new Date().toISOString(),
      })
      .eq("uuid", input.uuid)

    if (updateJobJourneyError) {
      return new Response(
        JSON.stringify({
          error: `Failed to update job journey: ${updateJobJourneyError.message}`,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      )
    }

    // Success response
    const res = {
      data: {
        job_journey_uuid: input.uuid,
      },
      success: true,
    }

    return new Response(JSON.stringify(res), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    })
  } catch (error: unknown) {
    return new Response(
      JSON.stringify({
        message:
          (error as Error).message ||
          "Update Job journey - An unexpected error occurred",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      },
    )
  }
})
