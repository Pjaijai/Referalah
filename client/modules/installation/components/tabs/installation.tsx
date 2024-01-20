"use client"

import { useI18n } from "@/utils/services/internationalization/client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const InstallationTabs = () => {
  const t = useI18n()

  const tabsData = [
    {
      title: "IOS",
      value: "ios",
      steps: [
        t("pwa.ios.step_one"),
        t("pwa.ios.step_two"),
        t("pwa.ios.step_three"),
        t("pwa.ios.step_four"),
      ],
    },
    {
      title: "Android",
      value: "android",
      steps: [
        t("pwa.android.step_one"),
        t("pwa.android.step_two"),
        t("pwa.android.step_three"),
        t("pwa.android.step_four"),
      ],
    },
  ]

  return (
    <Tabs defaultValue={tabsData[0].value} className="w-full">
      <TabsList className="flex justify-center">
        {tabsData.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value} className="w-full">
            {tab.title}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabsData.map((tab) => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          className="grow rounded-b-md p-5 outline-none"
        >
          <ol className="list-inside list-decimal">
            {tab.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </TabsContent>
      ))}
    </Tabs>
  )
}

export default InstallationTabs
