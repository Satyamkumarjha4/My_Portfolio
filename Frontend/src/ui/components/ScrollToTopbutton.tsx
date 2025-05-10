import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronUp } from "lucide-react"

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 rounded-full bg-indigo-500 text-white shadow-lg z-50"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          whileHover={{ scale: 1.1, backgroundColor: "#4338ca" }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <ChevronUp className="h-6 w-6" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
