import React from "react"
import ConversationHeader from "@/modules/chat/components/header/conversation/conversation"
import { render, screen, waitFor } from "@testing-library/react"

/**
 * Chat ConversationHeader test
 *
 * @group unit
 */
describe("ConversationHeader", () => {
  describe("When it is sent by user", () => {
    const companyName = "mock companyName"
    const jobTitle = "mock jobTitle"
    const username = "mock username"
    render(
      <ConversationHeader
        companyName={companyName}
        jobTitle={jobTitle}
        username={username}
      />
    )
    test("renders correct text", async () => {
      const companyNameText = screen.getByText(`@${companyName}`)

      const jobTitleText = screen.getByText(jobTitle)

      const usernameText = screen.getByText(username)

      expect(companyNameText).toBeInTheDocument()
      expect(jobTitleText).toBeInTheDocument()
      expect(usernameText).toBeInTheDocument()
    })
  })
})
