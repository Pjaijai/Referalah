import React, { ReactNode, createContext, useContext, useState } from "react"

interface JobJourneyFormContextType {
  currentStep: number
  nextStep: () => void
  prevStep: () => void
  totalSteps: number
  isLastStep: boolean
  goToStep: (step: number) => void
}

const JobJourneyFormContext = createContext<
  JobJourneyFormContextType | undefined
>(undefined)

export const JobJourneyFormProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const totalSteps = 3
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

  const goToStep = (step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step)
    }
  }

  // Compute isLastStep based on currentStep and totalSteps
  const isLastStep = currentStep === totalSteps

  return (
    <JobJourneyFormContext.Provider
      value={{
        currentStep,
        nextStep,
        prevStep,
        totalSteps,
        isLastStep,
        goToStep,
      }}
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
