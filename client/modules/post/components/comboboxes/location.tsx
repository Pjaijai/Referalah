import React from "react"
import LocationSelect from "@/modules/post/components/selects/location"
import { useI18n } from "@/utils/services/internationalization/client"

import { ICityResponse } from "@/types/api/response/city"
import { ICountryResponse } from "@/types/api/response/country"
import { IProvinceResponse } from "@/types/api/response/province"
import BaseCombobox from "@/components/customized-ui/comboboxes/base"

interface ILocationComboboxProps {
  countryList: ICountryResponse[]
  provinceList: IProvinceResponse[]
  cityList: ICityResponse[]
  locations: Set<string>
  onLocationChange: (value: string[]) => void
}

const LocationCombobox: React.FunctionComponent<ILocationComboboxProps> = ({
  countryList,
  provinceList,
  cityList,
  locations,
  onLocationChange,
}) => {
  const t = useI18n()
  const selectedAllValue =
    cityList.length > 0 && cityList.every((o) => locations.has(o.uuid))

  return (
    <BaseCombobox
      popoverClassName="overflow-hidden"
      triggerTitle={
        selectedAllValue
          ? t("general.all")
          : t("filter.combobox.location.triggerTitle", {
              count: locations.size,
            })
      }
    >
      <LocationSelect
        countryList={countryList}
        provinceList={provinceList}
        cityList={cityList}
        locations={locations}
        onLocationChange={onLocationChange}
      />
    </BaseCombobox>
  )
}

export default LocationCombobox
