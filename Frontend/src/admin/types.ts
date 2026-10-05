export interface Project {
    id: string;
    title: string;
    description: string;
    techStack: string[];
    tags: string[];
    imageUrl: string;
    githubUrl: string;
    demoUrl: string;
    imageOnRight: boolean;
    sortOrder?: number;
}

export interface Achievement {
    id: string;
    title: string;
    date: string;
    overview: string;
    certificate: string | null;
}

export interface TechStack {
    id: string;
    name: string;
    category: string;
    proficiency: number;
    description: string;
    iconName: string;
}

export interface TimelineItem {
    id: string;
    title: string;
    date: string;
    description: string;
    type: 'EDUCATION' | 'HACKATHON' | 'WORK';
    remarks: string | null;
}
