import React from "react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"

interface IBaseSectionProps {
  children: React.ReactNode
  title: string
}
const BaseSection: React.FunctionComponent<IBaseSectionProps> = ({
  children,
  title,
}) => {
  return (
    <>
      <div className="hidden rounded-lg border border-muted bg-white p-8 shadow-lg md:block">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <Separator className="mt-4" />
        {children}
      </div>

      <Accordion
        type="single"
        collapsible
        className=" block rounded-lg bg-white p-8 md:hidden "
        defaultValue="item-1"
      >
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-2xl">{title}</AccordionTrigger>
          <AccordionContent>
            <Separator className="mt-4" />

            {children}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  )
}

export default BaseSection
