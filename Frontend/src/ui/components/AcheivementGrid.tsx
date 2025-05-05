import React, { useState } from 'react';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';
import AchievementCard, { type AchievementType } from './AchievementCards';

// Sample achievement data
const achievementsData: AchievementType[] = [
    {
        id: 1,
        title: "Top Performer – Internship & Job Preparation Training",
        date: "2024-08-01",
        overview:
          "Recognized as a top performer in a certified 4-week training program on job preparation, covering resume building, interviews, and personal branding.",
      },
      {
        id: 2,
        title: "Prompt Engineering Certification – GenAI",
        date: "2024-08-24",
        overview:
          "Earned certification with 85% score in Internshala's GenAI Prompt Engineering course, applying AI across domains including marketing, HR, and software development.",
      },
      {
        id: 3,
        title: "Research on KNN Optimization using SFLA",
        date: "2024-11-04",
        overview:
          "Published research on improving KNN accuracy from 85.70% to 87.42% using the Shuffled Frog Leaping Algorithm for feature selection optimization.",
      },
      {
        id: 4,
        title: "Hackathon Finalist – MAIT",
        date: "2024-03-12",
        overview:
          "Developed a hospital automation web platform during a college hackathon to streamline appointment booking and reduce wait times.",
      },
      {
        id: 5,
        title: "Car Price Predictor Project – CatBoost Model",
        date: "2025-04-02",
        overview:
          "Built and deployed a web app that predicts second-hand car prices with 91% accuracy using CatBoost and deployed it on Render.",
      },
      {
        id: 6,
        title: "100 Days of Code – GenAI & Full Stack Development",
        date: "2024-11-14",
        overview:
          "Successfully documented a 100-day challenge exploring prompt engineering, C++, and full-stack development via daily LinkedIn updates.",
      }
      
];

interface AchievementGridProps {
  achievements?: AchievementType[];
  title?: string;
  subtitle?: string;
}

const AchievementGrid: React.FC<AchievementGridProps> = ({
  achievements = achievementsData,
  title = "My Achievements",
  subtitle = "A showcase of my professional accomplishments and milestones"
}) => {
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  // Sort achievements based on date
  const sortedAchievements = [...achievements].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-900 py-16">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          <div>
            <h2 className="text-5xl font-bold text-white mb-4">{title}</h2>
            <p className="text-lg text-gray-300">{subtitle}</p>
            <span className="block h-1 w-20 bg-indigo-500 mt-4 rounded-full"></span>
          </div>

          <div className="flex items-center mt-6 md:mt-0">
            <button 
              className="flex items-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-full hover:bg-gray-700 transition duration-300 border border-transparent hover:border-indigo-500/20"
              onClick={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest")}
            >
              <Filter className="h-4 w-4" />
              Sort by: {sortOrder === "newest" ? "Newest First" : "Oldest First"}
              {sortOrder === "newest" ? <ChevronDown className="h-4 w-4 ml-2" /> : <ChevronUp className="h-4 w-4 ml-2" />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedAchievements.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AchievementGrid;