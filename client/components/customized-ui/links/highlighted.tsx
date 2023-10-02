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
      className="border-green-700 dark:border-yellow-300 text-green-700
] dark:text-yellow-300 border-b hover:border-b-2"
    >
      {children}
    </Link>
  )
}

export default HighlightedLink
