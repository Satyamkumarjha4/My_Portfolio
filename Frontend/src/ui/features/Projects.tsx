import type React from "react"
import { motion, useScroll, useSpring } from "framer-motion"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { ProjectDetails } from "../components/ProjectDetails"
import ProjectsHero from "../components/ProjectHero"
import ScrollToTopButton from "../components/ScrollToTopbutton"



const projects = [
  {
    title: "Movie Buddy – Recommendation Engine",
    description:
      "An interactive and personalized movie recommendation engine that leverages NLP techniques and cosine similarity to suggest movies based on user input. It uses metadata like genres, cast, and keywords to create a tag-based vector for each movie and generates recommendations accordingly. Built with Streamlit for a user-friendly interface, and integrated with the TMDb API to fetch real-time poster images and movie details. The project demonstrates the power of content-based filtering in recommendation systems.",
    techStack: ["Streamlit", "Pandas", "Scikit-learn", "TMDb API","Python", "NLTK", "Kaggle"],
    tags: ["NLP", "Recommender System", "Movie App", "Content-Based Filtering", "Cosine Similarity", "Streamlit App", "Machine Learning", "Data Science", "User Personalization", "Python Project", "Metadata Extraction"],
    imageUrl: "/project_images/movie_recomendation_system.png",
    githubUrl: "https://github.com/Satyamkumarjha4/Movie_Recomendation_System",
    demoUrl: "https://movie-recomendation-system-skj.streamlit.app/",
    imageOnRight: true,
  },
  {
    title: "Car Price Prediction Web App",
    description:
      "A data-driven web application that predicts the price of used cars based on their features. It utilizes advanced machine learning models including CatBoost and ensemble techniques to provide accurate results. The backend is built using Flask, and the app is deployed on Render for easy accessibility. Users can input details like engine type, year, mileage, fuel type, etc to get instant price estimates. The project emphasizes feature engineering, model optimization, and a clean user interface.",
      tags: ["Machine Learning", "Regression", "Car Pricing", "Model Deployment", "Flask App", "Feature Engineering", "Data Analysis", "Hyperparameter Tuning", "Python Project", "Scikit-learn", "Render"],
    techStack: ["Flask", "Python", "CatBoost", "Render","HTML", "CSS","JavaScript","Pandas","NumPy","Scikit-learn", "Kaggle", "Matplotlib","Seaborn"],
    imageUrl: "/project_images/car_prediction.png",
    githubUrl: "https://github.com/Satyamkumarjha4/Car_Price_Predictor",
    demoUrl: "https://car-price-predictor-4aiw.onrender.com",
    imageOnRight: false,
  },
  {
    title: "Binge+ – Movie & Web Series Explorer",
    description:
      "Binge+ is a dynamic content discovery platform that enables users to explore movies and web series interactively. It features real-time search, filtering by genres or ratings, and displays live metadata such as cast, plot summaries, and posters fetched via the MongoDB Database. This responsive website provides a seamless user experience and caters to entertainment enthusiasts looking for curated content. It's designed to function as a lightweight and fast full-stack application.",
    techStack: ["HTML", "CSS", "JavaScript", "MongoDB", "Express.js", "Node.js", "Mongoose"],
    tags: ["Full-Stack", "MERN", "Entertainment App", "Movie Database", "Dynamic Search", "Filtering", "MongoDB", "REST API", "Web Development", "Responsive Design", "JavaScript Project"],
    imageUrl: "/project_images/Binge.png",
    githubUrl: "https://github.com/binge-plus",
    demoUrl: "https://bit.ly/binge-movies-",
    imageOnRight: true,
  },
  {
    title: "Tic-Tac-Toe Game with AI",
    description:
      "An interactive web-based Tic-Tac-Toe game where players compete against an AI opponent. Built using Streamlit for a simple interface, the game includes three difficulty levels: easy (random AI), medium (blocking strategy), and hard (min-max algorithm). The app uses Python for game logic and ensures smooth gameplay with dynamic board rendering, game state tracking, and replay functionality. It demonstrates efficient use of session state, conditional rendering, and UI interactivity within Streamlit.",
    techStack: ["Streamlit", "Python"],
    tags: [
      "Game", "AI", "Tic-Tac-Toe", "Streamlit", "Python Project", 
      "Interactive UI", "Mini Project", "Game Logic", "Session State", 
      "Turn-Based Game", "Game Theory", "Min-Max Algorithm"
    ],
    imageUrl: "/project_images/tic-tac-toe.png",
    githubUrl: "https://github.com/Satyamkumarjha4/AI_Projects/blob/main/tic-tac.py",
    demoUrl: "https://minmax-tic-tac-toe.streamlit.app/",
    imageOnRight: false
  },  
  {
    title: "Contact Manager Desktop App",
    description:
      "A feature-rich desktop application designed to efficiently manage personal or professional contacts. Built with PyQt5 for the GUI and SQLite for persistent data storage, it supports creating, editing, searching, and deleting contact entries. The project follows object-oriented principles and includes a user-friendly interface designed with PyQt Designer. It is ideal for users who need an offline and organized way to handle their contact database, with emphasis on usability and clean design.",
    techStack: ["SQLite", "Python", "Streamlit"],
    tags: [
      "Desktop App", "Contact Management", "OOP", "PyQt5", 
      "SQLite", "GUI", "Python Project", "Streamlit", 
      "Form-based Application", "CRUD Operations"
    ],
    imageUrl: "/project_images/contact_management.png",
    githubUrl: "https://github.com/Satyamkumarjha4/CodSoft/blob/main/STcontact.py",
    demoUrl: "https://stcontactpy-edcajvvka5wklxn9rq7bcm.streamlit.app/",
    imageOnRight: true
  }  
];


const Projects: React.FC = () => {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

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
