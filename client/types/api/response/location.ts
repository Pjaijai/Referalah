export type TLocationData = {
  id: number
  uuid: string
  value: string
  english_name: string
  cantonese_name: string
  level: number
  parent_uuid: string | null
  country_uuid: string | null
  meta_data: {
    emoji: string | null
  }
}
