import React from 'react';
import ProjectCard, { ProjectCardProps } from './ProjectCard';

// Interface for our project data
interface Project extends ProjectCardProps {}

const ProjectsShowcase: React.FC = () => {
  // Project data - you can modify these with your actual projects
  const projects: Project[] = [
    {
      title: "Car Price Prediction Web App",
      description: "A data-driven web application that predicts used car prices using ensemble models and CatBoost, with a Flask backend.",
      image: "/path/to/car-price-project.jpg",
      technologies: ["Flask", "Python", "CatBoost", "Render"],
    },
    {
      title: "Movie Buddy – Recommendation Engine",
      description: "Interactive movie recommender that uses NLP techniques and cosine similarity for personalized suggestions.",
      image: "/path/to/movie-project.jpg",
      technologies: ["Streamlit", "Pandas", "Scikit-learn", "TMDb API"],
    },
    {
      title: "Contact Manager Desktop App",
      description: "A full-featured desktop application to manage contacts using a GUI built with PyQt5 and SQLite as the backend database.",
      image: "/path/to/contact-manager.jpg",
      technologies: ["PyQt5", "SQLite", "Python", "PyQt Designer"],
    },
    {
      title: "Binge+ – Movie & Web Series Explorer",
      description: "A dynamic content discovery platform where users can explore movies and web series with filtering, search, and real-time metadata fetched from an external API.",
      image: "/path/to/bingeplus-project.jpg",
      technologies: ["HTML", "CSS", "JavaScript", "TMDb API"],
    }
  ];

  return (
    <div className="w-full min-h-screen bg-gray-900 px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Featured Projects</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">A collection of my most significant work showcasing my skills and experience in software development.</p>
        </div>
        
        {/* 3x2 Grid layout for projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard
              key={index}
              title={project.title}
              description={project.description}
              image={project.image}
              technologies={project.technologies}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsShowcase;