import type React from "react"
import Navbar from "../components/Navbar"
import FeedbackForm from "../components/Feedback"
import Footer from "../components/Footer"
import ContactDetails from "../components/ContactDetails"


const Contact: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-gray-900 overflow-hidden">
      <Navbar />
      <div className="w-full flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2">
          <ContactDetails />
        </div>
        <div className="w-full lg:w-1/2">
          <FeedbackForm />
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Contact
