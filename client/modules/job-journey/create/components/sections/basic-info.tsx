import React from "react"
import SubSection from "@/modules/job-journey/create/components/sections/sub-section"
import { useI18n } from "@/utils/services/internationalization/client"
import { useFormContext } from "react-hook-form"

import { IIndustryResponse } from "@/types/api/response/industry"
import { TLocationData } from "@/types/api/response/location"
import useJobLevelOptions from "@/hooks/common/options/Job-level-options"
import useJobTypeOptions from "@/hooks/common/options/Job-type-options"
import useApplicationSourceOptions from "@/hooks/common/options/application-source-options"
import useIndustryOptions from "@/hooks/common/options/industry-options"
import LocationCombobox from "@/components/customized-ui/comboboxes/location"
import FormCompanyCombobox from "@/components/customized-ui/form/company"
import FormDatePicker from "@/components/customized-ui/form/date-picker"
import FormTextInput from "@/components/customized-ui/form/input"
import FormSelect from "@/components/customized-ui/form/select"

interface IBasicInfoSectionProps {
  industryData: IIndustryResponse[]
  locationData: TLocationData[]
}
const BasicInfoSection: React.FunctionComponent<IBasicInfoSectionProps> = ({
  industryData,
  locationData,
}) => {
  const t = useI18n()
  const industryOptions = useIndustryOptions(industryData)

  const jobTypeOptions = useJobTypeOptions()

  const jobLevelOptions = useJobLevelOptions()
  const sourcesOptions = useApplicationSourceOptions()
  const { control } = useFormContext()

  return (
    <div className="bg-white p-10 pt-8">
      <div className="grid w-full ">
        {/* Left Column */}
        <SubSection title={t("job_journey.sub_section.position")}>
          <div className="grid grid-cols-1 gap-y-6 md:gap-y-10">
            {/* Position Title (full width) */}{" "}
            <div className="grid grid-cols-1  gap-y-6 md:grid-cols-2">
              <FormTextInput
                control={control}
                name="positionTitle"
                label={t("general.job_title")}
                placeholder={t("job_journey.form.position_title_placeholder")}
                isRequired
              />
            </div>
            {/* Industry and Company (side by side) */}
            <div className="grid grid-cols-1 gap-x-10  gap-y-6 md:grid-cols-2 md:gap-y-10">
              <FormSelect
                control={control}
                name="industry"
                label={t("general.industry")}
                isRequired
                options={industryOptions}
              />
              <FormCompanyCombobox isRequired />
            </div>
            {/* Job Type and Job Level (side by side) */}
            <div className="grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-2 md:gap-y-10">
              <FormSelect
                control={control}
                name="jobType"
                label={t("general.job_type")}
                isRequired
                options={jobTypeOptions}
              />
              <FormSelect
                control={control}
                name="jobLevel"
                label={t("general.job_level")}
                isRequired
                options={jobLevelOptions}
              />
            </div>
          </div>
        </SubSection>

        <SubSection
          title={t("job_journey.sub_section.application_details")}
          className="mt-6 gap-y-6 md:mt-[100px] md:gap-y-10"
        >
          <div className="0 grid gap-y-6 md:gap-y-10">
            {/* Row 1: applicationDate and source side by side */}
            <div className="grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-2 md:gap-y-10">
              <FormDatePicker
                control={control}
                name="applicationDate"
                label={t("general.application_submit_data")}
                disabledDates={(date) => date > new Date()}
                description={t("job_journey.form.date.description")}
                descriptionClassName="text-indigo-400 text-xs"
                isRequired
              />
              <FormSelect
                control={control}
                name="source"
                label={t("general.job_source")}
                isRequired
                options={sourcesOptions}
              />
            </div>

            {/* Row 2: location */}
            <div className="grid grid-cols-1 gap-x-10 md:grid-cols-2">
              <LocationCombobox isRequired locations={locationData} />
            </div>
          </div>
        </SubSection>
      </div>
    </div>
  )
}

export default BasicInfoSection
