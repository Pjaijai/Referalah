export type TContactRequestListResponse = IPostContact | IMemberContact

export interface IPostContact {
  type: "post"
  createdAt: string
  postUuid: string
  senderUserName: string
  postJobTitle: string
}

export interface IMemberContact {
  type: "member"
  createdAt: string
  receiverUserName: string
  receiverUuid: string
  senderUserName: string
}
