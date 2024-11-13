import React from "react"
import BaseSection from "@/modules/profile/components/sections/base/base"
import { useI18n } from "@/utils/services/internationalization/client"
import { UseFormReturn } from "react-hook-form"

import { IIndustryResponse } from "@/types/api/response/industry"
import useIndustryOptions from "@/hooks/common/options/industry-options"
import FormTextInput from "@/components/customized-ui/form/input"
import FormNumberInput from "@/components/customized-ui/form/number"
import FormSelect from "@/components/customized-ui/form/select"

interface IWorkExperienceSectionProps {
  form: UseFormReturn<any>
  industryList: IIndustryResponse[]
}
const WorkExperienceSection: React.FunctionComponent<
  IWorkExperienceSectionProps
> = ({ industryList, form }) => {
  const t = useI18n()
  const industryOptions = useIndustryOptions(industryList)
  return (
    <BaseSection title={t("profile.section.work_experience")}>
      <div className="mt-8 flex flex-col items-center justify-between gap-6 md:flex-row md:gap-0">
        <div className="flex w-full max-w-lg flex-col gap-6 md:gap-12">
          <div className="flex flex-col gap-2">
            <label>{t("general.industry")}</label>
            <FormSelect
              options={industryOptions}
              control={form.control}
              name="industryUuid"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label>{t("general.year_of_experience")}</label>
            <FormNumberInput control={form.control} name="yearOfExperience" />
          </div>
        </div>
        <div className="flex w-full max-w-lg  flex-col  gap-6 md:gap-12">
          <div className="flex flex-col gap-2">
            <label>{t("profile.form.optional_company_label")}</label>
            <FormTextInput control={form.control} name="company" />
          </div>

          <div className="flex flex-col gap-2">
            <label>{t("profile.form.job_title_label")}</label>
            <FormTextInput control={form.control} name="jobTitle" />
          </div>
        </div>
      </div>
    </BaseSection>
  )
}

export default WorkExperienceSection
