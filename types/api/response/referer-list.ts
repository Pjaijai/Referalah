export interface IRefererResponse
  extends Omit<
    IUserResponse,
    | "id"
    | "resume_url"
    | "email"
    | "status"
    | "role"
    | "is_referer"
    | "is_referee"
  > {}
