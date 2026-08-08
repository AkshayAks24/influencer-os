import { useEffect } from "react"
import { useLocation } from "react-router-dom"

export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    // If there is a hash, scroll to it smoothly
    if (hash) {
      // Small timeout ensures the DOM has updated and element exists
      setTimeout(() => {
        const element = document.getElementById(hash.replace("#", ""))
        if (element) {
          element.scrollIntoView({ behavior: "smooth" })
        }
      }, 100)
    } else {
      // If no hash, scroll to the absolute top
      window.scrollTo({ top: 0, left: 0, behavior: "instant" })
      
      // Also handle layout-specific scroll containers
      const mainContainer = document.getElementById("main-scroll-container")
      if (mainContainer) {
        mainContainer.scrollTo({ top: 0, left: 0, behavior: "instant" })
      }
    }
  }, [pathname, hash])

  return null
}
