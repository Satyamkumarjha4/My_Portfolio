import React from 'react';
import ProjectLite from './ProjectLite';

interface Props {
    title:string;
    description:string;
    stack:string[];
    image:string;
    id:number;
    project:string[];
}

const project = [
    {
      id: 1,
      title: "Project 1",
      description: "A detailed description of the project, its purpose, and the problem it solves.",
      image: "/placeholder.svg?height=300&width=600",
      technologies: ["React", "Next.js", "Tailwind CSS"],
      github: "https://github.com",
      liveLink: "https://example.com",
      preview: "Brief overview of the project highlighting key features and functionality.",
    },
    {
      id: 2,
      title: "Project 2",
      description: "A detailed description of the project, its purpose, and the problem it solves.",
      image: "/placeholder.svg?height=300&width=600",
      technologies: ["TypeScript", "Node.js", "PostgreSQL"],
      github: "https://github.com",
      liveLink: "https://example.com",
      preview: "Brief overview of the project highlighting key features and functionality.",
    },
    {
      id: 3,
      title: "Project 3",
      description: "A detailed description of the project, its purpose, and the problem it solves.",
      image: "/placeholder.svg?height=300&width=600",
      technologies: ["Express", "MongoDB", "GraphQL"],
      github: "https://github.com",
      liveLink: "https://example.com",
      preview: "Brief overview of the project highlighting key features and functionality.",
    },
  ]


const Project_Cor: React.FC<Props> = () => {
    return (
        <>
        <div className='flex flex-wrap gap-4'>
            {project.map((project) => (
                <ProjectLite key={project.id} title={project.title} description={project.description} stack={project.technologies} />
            ))}
        </div>
        </>
    );
};

export default Project_Cor;