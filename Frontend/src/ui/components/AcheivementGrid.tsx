import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Filter, ChevronDown, ChevronUp } from "lucide-react"
import AchievementCard, { type AchievementType } from "./AchievementCards"

// Sample achievement data
const achievementsData: AchievementType[] = [
  {
    id: 1,
    title: "Machine Learning – Internshala Certification",
    date: "2024-08-01",
    overview:
      "Completed certified training on supervised and unsupervised learning via Internshala, focusing on introduction to ML world.",
    certificate: "https://drive.google.com/file/d/12-ooGdY1TRg4mHjNx_UoGgIxX8iE7C_0/view?usp=drive_link",
  },
  {
    id: 2,
    title: "Programming with Python – Internshala Certification",
    date: "2024-07-10",
    overview:
      "Gained hands-on experience in core Python concepts and real-world applications through Internshala's certified program.",
    certificate: "https://drive.google.com/file/d/16jUid31uqQuA6RBvcLXuq0YjanL3sOzH/view?usp=drive_link",
  },
  {
    id: 3,
    title: "Prompt Engineering for GenAI – Internshala Certification",
    date: "2024-08-24",
    overview:
      "Learned prompt design strategies and GenAI applications/tools across domains like marketing, HR, and development. Scored 85%.",
    certificate: "https://drive.google.com/file/d/1_FPA1D7OGWrY1OX3YiLSqCJtEM8NPAMo/view?usp=drive_link",
  },
  {
    id: 4,
    title: "Introduction to Programming in C – NPTEL",
    date: "2024-09-01",
    overview:
      "Completed foundational course on C programming offered by IIT Kanpur via NPTEL, building a strong base in structured programming.",
    certificate: "https://drive.google.com/file/d/1BVWRNdD5gvHAS9xPm4eQvJ-zZElw5UYY/view?usp=drive_link",
  },
  {
    id: 5,
    title: "Data Structures and Algorithms using Python – NPTEL",
    date: "2024-10-01",
    overview:
      "Studied core data structures, algorithms, and problem-solving in Python through a comprehensive NPTEL course.",
    certificate: "https://drive.google.com/file/d/1r0cbmSkhULG79bB7xYFGULMjX7o_yo2R/view?usp=drive_link",
  },
  {
    id: 6,
    title: "Python for Data Science – NPTEL (Top 5% Toppers)",
    date: "2024-11-01",
    overview:
      "Explored data analysis, visualization, and scientific computing using Python. Recognized among top 5% performers.",
    certificate: "https://drive.google.com/file/d/1oZlciqTzt16UmPG7JvvR-qhJPWZizb0y/view?usp=drive_link",
  },
  {
    id: 7,
    title: "AI: Search Methods for Problem Solving – NPTEL",
    date: "2024-11-20",
    overview:
      "Learned fundamental AI concepts, including search techniques and strategies for solving complex problems.",
    certificate: "https://drive.google.com/file/d/14dbkGfkSKqVNEIDUztWLbzAeFTMx20Zk/view?usp=drive_link",
  },
  {
    id: 8,
    title: "Top Performer – Internship & Job Preparation Training",
    date: "2024-08-01",
    overview:
      "Achieved top performer recognition with 95% score in a 4-week certified course covering resumes, interviews, and job applications.",
    certificate: "",
  },
  {
    id: 9,
    title: "CBSE State Championship – Badminton (2019)",
    date: "2019-10-15",
    overview: "Represented the North Zone (Delhi) in the CBSE State Championship for Badminton at the school level.",
    certificate: "",
  },
  {
    id: 10,
    title: "Inter-Zonal Captain – Netball (Delhi)",
    date: "2019-12-01",
    overview:
      "Captained the zone netball team, led training and game strategies, and secured 2nd place out of 10 teams in Delhi's inter-zonal competition.",
    certificate: "",
  },
  {
    "id": 11,
    "title": "Data Analytics with Python – NPTEL (Certified by IIT Faculty)",
    "date": "2025-04-01",
    "overview": "Completed a 12-week IIT-led course on statistical thinking, hypothesis testing, regression, clustering, and data-driven modeling using Python. Strengthened practical and theoretical foundations for data science roles.",
    "certificate": "https://drive.google.com/file/d/1GDtmqL86zxJo6xv7fSumU4kDU0R6eiOb/view?usp=sharing"
  },
  {
    "id": 12,
    "title": "Web Development Training – Internshala",
    "date": "2025-05-17",
    "overview": "Completed an 8-week intensive training covering HTML, CSS, Bootstrap, DBMS, PHP, JavaScript, React, AI in Web Development, and a final hands-on project. Strengthened full-stack web development skills.",
    "certificate": "https://drive.google.com/file/d/1eXh0xAyFlxKaDyLPa-MgDgl-Siz3u52Y/view?usp=sharing"
  },
  {
  "id": 13,
  "title": "Getting Started with Competitive Programming – NPTEL",
  "date": "2025-04-30",
  "overview": "Completed a 12-week certified course offered by NPTEL, focused on core algorithmic techniques including sorting, searching, greedy algorithms, graph theory, disjoint set union, minimum spanning trees, shortest paths, network flows, and dynamic programming. Strengthened competitive programming skills in preparation for contests like ICPC and tech placements.",
  "certificate": "https://drive.google.com/file/d/1iqzEnV6_7J-9uQDTTd_ss4simWa1s1b5/view?usp=sharing"
}
  
]

interface AchievementGridProps {
  achievements?: AchievementType[]
  title?: string
  subtitle?: string
}

const AchievementGrid: React.FC<AchievementGridProps> = ({
  achievements = achievementsData,
  title = "My Certifications & Achievements",
  subtitle = "A showcase of my professional accomplishments and milestones",
}) => {
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")
  const [isFiltering, setIsFiltering] = useState(false)
  const [displayedAchievements, setDisplayedAchievements] = useState<AchievementType[]>([])

  // Sort achievements whenever sortOrder changes
  useEffect(() => {
    setIsFiltering(true)
    
    // Use setTimeout to create a visual transition effect
    const timer = setTimeout(() => {
      const sorted = [...achievements].sort((a, b) => {
        const dateA = new Date(a.date).getTime()
        const dateB = new Date(b.date).getTime()
        return sortOrder === "newest" ? dateB - dateA : dateA - dateB
      })
      
      setDisplayedAchievements(sorted)
      setIsFiltering(false)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [sortOrder, achievements])

  // Initialize displayedAchievements on first render
  useEffect(() => {
    const sorted = [...achievements].sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB
    })
    
    setDisplayedAchievements(sorted)
  }, [])

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "newest" ? "oldest" : "newest")
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-indigo-900/20 py-16" id="achievements">
      <div className="container mx-auto px-6">
        <motion.div
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <motion.h2
              className="text-5xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {title}
            </motion.h2>
            <motion.p
              className="text-lg text-gray-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {subtitle}
            </motion.p>
            <motion.span
              className="block h-1 w-20 bg-indigo-500 mt-4 rounded-full"
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: 80, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            />
          </div>

          <motion.div
            className="flex items-center mt-6 md:mt-0"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <motion.button
              className="flex items-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-full hover:bg-gray-700 transition duration-300 border border-transparent hover:border-indigo-500/20"
              onClick={toggleSortOrder}
              whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              disabled={isFiltering}
            >
              <Filter className="h-4 w-4" />
              Sort by: {sortOrder === "newest" ? "Newest First" : "Oldest First"}
              {sortOrder === "newest" ? (
                <ChevronDown className="h-4 w-4 ml-2" />
              ) : (
                <ChevronUp className="h-4 w-4 ml-2" />
              )}
            </motion.button>
          </motion.div>
        </motion.div>

        <AnimatePresence mode="wait">
          {!isFiltering && (
            <motion.div
              key={sortOrder}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {displayedAchievements.map((achievement) => (
                <motion.div key={achievement.id} variants={itemVariants}>
                  <AchievementCard achievement={achievement} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        
        {isFiltering && (
          <div className="flex justify-center items-center py-20">
            <motion.div 
              className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default AchievementGrid