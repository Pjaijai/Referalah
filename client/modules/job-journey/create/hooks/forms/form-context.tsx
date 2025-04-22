import React, { ReactNode, createContext, useContext, useState } from "react"

interface JobJourneyFormContextType {
  currentStep: number
  nextStep: () => void
  prevStep: () => void
  totalSteps: number
  isLastStep: boolean
}

const JobJourneyFormContext = createContext<
  JobJourneyFormContextType | undefined
>(undefined)

export const JobJourneyFormProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const totalSteps = 2
  const [currentStep, setCurrentStep] = useState(1)

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Compute isLastStep based on currentStep and totalSteps
  const isLastStep = currentStep === totalSteps

  return (
    <JobJourneyFormContext.Provider
      value={{ currentStep, nextStep, prevStep, totalSteps, isLastStep }}
    >
      {children}
    </JobJourneyFormContext.Provider>
  )
}

export const useJobJourneyFormContext = () => {
  const context = useContext(JobJourneyFormContext)
  if (!context) {
    throw new Error(
      "useJobJourneyForm must be used within a JobJourneyFormProvider"
    )
  }
  return context
}
