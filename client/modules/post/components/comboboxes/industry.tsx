import React from "react"
import IndustryInput from "@/modules/post/components/selects/industry"
import { useI18n } from "@/utils/services/internationalization/client"

import { IIndustryResponse } from "@/types/api/response/industry"
import BaseCombobox from "@/components/customized-ui/comboboxes/base"

interface IIndustryComboboxProps {
  industryList: IIndustryResponse[]
  industries: Set<string>
  onIndustryChange: (value: string[]) => void
}

const IndustryCombobox: React.FunctionComponent<IIndustryComboboxProps> = ({
  industries,
  industryList,
  onIndustryChange,
}) => {
  const t = useI18n()
  const selectedAllValue =
    industryList.length > 0 && industryList.every((o) => industries.has(o.uuid))

  return (
    <BaseCombobox
      popoverClassName="overflow-hidden"
      triggerTitle={
        selectedAllValue
          ? t("general.all")
          : t("filter.combobox.industry.triggerTitle", {
              count: industries.size,
            })
      }
    >
      <IndustryInput
        industries={industries}
        industryList={industryList}
        onIndustryChange={onIndustryChange}
      />
    </BaseCombobox>
  )
}

export default IndustryCombobox
