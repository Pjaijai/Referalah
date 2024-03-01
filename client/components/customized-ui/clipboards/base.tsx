import React, { useState } from "react"
import { CopyToClipboard } from "react-copy-to-clipboard"

interface IBaseClipboardProps {
  textValue: string
  beforeCopyContent: React.ReactNode
  afterCopyContent: React.ReactNode
  className?: string
}
const BaseClipboard: React.FunctionComponent<IBaseClipboardProps> = ({
  textValue,
  className,
  beforeCopyContent,
  afterCopyContent,
}) => {
  const [isClicked, setIsClicked] = useState(false)

  const onCopy = async () => {
    setIsClicked(true)
  }
  return (
    <CopyToClipboard text={textValue} onCopy={onCopy}>
      <button className={className}>
        {isClicked ? beforeCopyContent : afterCopyContent}
      </button>
    </CopyToClipboard>
  )
}

export default BaseClipboard
