import React from "react"
import { CopyToClipboard } from "react-copy-to-clipboard"

interface IBaseClipboardProps {
  children: React.ReactNode
  onCopy: () => void
  textValue: string
}
const BaseClipboard: React.FunctionComponent<IBaseClipboardProps> = ({
  children,
  onCopy,
  textValue,
}) => {
  return (
    <CopyToClipboard text={textValue} onCopy={onCopy}>
      {children}
    </CopyToClipboard>
  )
}

export default BaseClipboard
