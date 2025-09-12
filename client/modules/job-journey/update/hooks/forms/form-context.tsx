import React, { ReactNode, createContext, useContext, useState } from "react"

interface UpdateJobJourneyFormContextType {
  currentStep: number
  nextStep: () => void
  prevStep: () => void
  totalSteps: number
  isLastStep: boolean
  goToStep: (step: number) => void
}

const UpdateJobJourneyFormContext = createContext<
  UpdateJobJourneyFormContextType | undefined
>(undefined)

export const UpdateJobJourneyFormProvider = ({
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

  const goToStep = (step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step)
    }
  }

  // Compute isLastStep based on currentStep and totalSteps
  const isLastStep = currentStep === totalSteps

  return (
    <UpdateJobJourneyFormContext.Provider
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
    </UpdateJobJourneyFormContext.Provider>
  )
}

export const useUpdateJobJourneyFormContext = () => {
  const context = useContext(UpdateJobJourneyFormContext)
  if (!context) {
    throw new Error(
      "useUpdateJobJourneyForm must be used within a UpdateJobJourneyFormProvider"
    )
  }
  return context
}
