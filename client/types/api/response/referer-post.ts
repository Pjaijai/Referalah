import { IPost } from "@/types/common/post"

export interface ISearchPostResponse
  extends Omit<
    IPost,
    "city_uuid" | "province_uuid" | "country_uuid" | "status" | "industry_uuid"
  > {
  user: {
    username: string | null
    avatar_url: string | null
  } | null

  country: {
    cantonese_name: string
    english_name: string
  } | null
  province: {
    cantonese_name: string
    english_name: string
  } | null
  city: {
    cantonese_name: string
    english_name: string
  } | null

  industry: {
    cantonese_name: string
    english_name: string
  } | null
}

export interface IGetPostResponse
  extends Omit<
    IPost,
    "id" | "city_uuid" | "province_uuid" | "country_uuid" | "industry_uuid"
  > {
  country: {
    uuid: string | null
    cantonese_name: string
    english_name: string
  } | null
  province: {
    uuid: string | null
    cantonese_name: string
    english_name: string
  } | null
  city: {
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
  country: {
    cantonese_name: string
    english_name: string
  } | null
  province: {
    cantonese_name: string
    english_name: string
  } | null
  city: {
    cantonese_name: string
    english_name: string
  } | null

  industry: {
    cantonese_name: string
    english_name: string
  } | null
  user: {
    username: string | null
    avatar_url: string | null
  } | null
}
