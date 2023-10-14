import React from "react"
import AuthForm from "@/modules/auth/form"
import { render, screen } from "@testing-library/react"

describe("Auth form", () => {
  const mockOnSubmit = jest.fn()
  render(<AuthForm onSubmit={mockOnSubmit} />)

  describe("Render", () => {
    test("Title 你會收到條登入Link，唔洗密碼👍🏻", () => {
      screen.getByText("你會收到條登入Link，唔洗密碼👍🏻")
    })
  })
})
