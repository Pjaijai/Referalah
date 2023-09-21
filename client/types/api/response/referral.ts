import { IUserResponse } from "@/types/api/response/user"

export interface IReferralResponse
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
