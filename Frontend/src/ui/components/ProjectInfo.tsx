import { ExternalLink } from "lucide-react";

interface ProjectInfoProps {
  title: string;
  description: string;
  techStack: string[];
  tags: string[];
  demoUrl: string;
}

export function ProjectInfo({ title, description, techStack, tags, demoUrl }: ProjectInfoProps) {
  return (
    <div className="flex w-full flex-col justify-between p-6 md:w-3/5">
      <div>
        <h2 className="mb-3 text-2xl font-bold tracking-tight text-white">{title}</h2>
        <p className="mb-6 text-gray-300">{description}</p>

        <div className="mb-6">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-400">
            Tech Stack
          </h3>
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center rounded-md bg-gray-700 px-3 py-1 text-sm font-medium text-gray-200"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div className="mb-4">
          <a
            href={demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-lg bg-indigo-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-300"
          >
            Live Demo
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </div>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full bg-gray-700 px-2.5 py-0.5 text-xs font-medium text-gray-200"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}