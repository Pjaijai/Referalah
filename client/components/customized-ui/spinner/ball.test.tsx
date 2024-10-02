import React from "react"
import { render, screen } from "@testing-library/react"

import "@testing-library/jest-dom"
import LoadingBalloonSpinner from "@/components/customized-ui/spinner/ball"

describe("LoadingBalloonSpinner", () => {
  it("renders with default props", () => {
    render(<LoadingBalloonSpinner />)
    const balls = screen.getAllByTestId("spinner-ball")
    expect(balls).toHaveLength(5)
    expect(balls[0]).toHaveClass("bg-indigo-400")
  })

  it("renders with custom number of balls", () => {
    render(<LoadingBalloonSpinner numberOfBalls={7} />)
    const balls = screen.getAllByTestId("spinner-ball")
    expect(balls).toHaveLength(7)
  })

  it("renders with custom color", () => {
    render(<LoadingBalloonSpinner color="bg-red-500" />)
    const balls = screen.getAllByTestId("spinner-ball")
    expect(balls[0]).toHaveClass("bg-red-500")
  })

  it("renders random number of balls within maxRandomBalls", () => {
    jest.spyOn(global.Math, "random").mockReturnValue(0.5)
    render(<LoadingBalloonSpinner isRandom={true} maxRandomBalls={8} />)
    const balls = screen.getAllByTestId("spinner-ball")
    expect(balls.length).toBeGreaterThanOrEqual(1)
    expect(balls.length).toBeLessThanOrEqual(8)
    jest.spyOn(global.Math, "random").mockRestore()
  })

  it("applies animation delay to each ball", () => {
    render(<LoadingBalloonSpinner numberOfBalls={3} />)
    const balls = screen.getAllByTestId("spinner-ball")
    expect(balls[0]).toHaveStyle("animation-delay: 0s")
    expect(balls[1]).toHaveStyle("animation-delay: 0.15s")
    expect(balls[2]).toHaveStyle("animation-delay: 0.3s")
  })
})
