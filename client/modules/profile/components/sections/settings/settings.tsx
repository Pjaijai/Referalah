import React from "react"
import BaseSection from "@/modules/profile/components/sections/base/base"
import { useI18n } from "@/utils/services/internationalization/client"
import { useFormContext } from "react-hook-form"

import useLocaleList from "@/hooks/common/locale-list"
import FormSelect from "@/components/customized-ui/form/select"
import { ISelectOption } from "@/components/customized-ui/selects/base"

interface IWorkExperienceSectionProps {}
const SettingSection: React.FunctionComponent<
  IWorkExperienceSectionProps
> = ({}) => {
  const t = useI18n()
  const { control } = useFormContext()
  const locales = useLocaleList()
  const localeOptions: ISelectOption[] = locales.map((locale) => ({
    value: locale.value,
    label: (
      <div className="flex flex-row items-center justify-start gap-1">
        <span>{locale.icon}</span>
        <span>{locale.location}</span>
        <span>({locale.lang})</span>
      </div>
    ),
  }))
  return (
    <BaseSection title={t("profile.section.setting")}>
      <div className="mt-8 flex flex-col items-center justify-between gap-6 md:flex-row md:gap-0">
        <div className="flex w-full max-w-lg flex-col gap-6 md:gap-12">
          <div className="flex flex-col gap-2">
            <label className="text-xxs font-medium text-slate-500">
              {t("profile.form.language_label")}
            </label>
            <FormSelect
              options={localeOptions}
              control={control}
              name="locale"
            />
          </div>
        </div>
      </div>
    </BaseSection>
  )
}

export default SettingSection
