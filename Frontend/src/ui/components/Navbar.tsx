"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useLocation } from 'react-router-dom';
import Image from "../../../public/S.png"

const Navbar: React.FC = () => {
  const location = useLocation()
  const pathname = location.pathname
  const [visible, setVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [activeTab, setActiveTab] = useState("/")

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

  const navigateTo = (path: string) => {
    window.location.href = path
    setActiveTab(path)
  }

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/projects", label: "Projects" },
    { path: "/contact", label: "Contact" },
  ]

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 w-full flex justify-between items-center p-4 h-20 z-10"
        initial={{ y: -100 }}
        animate={{ y: visible ? 0 : -100 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <motion.div className="w-16 p-2" whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.9 }}>
          <img
            src={Image || "/placeholder.svg"}
            alt="logo"
            className="rounded-full mt-4 cursor-pointer"
            onClick={() => navigateTo("/")}
          />
        </motion.div>

        <motion.div
          className={`bg-gray-800 w-1/4 h-full rounded-full px-4 gap-10 shadow-lg`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <ul className="flex space-x-4 justify-center items-center justify-between h-full">
            {navItems.map((item) => (
              <motion.li
                key={item.path}
                onClick={() => navigateTo(item.path)}
                className={`text-white cursor-pointer text-lg p-2 relative ${
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
            ))}
          </ul>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <button className="bg-gray-800 text-white px-4 py-2 rounded-full hover:bg-gray-700 shadow-md">Admin</button>
        </motion.div>
      </motion.nav>
    </>
  )
}

export default Navbar
