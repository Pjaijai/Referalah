import React from "react"
import { useI18n } from "@/utils/services/internationalization/client"
import { useQueryClient } from "@tanstack/react-query"

import { EQueryKeyString } from "@/types/common/query-key-string"
import useUpdateConversation from "@/hooks/api/message/update-conversation"
import useUserStore from "@/hooks/state/user/store"
import { Button } from "@/components/ui/button"

interface IAcceptConversationFormProps {
  conversationUuid: string
}

const AcceptConversationForm: React.FunctionComponent<
  IAcceptConversationFormProps
> = ({ conversationUuid }) => {
  const t = useI18n()
  const { mutate: update } = useUpdateConversation()
  const queryClient = useQueryClient()
  const userUuid = useUserStore((state) => state.uuid)
  const handleClick = () => {
    if (conversationUuid) {
      update(
        {
          isReceiverAccepted: true,
          conversationUuid,
        },

        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: [EQueryKeyString.CONVERSATION_LIST, { userUuid }],
            })
          },
        }
      )
    }
  }
  return (
    <div className=" flex w-full flex-col items-center justify-between rounded-lg bg-orange-200 p-4 text-orange-700 dark:bg-blue-500 dark:text-white">
      <p className="w-full">
        {t("chat.accept_conversation_user_verification_statement")}
      </p>
      <div className="flex w-full justify-end ">
        <Button
          size={"sm"}
          onClick={handleClick}
          className="white bg-white text-orange-700 hover:bg-orange-100 dark:text-blue-500 dark:hover:bg-blue-100"
        >
          {t("general.confirm")}
        </Button>
      </div>
    </div>
  )
}

export default AcceptConversationForm
