"use client"

import * as Tabs from "@radix-ui/react-tabs"

import { tabsData } from "../data"

const InstallationTabs = () => {
  return (
    <Tabs.Root defaultValue={tabsData[0].slug} className="flex w-full flex-col">
      <Tabs.List className="flex shrink-0 border-b">
        {tabsData.map((tab) => (
          <Tabs.Trigger
            key={tab.slug}
            value={tab.slug}
            className="flex h-[45px] flex-1 cursor-default select-none items-center justify-center px-5 text-[15px] leading-none outline-none first:rounded-tl-md last:rounded-tr-md data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current"
          >
            {tab.title}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {tabsData.map((tab) => (
        <Tabs.Content
          key={tab.slug}
          value={tab.slug}
          className="grow rounded-b-md p-5 outline-none"
        >
          <ol className="list-inside list-decimal">
            {tab.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </Tabs.Content>
      ))}
    </Tabs.Root>
  )
}

export default InstallationTabs
