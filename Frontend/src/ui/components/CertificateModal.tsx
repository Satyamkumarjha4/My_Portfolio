import type React from "react"
import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

interface CertificateModalProps {
  isOpen: boolean
  onClose: () => void
  certificateUrl: string
  title: string
}

const CertificateModal: React.FC<CertificateModalProps> = ({ isOpen, onClose, certificateUrl, title }) => {
  // Close modal on escape key press
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    window.addEventListener("keydown", handleEscapeKey)

    // Prevent scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      window.removeEventListener("keydown", handleEscapeKey)
      document.body.style.overflow = "auto"
    }
  }, [isOpen, onClose])

  // Handle click outside to close
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
        >
          <motion.div
            className="relative bg-gray-800 rounded-xl overflow-hidden max-w-4xl w-full max-h-[90vh] shadow-2xl border border-indigo-500/20"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h3 className="text-xl font-bold text-white">{title}</h3>
              <motion.button
                className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white"
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>

            <div className="p-1 overflow-auto max-h-[calc(90vh-80px)]">
              {certificateUrl ? (
                <div className="relative pt-[56.25%] w-full bg-gray-900 rounded">
                  <iframe
                    src={certificateUrl.replace("/view", "/preview")}
                    className="absolute top-0 left-0 w-full h-full rounded"
                    allow="autoplay"
                    title="Certificate Preview"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-400">
                  No certificate available for this achievement
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-700 flex justify-end">
              {certificateUrl && (
                <motion.a
                  href={certificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Original
                </motion.a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CertificateModal
