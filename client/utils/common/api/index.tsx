import { fireStore } from "@/utils/services/firebase/config"
import { supabase } from "@/utils/services/supabase/config"
import { doc, getDoc, increment, setDoc, updateDoc } from "firebase/firestore"

import { TCompany, TCompanyData } from "@/types/api/company"
import { TCreateFireRequest, TFireData } from "@/types/api/fire"
import {
  TCreateJobJourneyRequest,
  TJobJourney,
  TJobJourneyWithSteps,
} from "@/types/api/job-journey"
import { IResetPasswordRequest } from "@/types/api/request/auth/reset-password"
import { ISignInEmailPasswordRequest } from "@/types/api/request/auth/sign-in-with-email-password"
import { ISignInWithOneTimePassWordRequest } from "@/types/api/request/auth/sign-in-with-one-time-password"
import { ISignUpEmailPasswordRequest } from "@/types/api/request/auth/sign-up-with-email-password"
import { IUpdatePasswordRequest } from "@/types/api/request/auth/update-password"
import { IVerifyEmailOneTimePasswordRequest } from "@/types/api/request/auth/verify-email-one-time-password"
import { IMessagePostCreatorRequest } from "@/types/api/request/message/post-creator"
import { IMessageReferralRequest } from "@/types/api/request/message/referral"
import { BulkUpdateSeenRequest } from "@/types/api/request/notification/bulk-update-seen"
import { ICreatePostRequest } from "@/types/api/request/post/create"
import { ISearchPostRequest } from "@/types/api/request/post/search"
import { IUpdatePostRequest } from "@/types/api/request/post/update"
import { ISearchMemberRequest } from "@/types/api/request/user/search"
import { IUpdateUserProfileRequest } from "@/types/api/request/user/update"
import { ICityResponse } from "@/types/api/response/city"
import { TContactRequestListResponse } from "@/types/api/response/contact-request/contact-request-list"
import { IGetConversationListByUserUuidResponse } from "@/types/api/response/conversation-list"
import { ICountryResponse } from "@/types/api/response/country"
import { IIndustryResponse } from "@/types/api/response/industry"
import { TLocationData } from "@/types/api/response/location"
import { IMessageReferralResponse } from "@/types/api/response/message/referral"
import { ISearchNotificationResponse } from "@/types/api/response/notificaiton/search-notifications"
import { IProvinceResponse } from "@/types/api/response/province"
import {
  IGetPostResponse,
  IListPostResponse,
  ISearchPostResponse,
} from "@/types/api/response/referer-post"
import { IReferralResponse } from "@/types/api/response/referral"
import { IUserResponse } from "@/types/api/response/user"
import { EJobLevel } from "@/types/common/enums/job-level"
import { EJobType } from "@/types/common/enums/job-type"
import { EPostType } from "@/types/common/post-type"
import { EUserType } from "@/types/common/user-type"
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
          is_referee,
          contact_request_count,
          links,
          post_count:post(count),
          notification_permissions
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
      links: req.links,
      is_referer: req.isReferer,
      is_referee: req.isReferee,
      notification_permissions: req.notificationPermissions,
    })
    .eq("uuid", req.userUuid)

  if (error) {
    throw error
  }

  return data
}
export const searchUser = async ({
  numberOfDataPerPage,
  page,
  industries,
  experience,
  sortingType,
  type,
  locations,
  keywords,
}: ISearchMemberRequest) => {
  const sort = sortingType.split(",")
  const sortedBy = sort[0]
  const order = sort[1] !== "dec"
  const from = page * numberOfDataPerPage
  const to = from + numberOfDataPerPage - 1

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
            is_referee,
            contact_request_count,
            links
          `
    )
    .gte("year_of_experience", experience)

  if (keywords && keywords.trim() !== "") {
    const searchTerms = keywords.trim().split(/\s+/)
    searchTerms.forEach((term) => {
      query = query.or(
        `username.ilike.%${term}%,company_name.ilike.%${term}%,job_title.ilike.%${term}%,description.ilike.%${term}%`
      )
    })
  }

  if (type !== EUserType.ALL) {
    if (type === EUserType.REFERRER) {
      query = query.eq("is_referer", true)
    } else if (type === EUserType.REFEREE) {
      query = query.eq("is_referee", true)
    }
  } else {
    query = query.or("is_referer.eq.true,is_referee.eq.true")
  }
  if (industries !== undefined) {
    query = query.in("industry_uuid", industries)
  }

  if (locations !== undefined) {
    query = query.in("city_uuid", locations)
  }

  if (sortedBy === "yearOfExperience") {
    query = query.order("year_of_experience", { ascending: order })
  } else {
    query = query.order("id", { ascending: true })
  }

  query = query.range(from, to)

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

export const searchPost = async ({
  numberOfDataPerPage,
  page,
  industries,
  experience,
  sortingType,
  type,
  locations,
  keywords,
}: ISearchPostRequest) => {
  try {
    const sort = sortingType.split(",")
    const sortedBy = sort[0]
    const order = sort[1] !== "dec"
    const from = page * numberOfDataPerPage
    const to = from + numberOfDataPerPage - 1

    let query = supabase
      .from("post")
      .select<string, ISearchPostResponse>(
        `
          uuid,
          type,
          created_at,
          created_by,
          url,
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
          user!inner (
              username,
              description,
              avatar_url
          ),
          contact_request_count
        `
      )
      .eq("status", "active")
      .gte("year_of_experience", experience)

    if (keywords && keywords.trim() !== "") {
      const searchTerms = keywords.trim().split(/\s+/)
      searchTerms.forEach((term) => {
        query = query.or(
          `company_name.ilike.%${term}%,job_title.ilike.%${term}%,description.ilike.%${term}%`
        )
      })
    }

    if (sortedBy === "createdAt") {
      query = query.order("created_at", { ascending: order })
    }

    if (type !== EPostType.ALL && Object.values(EPostType).includes(type)) {
      query = query.eq("type", type)
    }

    if (industries !== undefined) {
      query = query.in("industry_uuid", industries)
    }

    if (locations !== undefined) {
      query = query.in("city_uuid", locations)
    }

    const { data, error, count } = await query
      .order("id", { ascending: true })
      .range(from, to)

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
      `       uuid,
              type,
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
              ),
              contact_request_count
            `
    )
    .eq("uuid", uuid)
    .single()

  if (error) throw error
  if (data === null) throw new Error(`Post not found for uuid ${uuid}`)

  return data
}

export const ListPostByUserUuid = async (
  userUuid: string,
  sortValue: string
) => {
  const sort = sortValue.split(",")
  const sortedBy = sort[0]
  const order = sort[1] !== "dec"

  try {
    let query = supabase
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

    if (sortedBy === "createdAt") {
      query = query.order("created_at", { ascending: order })
    }

    if (sortedBy === "year_of_experience") {
      query = query.order("year_of_experience", { ascending: order })
    }

    const { data, error } = await query
    if (error) throw error

    return data
  } catch (error) {
    throw error
  }
}

export const incrementPostViewCountByUuid = async (postUuid: string) => {
  const postRef = doc(fireStore, "postViewCount", postUuid)

  try {
    const docSnap = await getDoc(postRef)

    if (!docSnap.exists()) {
      // Document doesn't exist, create it with initial view count of 1
      await setDoc(postRef, { viewCount: 1 })
      return { viewCount: 1 }
    } else {
      // Document exists, increment the view count
      const updateResult = await updateDoc(postRef, {
        viewCount: increment(1),
      })

      return updateResult
    }
  } catch (error) {
    throw error
  }
}

export const getPostViewCountByUuid = async (
  postUuid: string
): Promise<number | undefined> => {
  const postRef = doc(fireStore, "postViewCount", postUuid)

  try {
    const docSnap = await getDoc(postRef)
    if (docSnap.exists()) {
      return docSnap.data().viewCount || 0
    } else {
      return 0
    }
  } catch (error) {
    return undefined
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

// location
export const getLocationList = async () => {
  try {
    const { data, error } = await supabase
      .from("location")
      .select<"*", TLocationData>("*")

    if (error) {
      throw error
    }
    if (data === null) return []

    return data
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
          document: req.document,
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
          document: req.document,
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
        document,
        is_document_expired
      )
      `
      )
      .or(`sender_uuid.eq.${userUuid},receiver_uuid.eq.${userUuid}`)
      .range(from, to)
      .returns<IGetConversationListByUserUuidResponse[]>()
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
  internalFilePath,
}: {
  msgBody?: string
  conversationUuid: string
  fileName?: string
  filePath?: string
  fileSize?: number
  internalFilePath?: string
}) => {
  try {
    let document = null
    if (fileName && filePath && fileSize && internalFilePath) {
      document = {
        name: fileName,
        path: filePath,
        size: fileSize,
        internalPath: internalFilePath,
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

// contact Request history
export const listLatestContactRequest = async () => {
  try {
    const { data, error } = await supabase.functions.invoke(
      "list-latest-contact-request"
    )

    if (error) throw error
    return data as TContactRequestListResponse[]
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

// notification

export const searchNotificationByUserUuid = async ({
  numberOfDataPerPage,
  page,
  userUuid,
}: any) => {
  try {
    const from = page * numberOfDataPerPage
    const to = from + numberOfDataPerPage - 1

    let query = supabase
      .from("notification")
      .select<string, ISearchNotificationResponse>(
        `
         *
        `
      )
      .eq("user_uuid", userUuid)

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(from, to)

    if (error) throw error
    if (data === null) return []

    return data
  } catch (error) {
    throw error
  }
}

export const bulkUpdateNotificationsSeen = async ({
  messageIds,
  userUuid,
}: BulkUpdateSeenRequest) => {
  try {
    const { data, error } = await supabase
      .from("notification")
      .update({ is_seen: true })
      .eq("user_uuid", userUuid)
      .in("id", messageIds)
      .select()
    if (error) throw error
    return data
  } catch (error: any) {
    throw error
  }
}

//  Job Journey
export const createJobJourney = async (
  request: TCreateJobJourneyRequest
): Promise<any> => {
  const mappedData = {
    title: request.title,
    position_title: request.positionTitle,
    company: request.company,
    industry: request.industry,
    location: request.location,
    job_type: request.jobType,
    job_level: request.jobLevel,
    application_date: request.applicationDate,
    source: request.source,
    description: request.description,
    steps: request.steps.map((step) => ({
      type: step.type,
      date: step.date,
      remarks: step.remarks,
      position: step.position,
      interview_type: step.interviewType,
      interview_location: step.interviewLocation,
    })),
    new_company: request.newCompany,
  }

  try {
    const { data, error } = await supabase.functions.invoke(
      "create-job-journey",
      {
        body: {
          ...mappedData,
        },
      }
    )

    if (error) throw error
    if (!data) throw new Error("No data returned after creation")

    return data
  } catch (error) {
    throw error
  }
}

// Get Job Journey by UUID with Joined Steps
export const getJobJourneyByUuidWithSteps = async (
  uuid: string
): Promise<TJobJourneyWithSteps> => {
  try {
    const { data, error } = await supabase
      .from("job_journey")
      .select<string, TJobJourneyWithSteps>(
        `
        id,
        uuid,
        company_id,
        company:company_id (
          id,
          name
        ),
        company_name,
        position_title,
        title,
        description,
        source,
        industry_uuid,
        location_uuid,
        job_type,
        job_level,
        application_submitted_date,
        visibility,
        status,
        created_by,
        created_at,
        updated_at,
        last_step_status,
        last_step_status_updated_at,
        job_journey_step (
          id,
          uuid,
          job_journey_uuid,
          step_date,
          step_type,
          interview_type,
          interview_location,
          remarks,
          position,
          created_at,
          updated_at
        ),
        industry:industry_uuid (
          uuid,
          english_name,
          cantonese_name
        ),
        location:location_uuid (
          uuid,
          english_name,
          cantonese_name
        ),
        user:created_by (
          uuid,
          username
        ),
        fire_count
      `
      )
      .eq("uuid", uuid)
      .single()

    if (error) throw error
    if (!data) throw new Error("Job journey not found")

    return data
  } catch (error) {
    throw error
  }
}

// Search Job Journeys with Filtering, Sorting, and Pagination
export const searchJobJourney = async ({
  keywords,
  numberOfItemsPerPage,
  locations,
  jobLevel,
  companyId,
  page,
  sortingType,
  industry,
}: {
  keywords: string
  numberOfItemsPerPage: number
  locations: string[]
  jobLevel: EJobLevel | "all"
  companyId?: number
  industry: string
  page: number
  sortingType: string
}): Promise<TJobJourney[]> => {
  try {
    const from = page * numberOfItemsPerPage
    const to = from + numberOfItemsPerPage - 1

    let query = supabase.from("job_journey").select<string, TJobJourney>(
      `
        id,
        uuid,
        company_id,
        company:company_id (
          id,
          name
        ),
        company_name,
        position_title,
        title,
        source,
        industry_uuid,
        location_uuid,
        location:location_uuid (
          uuid
        ),
        job_type,
        job_level,
        application_submitted_date,
        visibility,
        status,
        created_by,
        user:created_by (
          uuid,
          username
        ),
        created_at,
        updated_at,
        last_step_status,
        last_step_status_updated_at,
        description,
        fire_count
        `
    )

    // Apply job level filter
    if (jobLevel !== "all") {
      query = query.eq("job_level", jobLevel)
    }

    // Apply job type filter
    if (companyId) {
      query = query.eq("company_id", companyId)
    }

    // Apply industry filter
    if (industry !== "all") {
      query = query.eq("industry_uuid", industry)
    }

    // Apply location filter
    if (locations.length > 0) {
      query = query.in("location_uuid", locations)
    }

    // Apply sorting
    const [sortedBy, order] = sortingType.split(",")

    if (sortedBy === "createdAt") {
      query = query.order("created_at", { ascending: order === "asc" })
    }

    if (sortedBy === "applicationDate") {
      query = query.order("application_submitted_date", {
        ascending: order === "asc",
      })
    }
    if (sortedBy === "lastUpdatedDate") {
      query = query.order("last_step_status_updated_at", {
        ascending: order === "asc",
      })
    }
    // Apply keyword search
    if (keywords && keywords.trim() !== "") {
      const trimmedKeywords = keywords.trim() // Remove leading/trailing spaces
      const searchTerms = trimmedKeywords
        .split(/\s+/)
        .filter((term) => term !== "") // Split by whitespace and remove empty terms
      const keywordFilters: string[] = []

      // Build filters for job_journey fields
      for (const term of searchTerms) {
        const encodedTerm = `%${term}%`
        keywordFilters.push(
          `company_name.ilike.${encodedTerm}`,
          `position_title.ilike.${encodedTerm}`,
          `title.ilike.${encodedTerm}`,
          `description.ilike.${encodedTerm}`
        )
      }

      // Apply or filter for job_journey fields
      if (keywordFilters.length > 0) {
        query = query.or(keywordFilters.join(","))
      }
    }

    // Execute query with pagination
    const { data, error } = await query.range(from, to)

    console.log(999, data, error)
    if (error) {
      throw new Error(`Failed to fetch job journeys: ${error.message}`)
    }

    return data ?? []
  } catch (error) {
    throw error
  }
}
// company

export const searchCompanyByName = async ({
  searchTerm,
}: {
  searchTerm: string | null
}): Promise<TCompany[]> => {
  try {
    // Validate input
    if (!searchTerm || typeof searchTerm !== "string") {
      throw new Error("Invalid search term: Must be a non-empty string")
    }

    // Query the company table with a case-insensitive search
    const { data, error } = await supabase
      .from("company")
      .select<string, TCompanyData>("*")
      .ilike("name", `%${searchTerm}%`) // Case-insensitive search on the name field
      .limit(5)

    if (error) throw error
    if (!data) return []

    return data.map((company) => ({
      id: company.id,
      name: company.name,
      logoUrl: company.logo_url,
      createdAt: company.created_at,
    })) satisfies TCompany[]
  } catch (error) {
    throw error
  }
}

// fire
export const createFire = async ({
  type,
  refUuid,
}: TCreateFireRequest): Promise<TFireData> => {
  try {
    const { data, error } = await supabase
      .from("fire")
      .insert([{ type, ref_uuid: refUuid }])
      .select<string, TFireData>("*")
      .single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    throw error
  }
}

export const getFiresByUserUuid = async ({
  uuid,
}: {
  uuid: string
}): Promise<TFireData[]> => {
  try {
    const { data, error } = await supabase
      .from("fire")
      .select<string, TFireData>("*")
      .eq("created_by", uuid)

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    throw error
  }
}
