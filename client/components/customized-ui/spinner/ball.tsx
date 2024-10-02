import React, { useEffect, useState } from "react"

interface LoadingBalloonSpinnerProps {
  isRandom?: boolean
  numberOfBalls?: number
  maxRandomBalls?: number
  color?: string
}

const LoadingBalloonSpinner: React.FC<LoadingBalloonSpinnerProps> = ({
  isRandom = false,
  numberOfBalls = 5,
  maxRandomBalls = 5,
  color = "bg-indigo-400",
}) => {
  const [ballCount, setBallCount] = useState(numberOfBalls)

  useEffect(() => {
    if (isRandom) {
      const randomCount = Math.floor(Math.random() * maxRandomBalls) + 1
      setBallCount(randomCount)
    } else {
      setBallCount(numberOfBalls)
    }
  }, [isRandom, numberOfBalls, maxRandomBalls])

  return (
    <div className="flex items-center justify-center space-x-2">
      {[...Array(ballCount)].map((_, index) => (
        <div
          key={index}
          className={`h-4 w-4 animate-bounce rounded-full ${color}`}
          style={{
            animationDelay: `${index * 0.15}s`,
          }}
          data-testid="spinner-ball"
        ></div>
      ))}
    </div>
  )
}

export default LoadingBalloonSpinner
