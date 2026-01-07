export type TContactRequestListResponse = IPostContact

export interface IPostContact {
  type: "post"
  createdAt: string
  postUuid: string
  senderUserName: string
  postJobTitle: string
}
