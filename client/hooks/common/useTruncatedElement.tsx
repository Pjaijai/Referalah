import { RefObject, useLayoutEffect, useState } from "react"

interface IUseTruncatedElementProps {
  ref: RefObject<HTMLElement>
}

const useTruncatedElement = ({ ref }: IUseTruncatedElementProps) => {
  const [isTruncated, setIsTruncated] = useState(false)
  const [isShowingMore, setIsShowingMore] = useState(false)

  useLayoutEffect(() => {
    const { offsetHeight, scrollHeight } = ref.current || {}

    if (offsetHeight && scrollHeight && offsetHeight < scrollHeight) {
      setIsTruncated(true)
    } else {
      setIsTruncated(false)
    }
  }, [ref])

  const toggleIsShowingMore = () => setIsShowingMore((prev) => !prev)

  return {
    isTruncated,
    isShowingMore,
    toggleIsShowingMore,
  }
}

export default useTruncatedElement
