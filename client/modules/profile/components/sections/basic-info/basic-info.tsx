import React from "react"
import { StaticImport } from "next/dist/shared/lib/get-img-props"
import BaseSection from "@/modules/profile/components/sections/base/base"
import { useI18n } from "@/utils/services/internationalization/client"
import { UseFormReturn } from "react-hook-form"

import { ICityResponse } from "@/types/api/response/city"
import { ICountryResponse } from "@/types/api/response/country"
import { IProvinceResponse } from "@/types/api/response/province"
import { IUserResponse } from "@/types/api/response/user"
import { cn } from "@/lib/utils"
import useCityOptions from "@/hooks/common/options/city-options"
import useCountryOptions from "@/hooks/common/options/country-options"
import useProvinceOptions from "@/hooks/common/options/province-options"
import BaseAvatar from "@/components/customized-ui/avatars/base"
import FormCheckBox from "@/components/customized-ui/form/check-box"
import FormFileUpload from "@/components/customized-ui/form/file"
import FormTextInput from "@/components/customized-ui/form/input"
import FormSelect from "@/components/customized-ui/form/select"
import FormTextArea from "@/components/customized-ui/form/text-area"

interface IBasicInfoSectionProps {
  base64Image: string | StaticImport | null
  onProfileImageChange: (e: any) => void
  profile: IUserResponse
  form: UseFormReturn<any>
  countryList: ICountryResponse[]
  provinceList: IProvinceResponse[]
  cityList: ICityResponse[]
  provinceWatchValue: any
  countryWatchValue: any
  isReferrerChecked: boolean
  isRefereeChecked: boolean
}
const BasicInfoSection: React.FunctionComponent<IBasicInfoSectionProps> = ({
  base64Image,
  onProfileImageChange,
  profile,
  form,
  countryList,
  provinceList,
  provinceWatchValue,
  countryWatchValue,
  cityList,
  isReferrerChecked,
  isRefereeChecked,
}) => {
  const t = useI18n()

  const countryOptions = useCountryOptions(countryList)
  const provinceOptions = useProvinceOptions(provinceList, countryWatchValue)
  const cityOptions = useCityOptions(cityList, provinceWatchValue)

  return (
    <BaseSection title={t("profile.section.basic_info")}>
      <div className="mt-8 flex w-full flex-col justify-between p-4  md:flex-row">
        {/* left */}
        <div className="flex max-w-lg basis-1/2 flex-col justify-between gap-8">
          <div className="flex flex-row items-center justify-center gap-4">
            <div className="flex flex-col gap-4">
              <label className="w-fit whitespace-nowrap text-xxs font-medium text-slate-500">
                {t("profile.form.avatar_label")}
              </label>
              {!base64Image && (
                <BaseAvatar
                  url={profile?.avatar_url || undefined}
                  alt={profile?.username || null}
                  fallBack={(profile?.username && profile?.username[0]) || null}
                  size="large"
                />
              )}

              {base64Image && (
                <BaseAvatar
                  url={base64Image.toString()}
                  alt={profile?.username || null}
                  fallBack={(profile?.username && profile?.username[0]) || null}
                  size="large"
                />
              )}
            </div>

            <FormFileUpload
              accept=".jpg, .jpeg, .png"
              onChange={onProfileImageChange}
              description={t("profile.form.avatar_description")}
              className="max-w-lg"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xxs font-medium text-slate-500">
              {t("auth.form.username_label")}
            </label>
            <FormTextInput control={form.control} name="username" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xxs font-medium text-slate-500">
              {t("general.user_role")}
            </label>
            <div
              className={cn(
                "w-full",
                isReferrerChecked ? " bg-orange-50" : " bg-white"
              )}
            >
              <FormCheckBox
                control={form.control}
                label={t("general.referrer")}
                name="isReferer"
                description={t("profile.form.is_referrer_description")}
                checkBoxClassName="data-[state=checked]:bg-orange-500"
                labelClassName="text-orange-500"
              />
            </div>

            <div
              className={cn(
                "w-full",
                isRefereeChecked ? " bg-teal-50" : " bg-white"
              )}
            >
              <FormCheckBox
                control={form.control}
                label={t("general.talent")}
                name="isReferee"
                description={t("profile.form.is_referee_description")}
                checkBoxClassName="data-[state=checked]:bg-teal-500"
                labelClassName="text-teal-500"
              />
            </div>
          </div>
        </div>

        {/* right */}
        <div className="mt-6 flex max-w-lg basis-1/2 flex-col md:mt-0">
          <label className="text-xxs font-medium text-slate-500">
            {t("general.location")}
          </label>

          <div className="flex flex-col p-2">
            <div className="grid grid-cols-4 items-center gap-4 ">
              <label className="col-span-1 justify-self-start text-xxs font-medium text-slate-500">
                {t("general.country")}
              </label>
              <div className="col-span-3 ">
                <FormSelect
                  options={countryOptions}
                  control={form.control}
                  name="countryUuid"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4 ">
              <label className="col-span-1 justify-self-start text-xxs font-medium text-slate-500">
                {t("profile.form.optional_region_label")}
              </label>
              <div className="col-span-3 ">
                <FormSelect
                  control={form.control}
                  name="provinceUuid"
                  options={provinceOptions}
                />{" "}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4 ">
              <label className="col-span-1 justify-self-start text-xxs font-medium text-slate-500">
                {t("profile.form.optional_city_label")}
              </label>

              <div className="col-span-3 ">
                <FormSelect
                  control={form.control}
                  name="cityUuid"
                  options={cityOptions}
                />
              </div>
            </div>

            <div className="mt-8 flex flex-col">
              <label className="col-span-1 justify-self-start text-xxs font-medium text-slate-500">
                {t("profile.form.personal_description_label")}
              </label>
              <FormTextArea
                control={form.control}
                name="description"
                minRows={8}
              />
            </div>
          </div>
        </div>
      </div>
    </BaseSection>
  )
}

export default BasicInfoSection
