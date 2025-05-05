import React from 'react';
import { TimelineCard, type TimelineItemType } from './TimelineCard';

// Sample data (replace with your own)
const sampleTimelineData: TimelineItemType[] = [
    {
        id: "1",
        title: "B.Tech in Computer Science & Engineering, MAIT Delhi",
        date: "2022 - 2026 (Expected)",
        description: "Pursuing Computer Science with a focus on AI, software development, and full-stack technologies.",
        type: "education",
        remarks: "Active in projects, hackathons, and technical training",
      },
      {
        id: "2",
        title: "AI/ML Intern, CodSoft",
        date: "August 2024",
        description:
          "Worked on AI-based projects including a Contact Manager app and Streamlit-based data apps. Gained hands-on experience with PyQt5, SQLite, and machine learning.",
        type: "work",
      },
      {
        id: "3",
        title: "Prompt Engineering for GenAI, Internshala",
        date: "July - August 2024",
        description:
          "Completed a certified training on Prompt Engineering. Explored GenAI use cases across domains such as HR, design, and marketing.",
        type: "education",
        remarks: "Scored 85% in the final assessment",
      },
      {
        id: "4",
        title: "Freelancer Recommendation System",
        date: "October 2024",
        description:
          "Developed a machine learning-based system to match freelancers to projects using cosine similarity on skill vectors.",
        type: "project",
      },
      {
        id: "5",
        title: "Tech Challenge – MAIT Hackathon",
        date: "March 2024",
        description:
          "Built a hospital automation system that streamlines patient registration and appointment management.",
        type: "hackathon",
        remarks: "Top 10 Finalist",
      },
      {
        id: "6",
        title: "Java & Systems Programming Coursework",
        date: "January - April 2025",
        description:
          "Covered multithreading, JDBC, socket programming, I/O streams, and RMI as part of advanced Java curriculum.",
        type: "education",
        remarks: "Preparing for advanced Java exam",
      }
      
];

// Main timeline component
interface TimelineProps {
  items?: TimelineItemType[];
  title?: string;
  className?: string;
}

const Timeline: React.FC<TimelineProps> = ({
  items = sampleTimelineData,
  title = "Academic & Professional Timeline",
  className = "",
}) => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-900 py-16">
      <div className={`container mx-auto ${className}`}>
        <h2 className="text-5xl font-bold text-white text-center mb-10 relative">
          {title}
          <span className="block h-1 w-20 bg-indigo-500 mx-auto mt-4 rounded-full"></span>
        </h2>
        
        <div className="relative wrap overflow-hidden p-4 md:p-10 h-full">
          {/* Vertical line with styling to match Hero component */}
          <div className="absolute border-opacity-20 border-indigo-500 h-full border-2 left-1/2 transform -translate-x-1/2">
            <div className="absolute h-1/6 bg-gradient-to-b from-gray-900 to-indigo-500/20 w-full top-0 opacity-75"></div>
            <div className="absolute h-1/6 bg-gradient-to-t from-gray-900 to-indigo-500/20 w-full bottom-0 opacity-75"></div>
          </div>

          {/* Timeline items */}
          {items.map((item, index) => (
            <TimelineCard key={item.id} item={item} isLeft={index % 2 === 0} />
          ))}
        </div>

      </div>
    </div>
  );
};

export default Timeline;