import { supabase } from "@/utils/services/supabase/config"

import { IResetPasswordRequest } from "@/types/api/request/auth/reset-password"
import { ISignInEmailPasswordRequest } from "@/types/api/request/auth/sign-in-with-email-password"
import { ISignInWithOneTimePassWordRequest } from "@/types/api/request/auth/sign-in-with-one-time-password"
import { ISignUpEmailPasswordRequest } from "@/types/api/request/auth/sign-up-with-email-password"
import { IUpdatePasswordRequest } from "@/types/api/request/auth/update-password"
import { IVerifyEmailOneTimePasswordRequest } from "@/types/api/request/auth/verify-email-one-time-password"
import { IMessagePostCreatorRequest } from "@/types/api/request/message/post-creator"
import { IMessageReferralRequest } from "@/types/api/request/message/referral"
import { ICreatePostRequest } from "@/types/api/request/post/create"
import { IFilterMeta } from "@/types/api/request/post/filter-meta"
import { ISearchPostsRequest } from "@/types/api/request/post/search"
import { IUpdatePostRequest } from "@/types/api/request/post/update"
import { IUpdateUserProfileRequest } from "@/types/api/request/user/update"
import { ICityResponse } from "@/types/api/response/city"
import { IGetConversationListByUserUuidResponse } from "@/types/api/response/conversation-list"
import { ICountryResponse } from "@/types/api/response/country"
import { IIndustryResponse } from "@/types/api/response/industry"
import { IMessageReferralResponse } from "@/types/api/response/message/referral"
import { IProvinceResponse } from "@/types/api/response/province"
import {
  IGetPostResponse,
  IListPostResponse,
  ISearchPostResponse,
} from "@/types/api/response/referer-post"
import { IReferralResponse } from "@/types/api/response/referral"
import { IUserResponse } from "@/types/api/response/user"
import { EQueryKeyString } from "@/types/common/query-key-string"
import { EReferralType } from "@/types/common/referral-type"
import { siteConfig } from "@/config/site"

// User Profile
export const getUserProfile = async (userUuid: string) => {
  try {
    const { data, error } = await supabase
      .from("user")
      .select<string, IUserResponse>(
        `
            uuid,
            username,
            avatar_url,
            description,
            company_name,
            job_title,
            year_of_experience,
          social_media_url,
        country(
          uuid,
          cantonese_name,
          english_name
      ),
      province(
        uuid,
          cantonese_name,
          english_name
      ),
      city(
        uuid,
          cantonese_name,
          english_name
      ),
      industry(
        uuid,
          cantonese_name,
          english_name
      ),
      is_referer,
      is_referee
      `
      )
      .eq("uuid", userUuid)
      .single()

    if (error) throw error
    if (data === null) throw new Error(`Cannot found user ${userUuid}`)

    return data
  } catch (error) {
    throw error
  }
}

// Auth
export const signUpWithEmailPassword = async (
  req: ISignUpEmailPasswordRequest
) => {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_WEB_URL}${siteConfig.page.signUpConfirmation.href}`
  )
  const { email, password } = req
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: url.href,
        data: {
          username: req.username,
        },
      },
    })

    if (error) {
      throw error
    }
    return data
  } catch (error) {
    throw error
  }
}

export const signInWithEmailPassword = async (
  req: ISignInEmailPasswordRequest
) => {
  const { email, password } = req
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw error
    }
    return data
  } catch (error) {
    throw error
  }
}
export const signInWithOneTimePassword = async (
  req: ISignInWithOneTimePassWordRequest
) => {
  const { email } = req
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_WEB_URL}`,
        shouldCreateUser: false,
      },
    })

    if (error) {
      throw error
    }
    return data
  } catch (error) {
    throw error
  }
}

export const verifyEmailOneTimePassword = async (
  req: IVerifyEmailOneTimePasswordRequest
) => {
  const { email, token } = req
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    })

    if (error) {
      throw error
    }
    return data
  } catch (error) {
    throw error
  }
}

export const resetPassword = async (req: IResetPasswordRequest) => {
  try {
    const url = new URL(
      `${process.env.NEXT_PUBLIC_WEB_URL}${siteConfig.page.resetPassword.href}`
    )
    url.searchParams.set("email", req.email)

    await supabase.auth.resetPasswordForEmail(req.email, {
      redirectTo: url.href,
    })
  } catch (error) {
    throw error
  }
}

export const updatePassword = async (req: IUpdatePasswordRequest) => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: req.password,
    })

    if (error) throw error
    return data
  } catch (error) {
    throw error
  }
}

// Profile

export const updateUserProfile = async (req: IUpdateUserProfileRequest) => {
  const { data, error } = await supabase
    .from("user")
    .update({
      avatar_url: req.avatarUrl,
      username: req.username,
      description: req.description,
      company_name: req.companyName,
      job_title: req.jobTitle,
      year_of_experience: req.yearOfExperience,
      country_uuid: req.countryUuid,
      province_uuid: req.provinceUuid,
      city_uuid: req.cityUuid,
      industry_uuid: req.industryUuid,
      social_media_url: req.socialMediaUrl,
      is_referer: req.isReferer,
      is_referee: req.isReferee,
    })
    .eq("uuid", req.userUuid)

  if (error) {
    throw error
  }

  return data
}
export const searchReferral = async ({
  pageParam = 0,
  queryKey,
}: {
  pageParam?: number
  queryKey: [
    EQueryKeyString,
    {
      sorting: string
      filterMeta: IFilterMeta
      type: EReferralType
    },
  ]
}) => {
  const NUMBER_OF_DATE_PER_FETCH = 5
  const countryUuid = queryKey[1].filterMeta.countryUuid
  const provinceUuid = queryKey[1].filterMeta.provinceUuid
  const cityUuid = queryKey[1].filterMeta.cityUuid
  const industryUuid = queryKey[1].filterMeta.industryUuid
  const companyName = queryKey[1].filterMeta.companyName
  const jobTitle = queryKey[1].filterMeta.jobTitle
  const maxYearOfExperience = queryKey[1].filterMeta.maxYearOfExperience
  const minYearOfExperience = queryKey[1].filterMeta.minYearOfExperience
  const type = queryKey[1].type

  const sort = queryKey[1].sorting.split(",")
  const order = sort[1] !== "dec"

  const from = pageParam + pageParam * NUMBER_OF_DATE_PER_FETCH
  const to = from + NUMBER_OF_DATE_PER_FETCH

  let query = supabase
    .from("user")
    .select<string, IReferralResponse>(
      `
            uuid,
            username,
            avatar_url,
            description,
            company_name,
            job_title,
            year_of_experience,
            social_media_url,
            country(
              uuid,
              cantonese_name,
              english_name
            ),
            province(
              uuid,
              cantonese_name,
              english_name
            ),
            city(
              uuid,
              cantonese_name,
              english_name
            ),
            industry(
              uuid,
              cantonese_name,
              english_name
            ),
            is_referer,
            is_referee
          `
    )
    .lte(
      "year_of_experience",
      maxYearOfExperience ? parseInt(maxYearOfExperience) : 100
    )
    .gte(
      "year_of_experience",
      minYearOfExperience ? parseInt(minYearOfExperience) : 0
    )
    .order("year_of_experience", { ascending: order })
    .order("id", { ascending: true })
    .range(from, to)

  if (type === EReferralType.REFERRER) {
    query = query.eq("is_referer", true)
  }

  if (type === EReferralType.REFEREE) {
    query = query.eq("is_referee", true)
  }

  if (countryUuid) {
    query = query.eq("country_uuid", countryUuid)
  }
  if (provinceUuid) {
    query = query.eq("province_uuid", provinceUuid)
  }
  if (cityUuid) {
    query = query.eq("city_uuid", cityUuid)
  }
  if (industryUuid) {
    query = query.eq("industry_uuid", industryUuid)
  }

  if (companyName.length > 0) {
    query = query.ilike("company_name", `%${companyName}%`)
  }

  if (jobTitle.length > 0) {
    query = query.ilike("job_title", `%${jobTitle}%`)
  }

  const { data, error } = await query

  if (error) throw error
  if (data === null) return []

  return data
}

// Post
export const createPost = async (req: ICreatePostRequest) => {
  try {
    const { data, error } = await supabase
      .from("post")
      .insert({
        url: req.url,
        country_uuid: req.countryUuid,
        province_uuid: req.provinceUuid,
        city_uuid: req.cityUuid,
        industry_uuid: req.industryUuid,
        year_of_experience: req.yearOfExperience,
        created_by: req.createdBy,
        type: req.type,
        company_name: req.companyName.trim(),
        job_title: req.jobTitle.trim(),
        description: req.description.trim(),
      })
      .select("uuid")
      .single()

    if (error) throw error
    return data
  } catch (error) {
    throw error
  }
}
export const updatePost = async (req: IUpdatePostRequest) => {
  try {
    const { data, error } = await supabase
      .from("post")
      .update({
        status: req.status,
        url: req.url,
        country_uuid: req.countryUuid,
        province_uuid: req.provinceUuid,
        city_uuid: req.cityUuid,
        industry_uuid: req.industryUuid,
        year_of_experience: req.yearOfExperience,
        created_by: req.createdBy,
        type: req.type,
        company_name: req.companyName.trim(),
        job_title: req.jobTitle.trim(),
        description: req.description.trim(),
      })
      .eq("uuid", req.uuid)

    if (error) throw error
    return data
  } catch (error) {
    throw error
  }
}
export const searchPostApi = async ({
  cityUuid,
  companyName,
  industryUuid,
  jobTitle,
  numberOfDataPerPage,
  countryUuid,
  page,
  provinceUuid,
  sortingType,
  type,
  maxYearOfExperience,
  minYearOfExperience,
}: ISearchPostsRequest) => {
  try {
    const sort = sortingType.split(",")
    const sortedBy = sort[0]
    const order = sort[1] !== "dec"
    const from = page + page * numberOfDataPerPage
    const to = from + numberOfDataPerPage

    let query = supabase
      .from("post")
      .select<string, ISearchPostResponse>(
        `   uuid,
              created_at,
              created_by,
              url,
              description,
              company_name,
              job_title,
              year_of_experience,
              country(
                  cantonese_name,
                  english_name
              ),
              province(
                  cantonese_name,
                  english_name
              ),
              city(
                  cantonese_name,
                  english_name
              ),
              industry(
                  cantonese_name,
                  english_name
              ),
              user (
                  username,
                  avatar_url
              )
            `
      )
      .eq("type", type)
      .eq("status", "active")
      .lte("year_of_experience", 100)
      .gte("year_of_experience", 0)
      .lte("year_of_experience", maxYearOfExperience)
      .gte("year_of_experience", minYearOfExperience)
      .range(from, to)

    if (sortedBy === "createdAt") {
      query = query.order("created_at", { ascending: order })
    }

    if (sortedBy === "year_of_experience") {
      query = query.order("year_of_experience", { ascending: order })
    }
    if (countryUuid !== undefined) {
      query = query.eq("country_uuid", countryUuid)
    }
    if (provinceUuid !== undefined) {
      query = query.eq("province_uuid", provinceUuid)
    }
    if (cityUuid !== undefined) {
      query = query.eq("city_uuid", cityUuid)
    }
    if (industryUuid !== undefined) {
      query = query.eq("industry_uuid", industryUuid)
    }

    if (companyName.length > 0) {
      query = query.ilike("company_name", `%${companyName}%`)
    }

    if (jobTitle.length > 0) {
      query = query.ilike("job_title", `%${jobTitle}%`)
    }
    const { data, error } = await query.order("id", { ascending: true })

    if (error) throw error
    if (data === null) return []

    return data
  } catch (error) {
    throw error
  }
}
export const getPostByUuid = async (uuid: string) => {
  const { data, error } = await supabase
    .from("post")
    .select<string, IGetPostResponse>(
      `   uuid,
              status,
              created_at,
              created_by,
              url,
              description,
              company_name,
              job_title,
              year_of_experience,
              country(
                  uuid,
                  cantonese_name,
                  english_name
              ),
              province(
                  uuid,
                  cantonese_name,
                  english_name
              ),
              city(
                 uuid,
                  cantonese_name,
                  english_name
              ),
              industry(
                  uuid,
                  cantonese_name,
                  english_name
              ),
              user (
                  uuid,
                  username,
                  avatar_url,
                  job_title
              )
            `
    )
    .eq("uuid", uuid)
    .single()

  if (error) throw error
  if (data === null) throw new Error(`Post not found for uuid ${uuid}`)

  return data
}

export const getPostListByUserUuid = async (userUuid: string) => {
  try {
    const { data, error } = await supabase
      .from("post")
      .select<string, IListPostResponse>(
        `
        *,
        country(
          cantonese_name,
          english_name
        ),
        province(
          cantonese_name,
          english_name
        ),
        city(
          cantonese_name,
          english_name
        ),
        industry(
          cantonese_name,
          english_name
        ),
        user(
          username,
          avatar_url
        )
        `
      )
      .eq("created_by", userUuid)

    if (error) throw error

    return data
  } catch (error) {
    throw error
  }
}

// Industry
export const getIndustryList = async () => {
  try {
    const { data: industryData, error: industryError } = await supabase
      .from("industry")
      .select<"*", IIndustryResponse>("*")

    if (industryError) {
      throw industryError
    }
    if (industryData === null) return []

    return industryData
  } catch (error) {
    throw error
  }
}

// Country
export const getCountryList = async () => {
  try {
    const { data: countryData, error: countryError } = await supabase
      .from("country")
      .select<"*", ICountryResponse>("*")

    if (countryError) {
      throw countryError
    }

    return countryData
  } catch (error) {
    throw error
  }
}

// Province
export const getProvinceList = async () => {
  try {
    const { data: provinceData, error: provinceError } = await supabase
      .from("province")
      .select<"*", IProvinceResponse>("*")

    if (provinceError) {
      throw provinceError
    }

    return provinceData
  } catch (error) {
    throw error
  }
}

// City
export const getCityList = async () => {
  const { data, error } = await supabase
    .from("city")
    .select<"*", ICityResponse>("*")

  if (error) {
    throw error
  }

  return data
}
// Message
export const messageReferral = async (req: IMessageReferralRequest) => {
  try {
    const { data, error } = await supabase.functions.invoke(
      "message-referral",
      {
        body: {
          type: req.type,
          body: req.body,
          to_uuid: req.toUuid,
        },
      }
    )

    if (error) {
      throw error
    }

    return data.data as IMessageReferralResponse
  } catch (error) {
    throw error
  }
}

export const messagePostCreator = async (req: IMessagePostCreatorRequest) => {
  try {
    const { data, error } = await supabase.functions.invoke(
      "message-post-creator",
      {
        body: {
          post_uuid: req.postUuid,
          body: req.body,
        },
      }
    )

    if (error) {
      throw error
    }
    return data.data as IMessageReferralResponse
  } catch (error) {
    throw error
  }
}

export const getConversationListByUserUuid = async ({
  userUuid,
  page,
  numberOfDataPerPage,
}: {
  userUuid: string
  page: number
  numberOfDataPerPage: number
}) => {
  const from = page + page * numberOfDataPerPage
  const to = from + numberOfDataPerPage

  try {
    const { data, error } = await supabase
      .from("conversation")
      .select(
        `
      sender_uuid(username,company_name, job_title, avatar_url, uuid),
      receiver_uuid(username,avatar_url,company_name, job_title, uuid),
      uuid,
      is_receiver_accepted,
      is_receiver_seen,
      is_sender_seen,
      last_message_uuid(
        created_at, 
        uuid,
        sender_uuid,
        body,
        document
      )
      `
      )
      .or(`sender_uuid.eq.${userUuid},receiver_uuid.eq.${userUuid}`)
      .range(from, to)
      .returns<IGetConversationListByUserUuidResponse>()
      .order("last_updated_at", { ascending: false })

    if (error) {
      throw error
    }
    return data
  } catch (error) {
    throw error
  }
}

export const getMessageListByConversationUuid = async ({
  conversationUuid,
  page,
  numberOfDataPerPage,
}: {
  conversationUuid: string
  page: number
  numberOfDataPerPage: number
}) => {
  const from = page + page * numberOfDataPerPage
  const to = from + numberOfDataPerPage

  try {
    const { data, error } = await supabase
      .from("message")
      .select("*")
      .eq("conversation_uuid", conversationUuid)
      .range(from, to)
      .order("created_at", { ascending: false })

    if (error) {
      throw error
    }
    return data
  } catch (error) {
    throw error
  }
}

export const createMessage = async ({
  msgBody,
  conversationUuid,
  fileName,
  filePath,
  fileSize,
}: {
  msgBody?: string
  conversationUuid: string
  fileName?: string
  filePath?: string
  fileSize?: number
}) => {
  try {
    let document = null
    if (fileName && filePath && fileSize) {
      document = {
        name: fileName,
        path: filePath,
        size: fileSize,
      }
    }
    const { data, error } = await supabase
      .from("message")
      .insert({
        body: msgBody,
        conversation_uuid: conversationUuid,
        document: document,
      })
      .select("created_at, uuid")
      .single()

    if (error) throw error

    const { error: UpdateError } = await supabase
      .from("conversation")
      .update({
        last_updated_at: data?.created_at,
        last_message_uuid: data.uuid,
      })
      .eq("uuid", conversationUuid)

    if (UpdateError) throw UpdateError

    return data
  } catch (error) {
    throw error
  }
}

export const updateConversation = async ({
  isSenderSeen,
  isReceiverAccepted,
  isReceiverSeen,
  conversationUuid,
}: {
  isSenderSeen?: boolean
  isReceiverAccepted?: boolean
  isReceiverSeen?: boolean
  conversationUuid: string
}) => {
  try {
    const { data, error } = await supabase
      .from("conversation")
      .update({
        is_sender_seen: isSenderSeen,
        is_receiver_seen: isReceiverSeen,
        is_receiver_accepted: isReceiverAccepted,
      })
      .eq("uuid", conversationUuid)

    if (error) throw error
    return data
  } catch (error) {
    throw error
  }
}

export const checkHasConversationUnseen = async () => {
  try {
    const { data, error } = await supabase.rpc("check_has_conversation_unseen")

    if (error) {
      throw error
    }

    return data[0].has_unseen
  } catch (error) {
    throw error
  }
}
// Statistic
export const getUserCount = async () => {
  try {
    const { count, error } = await supabase
      .from("user")
      .select("id", { count: "exact" })

    if (error) throw error
    return count
  } catch (error) {
    throw error
  }
}

// Storage
export const uploadMedia = async ({
  bucketName,
  file,
  path,
  contentType,
}: {
  bucketName: string
  file: File
  path: string
  contentType?: string
}) => {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(path, file, {
      contentType: contentType,
    })

  if (error) {
    throw error
  }
  return data
}

export const getMediaPublicUrl = async ({
  bucketName,
  path,
}: {
  bucketName: string
  path: string
}) => {
  const { data } = supabase.storage.from(bucketName).getPublicUrl(path)

  return data
}

export const downloadMedia = async ({
  bucketName,
  path,
}: {
  bucketName: string
  path: string
}) => {
  const { data, error } = await supabase.storage.from(bucketName).download(path)

  if (error) throw error

  return data
}
