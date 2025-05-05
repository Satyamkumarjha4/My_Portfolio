import React, { useState } from 'react';

// Interface definitions
interface TechBadgeProps {
  label: string;
}

export interface ProjectCardProps {
  title: string;
  description: string;
  image?: string;
  technologies: string[];
}

// Tech badge component for displaying technologies used
const TechBadge: React.FC<TechBadgeProps> = ({ label }) => {
  return (
    <span className="bg-blue-900/30 text-indigo-300 text-sm px-3 py-1 rounded-md">
      {label}
    </span>
  );
};

// Individual project card component
const ProjectCard: React.FC<ProjectCardProps> = ({ 
  title, 
  description, 
  image, 
  technologies 
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  
  return (
    <div 
      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700 transition-all duration-300 h-full flex flex-col"
      style={{ transform: isHovered ? 'translateY(-5px)' : 'none' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Project Image */}
      <div className="h-48 overflow-hidden">
        <img 
          src={image || "/api/placeholder/600/400"} 
          alt={title}
          className="w-full h-full object-cover transition-all duration-500"
          style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
        />
      </div>
      
      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        
        {/* Description */}
        <p className="text-gray-300 text-sm mb-4 flex-1">{description}</p>
        
        {/* Technology Tags */}
        <div className="flex flex-wrap gap-2 mt-auto">
          {technologies.map((tech, index) => (
            <TechBadge key={index} label={tech} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;