import React from "react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface IBaseAlertProps {
  title: string
  description: string | React.ReactNode
  icon?: React.ReactNode
  className?: string
}
const BaseAlert: React.FunctionComponent<IBaseAlertProps> = ({
  title,
  description,
  icon,
  className,
}) => {
  return (
    <Alert className={className}>
      {icon}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  )
}

export default BaseAlert
