import React from "react"
import BaseSection from "@/modules/profile/components/sections/base/base"
import { useI18n } from "@/utils/services/internationalization/client"
import { UseFormReturn } from "react-hook-form"

import FormTextInput from "@/components/customized-ui/form/input"

interface PersonalLinksSectionProps {
  form: UseFormReturn<any>
}
const PersonalLinksSection: React.FunctionComponent<
  PersonalLinksSectionProps
> = ({ form }) => {
  const t = useI18n()
  return (
    <BaseSection title={t("profile.section.personal_link")}>
      <div className="mt-8">
        <FormTextInput
          control={form.control}
          label={t("profile.form.optional_personal_social_media_link_label")}
          name="socialMediaUrl"
          description={t("profile.form.personal_social_media_link_description")}
        />
      </div>
    </BaseSection>
  )
}

export default PersonalLinksSection
