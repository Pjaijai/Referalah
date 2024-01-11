export interface IBulkUpdateNotificationsRequest {
  updateList: {
    uuid: string
    is_seen: boolean
  }[]
}
