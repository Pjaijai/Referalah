// client/app/[locale]/sitemap.ts

import { MetadataRoute } from "next"
import { supabase } from "@/utils/services/supabase/config"

export const revalidate = 60 * 60 * 24 // Regenerate every 24 hours

interface UuidResult {
  postUuids: { uuid: string; updated_at: string }[]
  jobJourneyUuids: { uuid: string; updated_at: string }[]
}

export async function getAllUuids(): Promise<UuidResult> {
  const perPage = 100 // Max rows per query
  let postUuids: { uuid: string; updated_at: string }[] = []
  let jobJourneyUuids: { uuid: string; updated_at: string }[] = []

  try {
    const fetchPaginated = async (
      table: "post" | "job_journey"
    ): Promise<{ uuid: string; updated_at: string }[]> => {
      let results: { uuid: string; updated_at: string }[] = []
      for (let page = 0; ; page++) {
        const { data, error } = await supabase
          .from(table)
          .select(" id ,uuid")
          .order("id", { ascending: false }) // Sort by uuid
          .range(page * perPage, (page + 1) * perPage - 1)
        if (error) throw new Error(`${table} query failed: ${error.message}`)
        results = results.concat(data as any)
        if (data.length < perPage) break
      }
      return results
    }

    postUuids = await fetchPaginated("post")
    jobJourneyUuids = await fetchPaginated("job_journey")

    return { postUuids, jobJourneyUuids }
  } catch (error) {
    console.error("Error fetching UUIDs:", error)
    return { postUuids: [], jobJourneyUuids: [] }
  }
}

export default async function sitemap({
  params,
}: {
  params?: { locale: string }
}): Promise<MetadataRoute.Sitemap> {
  // Fallback to a default locale if params or params.locale is undefined
  const locale = params?.locale || "en-ca"
  // Validate locale to ensure it's either en-ca or zh-hk
  const validLocales = ["en-ca", "zh-hk"]
  if (!validLocales.includes(locale)) {
    console.warn(`Invalid locale: ${locale}. Using default: en-ca`)
    return [] // Return empty sitemap for invalid locales to avoid errors
  }

  const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || "https://www.referalah.com"
  const currentDate = new Date().toISOString()
  const sitemapEntries = []

  sitemapEntries.push(
    {
      url: `${baseUrl}${locale}`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}${locale}/member/search`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}${locale}/post/search`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    }
  )

  // Dynamic routes from post and job_journey
  const { postUuids, jobJourneyUuids } = await getAllUuids()

  // Post URLs (/[locale]/post/view/[uuid])
  for (const { uuid } of postUuids) {
    sitemapEntries.push({
      url: `${baseUrl}${locale}/post/view/${uuid}`,
      lastModified: new Date(currentDate),
      changeFrequency: "monthly",
      priority: 0.8,
    })
  }

  // Job Journey URLs (/[locale]/job-journey/view/[uuid])
  for (const { uuid } of jobJourneyUuids) {
    sitemapEntries.push({
      url: `${baseUrl}${locale}/job-journey/view/${uuid}`,
      lastModified: new Date(currentDate),
      changeFrequency: "monthly",
      priority: 0.8,
    })
  }

  return sitemapEntries
}
