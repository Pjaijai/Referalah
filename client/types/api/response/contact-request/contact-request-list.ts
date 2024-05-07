export type TContactRequestListResponse = IPostContact | IMemberContact

interface IPostContact {
  type: "post"
  createdAt: string
  postUuid: string
  senderUserName: string
  postJobTitle: string
}

interface IMemberContact {
  type: "member"
  createdAt: string
  receiverUserName: string
  receiverUuid: string
  senderUserName: string
}
