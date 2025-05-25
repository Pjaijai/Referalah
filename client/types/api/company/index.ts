export type TCompanyData = {
  id: number
  name: string
  meta_data: TCompanyMetaData
}
export type TCompanyResponse = TCompanyData

export type TCompanyMetaData = {
  domain: string | null
  logo_url: string | null
}
