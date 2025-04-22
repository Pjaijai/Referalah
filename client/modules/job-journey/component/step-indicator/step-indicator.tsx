"use client"

import React, { useEffect, useRef } from "react"
import { useJobJourneyFormContext } from "@/modules/job-journey/create/hooks/forms/form-context"
import { useI18n } from "@/utils/services/internationalization/client"
import { motion } from "framer-motion"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

// Custom hook to track the previous value of currentStep
function usePrevious(value: number) {
  const ref = useRef<number>()
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref.current
}

const StepIndicator: React.FC = () => {
  const t = useI18n()
  const { currentStep, totalSteps } = useJobJourneyFormContext()
  const stepTitles = [
    t("job_journey.section.basic_info"),
    t("job_journey.section.journey_description"),
  ]
  const previousStep = usePrevious(currentStep) // Track the previous step

  // Determine if the user is going back
  const isGoingBack = previousStep !== undefined && currentStep < previousStep

  // Animation variants for circles
  const circleVariants = {
    initial: { scale: 1, opacity: 1, transition: { duration: 0.3 } },
    active: {
      scale: 1.1,
      opacity: 1,
      transition: {
        duration: 0.3,
        type: "spring",
        stiffness: 300,
        damping: 15,
      },
    },
    completed: { scale: 1, opacity: 1, transition: { duration: 0.3 } },
    goBack: {
      scale: 0.9,
      opacity: 0.8,
      transition: { duration: 0.3, ease: "easeOut" },
    }, // Shrink and fade on go back
  }

  // Animation variants for titles (always visible from the start)
  const titleVariants = {
    initial: { opacity: 1, y: 0 }, // Titles are fully visible from the start
    animate: { opacity: 1, y: 0 }, // No change on animate
    goBack: {
      opacity: 1,
      y: 2,
      transition: { duration: 0.3, ease: "easeOut" },
    }, // Minimal slide, full opacity on go back
  }

  // Animation variants for line color (progress bar effect)
  const lineVariants = {
    initial: {
      background: "rgb(229, 231, 235)", // gray-200
      transition: { duration: 0.8, ease: "easeInOut" },
    },
    completed: {
      background: "rgb(79, 70, 229)", // indigo-600
      transition: { duration: 0.8, ease: "easeInOut" },
    },
    goBack: {
      background: "rgb(229, 231, 235)", // gray-200
      transition: { duration: 0.8, ease: "easeInOut" },
    }, // Transition back to gray-200 on go back
  }

  return (
    <div className="flex items-start justify-center space-x-12 bg-white px-10 pt-10">
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1
        const isCurrentStep = currentStep === stepNumber
        const isPreviousStep = currentStep > stepNumber
        const isLastStep = stepNumber === totalSteps

        // Determine if this line should animate "goBack" (for lines between steps that are no longer completed)
        const isLineGoingBack =
          isGoingBack && previousStep !== undefined && stepNumber >= currentStep

        // Determine animation state for circle and title
        let animationState: string
        if (isGoingBack && stepNumber > currentStep) {
          animationState = "goBack" // Apply goBack animation if moving back to a previous step
        } else {
          animationState = isCurrentStep
            ? "active"
            : isPreviousStep
            ? "completed"
            : "initial"
        }

        return (
          <div key={index} className="relative flex items-start">
            {/* Circle and Title Container */}
            <div className="z-10 flex w-[200px] flex-col items-center">
              {/* Animated Circle */}
              <motion.div
                className={`relative flex h-[30px] w-[30px] items-center justify-center rounded-full text-xs transition-transform duration-300 hover:scale-110 ${
                  isPreviousStep || isCurrentStep
                    ? "bg-indigo-600 text-white"
                    : "border border-slate-200 bg-white text-xs font-medium text-gray-500"
                }`}
                variants={circleVariants}
                initial="initial"
                animate={animationState}
              >
                {isPreviousStep ? (
                  <Check className="h-5 w-5" /> // Tick icon for previous steps
                ) : (
                  String(stepNumber).padStart(2, "0") // Number for current/future steps
                )}
              </motion.div>
              {/* Title (Always Visible from the Start) */}
              <motion.span
                className={cn(
                  "mt-[3px] text-xs font-bold text-gray-400",
                  (isPreviousStep || isCurrentStep) && " text-indigo-600",
                  isCurrentStep && "text-base"
                )}
                variants={titleVariants}
                initial="initial"
                animate={animationState}
              >
                {stepTitles[index]}
              </motion.span>
            </div>
            {/* Connecting Line (Always Visible with Color Animation) */}
            {!isLastStep && (
              <motion.div
                className="absolute top-1/4 h-[1px] -translate-y-1/4"
                style={{
                  left: "100%",
                  width: "250px",
                  transform: "translateX(-40%)",
                }}
                variants={lineVariants}
                initial="initial"
                animate={
                  isLineGoingBack
                    ? "goBack"
                    : isPreviousStep
                    ? "completed"
                    : "initial"
                }
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default StepIndicator
