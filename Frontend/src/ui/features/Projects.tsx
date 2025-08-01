import  React, {useState} from "react"
import { motion, useScroll, useSpring } from "framer-motion"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { ProjectDetails } from "../components/ProjectDetails"
import ProjectsHero from "../components/ProjectHero"
import ScrollToTopButton from "../components/ScrollToTopbutton"
import {axiosInstance} from "../utils/axios.ts"


interface Project {
  title: string;
  description: string;
  techStack: string[];
  tags: string[];
  imageUrl: string;
  githubUrl: string;
  demoUrl: string;
  imageOnRight: boolean;
}


const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })
  
  const dbprojects = async () => {
    try {
      const response = await axiosInstance.get("/projects");
      console.log("Projects fetched successfully:", response.data);
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
      return [];
    }
  }

  React.useEffect(() => {
    dbprojects();
  }, []);

  return (
    <motion.div
      className="bg-gray-900 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-indigo-500 z-50 origin-left" style={{ scaleX }} />
      <Navbar />

      <ProjectsHero />

      <div className="container mx-auto px-4 py-16 z-0 ">
        <motion.div
          className="mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-white text-center mb-4"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Featured Projects
          </motion.h2>
          <motion.div
            className="w-20 h-1 bg-indigo-500 mx-auto mb-8"
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          />
          <motion.p
            className="text-lg text-gray-300 text-center max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            A collection of my best work showcasing my technical skills and problem-solving abilities
          </motion.p>
        </motion.div>
        {projects.map((project, index) => (
          <ProjectDetails
            key={index}
            title={project.title}
            description={project.description}
            techStack={project.techStack}
            tags={project.tags}
            imageUrl={project.imageUrl}
            githubUrl={project.githubUrl}
            demoUrl={project.demoUrl}
            imageOnRight={project.imageOnRight}
            
          />
        ))}
      </div>

      <ScrollToTopButton />
      <Footer />
    </motion.div>
  )
}

export default Projects
