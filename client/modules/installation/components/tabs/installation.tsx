"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { tabsData } from "../../data"

const InstallationTabs = () => {
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
