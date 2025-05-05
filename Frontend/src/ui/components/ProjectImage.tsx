import { Github } from "lucide-react";

interface ProjectImageProps {
  imageUrl: string;
  githubUrl: string;
}

export function ProjectImage({ imageUrl, githubUrl }: ProjectImageProps) {
  return (
    <div className="relative h-64 w-full md:h-auto md:w-2/5 p-4">
      <div className="group relative h-full w-full overflow-hidden rounded-md">
        <img
          src={imageUrl}
          alt="Project thumbnail"
          className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
        />
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/90 shadow-md transition-all hover:bg-indigo-600 hover:shadow-lg"
          aria-label="View GitHub repository"
        >
          <Github className="h-5 w-5 text-white" />
        </a>
      </div>
    </div>
  );
}