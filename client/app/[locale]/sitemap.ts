// client/app/[locale]/sitemap.ts
// changeFrequency and priority seems like not working
import { MetadataRoute } from "next"
import { supabase } from "@/utils/services/supabase/config"

import { ELocale } from "@/types/common/enums/locale"

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
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || "https://www.referalah.com"
  const currentDate = new Date().toISOString()
  const { postUuids, jobJourneyUuids } = await getAllUuids()

  const sitemapEntries = []

  const validLocales = Object.values(ELocale)

  for (const locale of validLocales) {
    // Static routes
    sitemapEntries.push(
      {
        url: `${baseUrl}${locale}`,
        lastModified: currentDate,
      },
      {
        url: `${baseUrl}${locale}/member/search`,
        lastModified: currentDate,
      },
      {
        url: `${baseUrl}${locale}/post/search`,
        lastModified: currentDate,
      }
    )

    // Dynamic post routes
    for (const { uuid } of postUuids) {
      sitemapEntries.push({
        url: `${baseUrl}${locale}/post/view/${uuid}`,
        lastModified: currentDate,
      })
    }

    // Dynamic job journey routes
    for (const { uuid } of jobJourneyUuids) {
      sitemapEntries.push({
        url: `${baseUrl}${locale}/job-journey/view/${uuid}`,
        lastModified: currentDate,
      })
    }
  }

  return sitemapEntries
}
