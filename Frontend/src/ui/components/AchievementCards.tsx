import React from 'react';
import { Award, Calendar } from 'lucide-react';

// Define the achievement type
export type AchievementType = {
  id: number;
  title: string;
  date: string;
  overview: string;
};

// Format date to be more readable
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Individual achievement card component
interface AchievementCardProps {
  achievement: AchievementType;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col h-full border border-transparent hover:border-indigo-500/20">
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-white">{achievement.title}</h3>
          <Award className="h-6 w-6 text-indigo-500 flex-shrink-0 ml-2" />
        </div>
        <div className="flex items-center text-sm text-gray-300 mb-4">
          <Calendar className="h-4 w-4 mr-2 text-indigo-400" />
          {formatDate(achievement.date)}
        </div>
        <p className="text-sm text-gray-300 flex-grow">{achievement.overview}</p>
      </div>
    </div>
  );
};

export default AchievementCard;