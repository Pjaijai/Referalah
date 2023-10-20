import React, { PropsWithChildren } from "react"
import Link from "next/link"

interface IHighlightedLinkProps {
  href: string
}
const HighlightedLink: React.FunctionComponent<
  PropsWithChildren<IHighlightedLinkProps>
> = ({ href, children }) => {
  return (
    <Link
      href={href}
      className="] border-b border-green-700
text-green-700 hover:border-b-2 dark:border-yellow-300 dark:text-yellow-300"
    >
      {children}
    </Link>
  )
}

export default HighlightedLink
