"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link, useLocation } from "react-router-dom"
import Image from "../../../public/S.png"
import { Menu, X } from "lucide-react"

const Navbar: React.FC = () => {
  const location = useLocation()
  const pathname = location.pathname
  const [visible, setVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [activeTab, setActiveTab] = useState("/")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    // Set active tab based on current path
    setActiveTab(pathname)
  }, [pathname])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Show navbar when at the top or scrolling up
      if (currentScrollY <= 0) {
        setVisible(true)
      }
      // Hide when scrolling down
      else if (currentScrollY > lastScrollY) {
        setVisible(false)
      }
      // Show when scrolling up
      else {
        setVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [lastScrollY])

  useEffect(() => {
    // Close mobile menu when screen size changes to desktop
    const handleResize = () => {
      if (window.innerWidth > 760 && mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [mobileMenuOpen])

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [mobileMenuOpen])

  const navigateTo = (path: string) => {
    window.location.href = path
    setActiveTab(path)
    setMobileMenuOpen(false)
  }

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/projects", label: "Projects" },
    { path: "/contact", label: "Contact" },
  ]

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 w-full flex justify-between items-center p-2 md:p-4 h-16 md:h-20 z-11"
        initial={{ y: -100 }}
        animate={{ y: visible ? 0 : -100 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <motion.div className="w-12 md:w-16 p-2" whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.9 }}>
          <img
            src={Image || "/placeholder.svg"}
            alt="logo"
            className="rounded-full mt-4 cursor-pointer"
            onClick={() => navigateTo("/")}
          />
        </motion.div>

        {/* Desktop Navigation - Hidden on mobile */}
        <motion.div
          className={`bg-gray-800 w-auto h-full rounded-full px-2 md:px-4 gap-2 md:gap-10 shadow-lg hidden md:block`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <ul className="flex space-x-1 md:space-x-4 justify-center items-center justify-between h-full">
            {navItems.map((item, index) => (
              <Link to={item.label === "Home" ? "/" : `/${item.label.toLowerCase()}`} key={index}>
                <motion.li
                  key={item.path}
                  onClick={() => navigateTo(item.path)}
                  className={`text-white cursor-pointer text-sm md:text-lg p-1 md:p-2 relative ${
                    activeTab === item.path ? "font-medium" : ""
                  }`}
                  whileHover={{ backgroundColor: "rgba(75, 85, 99, 0.5)", borderRadius: "9999px" }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.label}
                  {activeTab === item.path && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                      layoutId="underline"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.li>
              </Link>
            ))}
          </ul>
        </motion.div>

        {/* Admin Button - Hidden on mobile */}
        <Link to="/info">
          <motion.div className="hidden md:block" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <button className="bg-gray-800 text-white px-3 py-1 md:px-4 md:py-2 text-sm md:text-base rounded-full hover:bg-gray-700 shadow-md">
              Info
            </button>
          </motion.div>
        </Link>

        {/* Hamburger Menu Button - Visible only on mobile */}
        <motion.button
          className="md:hidden p-2 bg-gray-800 rounded-full text-white z-20"
          onClick={toggleMobileMenu}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="fixed top-0 right-0 h-full w-64 bg-gray-900 z-10 shadow-lg flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="flex justify-end p-4">
                <motion.button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Close menu"
                >
                  <X size={24} />
                </motion.button>
              </div>

              <div className="flex flex-col items-center mt-8">
                <motion.div className="w-16 h-16 mb-6" whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.9 }}>
                  <img
                    src={Image || "/placeholder.svg"}
                    alt="logo"
                    className="rounded-full cursor-pointer"
                    onClick={() => navigateTo("/")}
                  />
                </motion.div>

                <nav className="w-full">
                  <ul className="flex flex-col items-center space-y-4 w-full">
                    {navItems.map((item, index) => (
                      <motion.li
                        key={item.path}
                        className="w-full"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          to={item.label === "Home" ? "/" : `/${item.label.toLowerCase()}`}
                          className="w-full"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <motion.div
                            className={`text-white text-lg py-2 px-6 w-full text-center ${
                              activeTab === item.path ? "bg-gray-800 font-medium" : "hover:bg-gray-800/50"
                            } rounded-md transition-colors`}
                            whileHover={{ x: 5 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigateTo(item.path)}
                          >
                            {item.label}
                          </motion.div>
                        </Link>
                      </motion.li>
                    ))}

                    {/* Admin Button in Mobile Menu */}
                    <motion.li
                      className="w-full mt-4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: navItems.length * 0.1 }}
                    >
                      <motion.button
                        className="bg-gray-800 text-white py-2 px-6 rounded-md w-full hover:bg-gray-700 shadow-md"
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Info
                      </motion.button>
                    </motion.li>
                  </ul>
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  )
}

export default Navbar
