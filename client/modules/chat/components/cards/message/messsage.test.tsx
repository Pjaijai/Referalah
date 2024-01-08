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

    test("renders correct formatted date", async () => {
      const text = "Hello, this is a test message."
      const sentByUser = true
      const createdAt = "2023-01-01T12:34:56.789Z" // Replace with an actual date string
      render(
        <MessageCard
          text={text}
          sentByUser={sentByUser}
          createdAt={createdAt}
        />
      )

      const formattedDate = screen.getByText("2023年01月01日") // Adjust based on your formatting
      expect(formattedDate).toBeInTheDocument()
    })
  })

  describe("When it is not sent by user", () => {
    test("applies correct background color for user-sent message", async () => {
      const text = "Hello, this is a test message."
      const sentByUser = true
      const createdAt = "2023-01-01T12:34:56.789Z" // Replace with an actual date string
      render(
        <MessageCard
          text={text}
          sentByUser={sentByUser}
          createdAt={createdAt}
        />
      )

      const messageCard = screen.getByTestId("message-card")
      expect(messageCard).toHaveClass("bg-green-200")
    })
  })
})
