import { ProjectImage } from "./ProjectImage";
import { ProjectInfo } from "./ProjectInfo";

interface ProjectDetailsProps {
  title: string;
  description: string;
  techStack: string[];
  tags: string[];
  imageUrl: string;
  githubUrl: string;
  demoUrl: string;
  imageOnRight?: boolean;
}

export function ProjectDetails({
  title,
  description,
  techStack,
  tags,
  imageUrl,
  githubUrl,
  demoUrl,
  imageOnRight = false,
}: ProjectDetailsProps) {
  return (
    <div className="w-400 min-h-100 mx-auto mb-12  overflow-hidden rounded-xl bg-gray-800 shadow-lg transition-all hover:shadow-xl">
      <div className="flex flex-col md:flex-row">
        {imageOnRight ? (
          <>
            <ProjectInfo title={title} description={description} techStack={techStack} tags={tags} demoUrl={demoUrl} />
            <ProjectImage imageUrl={imageUrl} githubUrl={githubUrl} />
          </>
        ) : (
          <>
            <ProjectImage imageUrl={imageUrl} githubUrl={githubUrl} />
            <ProjectInfo title={title} description={description} techStack={techStack} tags={tags} demoUrl={demoUrl} />
          </>
        )}
      </div>
    </div>
  );
}