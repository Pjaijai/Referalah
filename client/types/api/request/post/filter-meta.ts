export interface IFilterMeta {
  companyName: string
  jobTitle: string
  cityUuid: string | undefined
  countryUuid: string | undefined
  industryUuid: string | undefined
  provinceUuid: string | undefined
  sorting: string
  yoeMin: string // string number
  yoeMax: string // string number
}
