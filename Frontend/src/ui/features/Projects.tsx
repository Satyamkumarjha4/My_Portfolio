import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {ProjectDetails} from '../components/ProjectDetails';
import image from '/Screenshot From 2025-04-13 11-41-03.png';



const projects = [
    {
      title: "Car Price Prediction Web App",
      description: "A data-driven web application that predicts the price of used cars based on their features. It utilizes advanced machine learning models including CatBoost and ensemble techniques to provide accurate results. The backend is built using Flask, and the app is deployed on Render for easy accessibility. Users can input details like brand, model, year, mileage, and fuel type to get instant price estimates. The project emphasizes feature engineering, model optimization, and a clean user interface.",
      techStack: ["Flask", "Python", "CatBoost", "Render"],
      tags: ["Machine Learning", "Web App", "Regression", "Car Pricing"],
      imageUrl: image,
      githubUrl: "https://github.com/satyamkumarjha/car-price-predictor",
      demoUrl: "https://car-price-predictor-4aiw.onrender.com",
      imageOnRight: false
    },
    {
      title: "Movie Buddy – Recommendation Engine",
      description: "An interactive and personalized movie recommendation engine that leverages NLP techniques and cosine similarity to suggest movies based on user input. It uses metadata like genres, cast, and keywords to create a tag-based vector for each movie and generates recommendations accordingly. Built with Streamlit for a user-friendly interface, and integrated with the TMDb API to fetch real-time poster images and movie details. The project demonstrates the power of content-based filtering in recommendation systems.",
      techStack: ["Streamlit", "Pandas", "Scikit-learn", "TMDb API"],
      tags: ["NLP", "Recommender System", "Movie App", "Content-Based Filtering"],
      imageUrl: "/path/to/movie-project.jpg",
      githubUrl: "https://github.com/satyamkumarjha/movie-recommender",
      demoUrl: "https://moviebuddy-demo.vercel.app",
      imageOnRight: true
    },
    {
      title: "Contact Manager Desktop App",
      description: "A feature-rich desktop application designed to efficiently manage personal or professional contacts. Built with PyQt5 for the GUI and SQLite for persistent data storage, it supports creating, editing, searching, and deleting contact entries. The project follows object-oriented principles and includes a user-friendly interface designed with PyQt Designer. It is ideal for users who need an offline and organized way to handle their contact database, with emphasis on usability and clean design.",
      techStack: ["PyQt5", "SQLite", "Python", "PyQt Designer"],
      tags: ["Desktop App", "Contact Management", "GUI", "OOP"],
      imageUrl: "/path/to/contact-manager.jpg",
      githubUrl: "https://github.com/satyamkumarjha/contact-manager",
      demoUrl: "",
      imageOnRight: false
    },
    {
      title: "Binge+ – Movie & Web Series Explorer",
      description: "Binge+ is a dynamic content discovery platform that enables users to explore movies and web series interactively. It features real-time search, filtering by genres or ratings, and displays live metadata such as cast, plot summaries, and posters fetched via the TMDb API. Built using HTML, CSS, and JavaScript, this responsive website provides a seamless user experience and caters to entertainment enthusiasts looking for curated content. It’s designed to function as a lightweight and fast front-end application.",
      techStack: ["HTML", "CSS", "JavaScript", "TMDb API"],
      tags: ["Movie App", "Web Series", "Frontend", "API Integration"],
      imageUrl: "/path/to/bingeplus-project.jpg",
      githubUrl: "https://github.com/satyamkumarjha/bingeplus",
      demoUrl: "https://bingeplus-demo.vercel.app",
      imageOnRight: true
    }
  ];



const Projects: React.FC = () => {
    return (
        <>
            <div className='bg-gray-900'>
            <Navbar />
            <div className="flex flex-col items-center justify-center py-25 bg-gray-900">
                <h1 className="text-4xl font-bold text-white">Projects</h1>
                <p className="mt-4 text-lg text-gray-400">Explore my projects that showcase my skills and expertise.</p>
            </div>
            <div className='z-0'>
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
            
            

            <Footer />
            </div>
        </>
    );
};

export default Projects;