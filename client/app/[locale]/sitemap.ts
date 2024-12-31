import { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_WEB_URL
  const currentDate = new Date().toISOString()

  return [
    {
      url: baseUrl,
      lastModified: currentDate,
    },
    {
      url: `${baseUrl}/member/search`,
      lastModified: currentDate,
    },
    {
      url: `${baseUrl}/post/search`,
      lastModified: currentDate,
    },
  ]
}
