import type React from "react"
import { useState, type ChangeEvent } from "react"
import { Star, Send, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

interface FormData {
  email: string
  name: string
  rating: number
  remark: string
}

interface FormErrors {
  email?: string
  name?: string
  rating?: string
}

const FeedbackForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    name: "",
    rating: 0,
    remark: "",
  })

  const [hoveredStar, setHoveredStar] = useState<number>(0)
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const handleStarClick = (rating: number): void => {
    setFormData({
      ...formData,
      rating,
    })

    // Clear rating error if present
    if (errors.rating) {
      setErrors({
        ...errors,
        rating: "",
      })
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.name) {
      newErrors.name = "Name is required"
    }

    if (formData.rating === 0) {
      newErrors.rating = "Please select a rating"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (): void => {
    if (validateForm()) {
      console.log("Form submitted:", formData)
      // Here you would typically send the data to your backend

      // Show success message with animation
      setIsSubmitted(true)

      // Reset form after submission
      setTimeout(() => {
        setFormData({
          email: "",
          name: "",
          rating: 0,
          remark: "",
        })
        setIsSubmitted(false)
      }, 3000)
    }
  }

  const handleFocus = (fieldName: string) => {
    setFocusedField(fieldName)
  }

  const handleBlur = () => {
    setFocusedField(null)
  }

  return (
    <div className="w-full min-h-screen bg-gray-900 flex items-center justify-center px-2 py-16">
      <motion.div
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "tween", delay: 0.2, duration: 1 }}
        className="w-full max-w-xl bg-gray-900 rounded-2xl shadow-lg p-4"
      >
        <div className="w-full p-8 bg-gray-800 rounded-lg shadow-xl border border-gray-700 px-8 relative overflow-hidden">
          {/* Background gradient effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-purple-900/10 pointer-events-none"></div>

          <motion.h2
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-center text-white mb-8"
          >
            Portfolio Feedback
          </motion.h2>

          {isSubmitted ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-indigo-900/50 border border-indigo-500 text-indigo-200 px-4 py-4 rounded-lg mb-4 flex items-center"
            >
              <CheckCircle className="mr-3 text-indigo-400" size={24} />
              <div>
                <strong className="font-bold text-indigo-300">Thank you for your feedback!</strong>
                <span className="block text-indigo-200"> Your feedback has been submitted successfully.</span>
              </div>
            </motion.div>
          ) : (
            <div>
              <motion.div
                className="mb-6"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <label htmlFor="email" className="block text-gray-300 text-sm font-medium mb-2">
                  Email ID*
                </label>
                <motion.div
                  animate={focusedField === "email" ? { scale: 1.02 } : { scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onFocus={() => handleFocus("email")}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 text-white ${
                      errors.email ? "border-red-500 focus:ring-red-400" : "border-gray-600 focus:ring-indigo-500"
                    }`}
                    placeholder="What is your Email-ID?"
                  />
                </motion.div>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-xs mt-2"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </motion.div>

              <motion.div
                className="mb-6"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <label htmlFor="name" className="block text-gray-300 text-sm font-medium mb-2">
                  Name*
                </label>
                <motion.div
                  animate={focusedField === "name" ? { scale: 1.02 } : { scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    onFocus={() => handleFocus("name")}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 text-white ${
                      errors.name ? "border-red-500 focus:ring-red-400" : "border-gray-600 focus:ring-indigo-500"
                    }`}
                    placeholder="What is your Name?"
                  />
                </motion.div>
                {errors.name && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-xs mt-2"
                  >
                    {errors.name}
                  </motion.p>
                )}
              </motion.div>

              <motion.div
                className="mb-6"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <label className="block text-gray-300 text-sm font-medium mb-2">Rating*</label>
                <div className="flex space-x-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.div key={star} whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                      <Star
                        size={30}
                        onClick={() => handleStarClick(star)}
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(0)}
                        fill={hoveredStar >= star || formData.rating >= star ? "#6366F1" : "none"}
                        color={hoveredStar >= star || formData.rating >= star ? "#6366F1" : "#6B7280"}
                        className="cursor-pointer transition-colors duration-200"
                      />
                    </motion.div>
                  ))}
                </div>
                {errors.rating && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-xs mt-2"
                  >
                    {errors.rating}
                  </motion.p>
                )}
              </motion.div>

              <motion.div
                className="mb-8"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <label htmlFor="remark" className="block text-gray-300 text-sm font-medium mb-2">
                  Remarks
                </label>
                <motion.div
                  animate={focusedField === "remark" ? { scale: 1.02 } : { scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <textarea
                    id="remark"
                    name="remark"
                    value={formData.remark}
                    onChange={handleInputChange}
                    onFocus={() => handleFocus("remark")}
                    onBlur={handleBlur}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                    placeholder="Share your thoughts about my portfolio..."
                  />
                </motion.div>
              </motion.div>

              <motion.div
                className="flex justify-center"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <motion.button
                  onClick={handleSubmit}
                  whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(99, 102, 241, 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium py-3 px-8 rounded-full flex items-center transition duration-300"
                >
                  <span className="mr-2">Submit Feedback</span>
                  <Send size={20} />
                </motion.button>
              </motion.div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default FeedbackForm
