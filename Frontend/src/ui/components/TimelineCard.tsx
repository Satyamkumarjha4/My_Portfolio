import React from 'react';
import { GraduationCap, Briefcase, Code, Award, CalendarDays } from 'lucide-react';

// Define the type for a timeline item
export type TimelineItemType = {
  id: string;
  title: string;
  date: string;
  description: string;
  type: "education" | "work" | "hackathon" | "achievement";
  remarks?: string;
};

// Icon component to display different icons based on the type
const TypeIcon: React.FC<{ type: TimelineItemType["type"] }> = ({ type }) => {
  switch (type) {
    case "education":
      return <GraduationCap className="h-4 w-4 text-white" />;
    case "work":
      return <Briefcase className="h-4 w-4 text-white" />;
    case "hackathon":
      return <Code className="h-4 w-4 text-white" />;
    case "achievement":
      return <Award className="h-4 w-4 text-white" />;
    default:
      return <CalendarDays className="h-4 w-4 text-white" />;
  }
};

// Individual timeline card component
interface TimelineCardProps {
  item: TimelineItemType;
  isLeft: boolean;
}

export const TimelineCard: React.FC<TimelineCardProps> = ({ item, isLeft }) => {
  return (
    <div className={`mb-8 flex justify-between items-center w-full ${isLeft ? 'flex-row-reverse' : ''}`}>
      <div className="order-1 w-5/12"></div>
      <div className="z-20 flex items-center order-1 bg-indigo-500 shadow-xl w-8 h-8 rounded-full">
        <div className="mx-auto text-white">
          <TypeIcon type={item.type} />
        </div>
      </div>
      <div
        className={`
          order-1 bg-gray-800 rounded-lg shadow-md w-5/12 px-6 py-4 border border-transparent
          transition-all duration-300 ease-in-out
          hover:shadow-xl hover:scale-105 hover:border-indigo-500/20
          ${isLeft ? 'items-end' : 'items-start'}`
        }
      >
        <h3 className="font-bold text-lg text-white group-hover:text-indigo-500 transition-colors">{item.title}</h3>
        <div className="flex items-center text-sm text-gray-300 mb-2">
          <CalendarDays className="mr-1 h-4 w-4 text-indigo-400" />
          {item.date}
        </div>
        <p className="text-sm leading-snug tracking-wide text-gray-300">{item.description}</p>
        {item.remarks && (
          <div className="mt-2 flex items-center">
            <Award className="mr-1 h-4 w-4 text-indigo-400" />
            <p className="text-sm italic text-indigo-400">{item.remarks}</p>
          </div>
        )}
      </div>
    </div>
  );
};