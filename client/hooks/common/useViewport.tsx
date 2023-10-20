import { useEffect, useState } from "react"
import tailwindConfig from "tailwind.config.js"
import resolveConfig from "tailwindcss/resolveConfig"

const fullConfig = resolveConfig(tailwindConfig)

export const useViewport = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false)

  useEffect(() => {
    function onWindowResize() {
      setIsMobile(
        window?.innerWidth <=
          Number((fullConfig?.theme?.screens as any)?.sm.replace("px", ""))
      )
    }

    if (typeof window !== "undefined") {
      window.addEventListener("resize", onWindowResize)
      onWindowResize()
      return () => {
        window.removeEventListener("resize", onWindowResize)
      }
    }
  }, [])

  return { isMobile }
}

export default useViewport
