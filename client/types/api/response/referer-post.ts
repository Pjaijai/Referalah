import { IPost } from "@/types/common/post"

export interface ISearchPostResponse
  extends Omit<IPost, "status" | "industry_uuid" | "location_uuid"> {
  user: {
    username: string | null
    avatar_url: string | null
  } | null

  location: {
    uuid: string
    cantonese_name: string
    english_name: string
  } | null

  industry: {
    uuid: string
    cantonese_name: string
    english_name: string
  } | null
}

export interface IGetPostResponse
  extends Omit<IPost, "id" | "industry_uuid" | "location_uuid"> {
  location: {
    uuid: string | null
    cantonese_name: string
    english_name: string
  } | null

  industry: {
    uuid: string | null
    cantonese_name: string
    english_name: string
  } | null

  user: {
    uuid: string | null
    username: string | null
    avatar_url: string | null
  } | null
}

export interface IListPostResponse extends IPost {
  location: {
    uuid: string
    cantonese_name: string
    english_name: string
  } | null

  industry: {
    uuid: string
    cantonese_name: string
    english_name: string
  } | null
  user: {
    username: string
    avatar_url: string | null
  }
}
