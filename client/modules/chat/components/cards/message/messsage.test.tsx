import React from "react"
import MessageCard from "@/modules/chat/components/cards/message/message"
import { render, screen } from "@testing-library/react"

/**
 * Chat MessageCard test
 *
 * @group unit
 */
describe("MessageCard", () => {
  describe("When it is sent by user", () => {
    const text = "Hello, this is a test message."
    const sentByUser = true

    test("renders correct text", async () => {
      render(<MessageCard text={text} sentByUser={sentByUser} />)
      expect(screen.getByTestId("message-card")).toBeInTheDocument()

      const messageText = screen.getByText(text)

      expect(messageText).toBeInTheDocument()
    })

    test("should be justify-end ", async () => {
      render(<MessageCard text={text} sentByUser={sentByUser} />)
      const messageCard = screen.getByTestId("message-card")
      expect(screen.getByTestId("message-card")).toBeInTheDocument()

      expect(messageCard).toHaveClass("justify-end")
    })
  })

  describe("When it is not sent by user", () => {
    test("should NOT be justify-end ", async () => {
      const text = "Hello, this is a test message."
      const sentByUser = false
      render(<MessageCard text={text} sentByUser={sentByUser} />)

      const messageCard = screen.getByTestId("message-card")

      expect(messageCard).not.toHaveClass("justify-end")
    })
  })
})
