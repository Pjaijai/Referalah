import React from "react"
import BaseSection from "@/modules/profile/components/sections/base/base"
import { useI18n } from "@/utils/services/internationalization/client"
import { useFormContext, useWatch } from "react-hook-form"

import FormSwitch from "@/components/customized-ui/form/switch"

interface INotificationPermissionSectionProps {}

const NotificationPermissionSection: React.FunctionComponent<
  INotificationPermissionSectionProps
> = () => {
  const t = useI18n()
  const { control, setValue } = useFormContext()

  const notificationPermissions = useWatch({
    control,
    name: "notificationPermissions",
    defaultValue: [],
  })

  const handleSwitchChange = (value: boolean, permission: string) => {
    let updatedPermissions = [...notificationPermissions]
    if (value) {
      updatedPermissions.push(permission)
    } else {
      updatedPermissions = updatedPermissions.filter((p) => p !== permission)
    }
    setValue("notificationPermissions", updatedPermissions, {
      shouldValidate: true,
    })
  }

  return (
    <BaseSection title={t("profile.section.notification_config")}>
      <div className="mt-8 flex flex-col justify-between gap-20 md:flex-wrap md:items-start ">
        <div>
          <h5 className="font-xxs text-slate-500">{t("general.post")}</h5>

          <div className="mt-[52px] flex flex-row items-center gap-2">
            <FormSwitch
              control={control}
              name="notificationPermissions"
              checked={notificationPermissions.includes(
                "post_contact_follow_up"
              )}
              onCheckedChange={(value) =>
                handleSwitchChange(value, "post_contact_follow_up")
              }
            />
            <p className="font-medium text-slate-800">
              {t("profile.form.post_contact_follow_up_label")}
            </p>
          </div>
        </div>

        <div>
          <h5 className="font-xxs text-slate-500">Coffee Chat</h5>

          <div className="mt-[52px] flex flex-row items-center gap-2 ">
            <FormSwitch
              control={control}
              name="notificationPermissions"
              checked={notificationPermissions.includes(
                "coffee_chat_request_follow_up"
              )}
              onCheckedChange={(value) =>
                handleSwitchChange(value, "coffee_chat_request_follow_up")
              }
            />
            <p className="font-medium text-slate-800">
              {t("profile.form.coffee_chat_request_follow_up_label")}
            </p>
          </div>
        </div>

        <div>
          <h5 className="font-xxs font-medium text-slate-500">
            {t("general.other")}
          </h5>

          <div className="mt-[52px] flex flex-col gap-8 ">
            <div className="flex flex-row items-center gap-2">
              <FormSwitch
                control={control}
                name="notificationPermissions"
                checked={notificationPermissions.includes("unseen_message")}
                onCheckedChange={(value) =>
                  handleSwitchChange(value, "unseen_message")
                }
              />
              <p className="font-medium text-slate-800">
                {t("profile.form.unseen_message_label")}
              </p>
            </div>

            <div className="flex flex-row items-center gap-2 ">
              <FormSwitch
                control={control}
                name="notificationPermissions"
                checked={notificationPermissions.includes(
                  "official_broadcast_message"
                )}
                onCheckedChange={(value) =>
                  handleSwitchChange(value, "official_broadcast_message")
                }
              />
              <p className="font-medium text-slate-800">
                {t("profile.form.official_broadcast_message_label")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </BaseSection>
  )
}

export default NotificationPermissionSection
