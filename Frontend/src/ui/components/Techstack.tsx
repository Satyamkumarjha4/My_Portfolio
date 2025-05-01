import React from "react";

// Define TypeScript interfaces for our data structures
export interface TechStack {
  name: string;
  category: Category;
  icon: JSX.Element;
  proficiency: number;
  description: string;
}

// Use literal types for categories to ensure type safety
export type Category = 'Languages' | 'Frontend' | 'Frameworks' | 'Databases' | 'Data Science' | 'Tools';

// Define interface for category colors
export interface CategoryColorMap {
  [key in Category]: string;
}

// Color schemes for different categories
export const categoryColors: CategoryColorMap = {
  Languages: "bg-blue-100 border-blue-500 text-blue-700",
  Frontend: "bg-purple-100 border-purple-500 text-purple-700",
  Frameworks: "bg-green-100 border-green-500 text-green-700",
  Databases: "bg-red-100 border-red-500 text-red-700",
  "Data Science": "bg-yellow-100 border-yellow-500 text-yellow-700",
  Tools: "bg-indigo-100 border-indigo-500 text-indigo-700"
};

// Get icon color based on category
export const getCategoryIconColor = (category: Category): string => {
  switch (category) {
    case "Languages": return "text-blue-500";
    case "Frontend": return "text-purple-500";
    case "Frameworks": return "text-green-500";
    case "Databases": return "text-red-500";
    case "Data Science": return "text-yellow-500";
    case "Tools": return "text-indigo-500";
    default: return "text-gray-500";
  }
};

// Render proficiency bar
export const renderProficiencyBar = (proficiency: number): JSX.Element => {
  const getBarColor = (value: number): string => {
    if (value >= 90) return "bg-green-500";
    if (value >= 75) return "bg-blue-500";
    if (value >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="w-full h-3 bg-gray-200 rounded-full mt-2 overflow-hidden">
      <div 
        className={`h-full ${getBarColor(proficiency)} rounded-full`} 
        style={{ width: `${proficiency}%` }}
      ></div>
    </div>
  );
};

interface TechStackCardProps {
  tech: TechStack;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const TechStackCard: React.FC<TechStackCardProps> = ({ 
  tech, 
  isHovered, 
  onMouseEnter, 
  onMouseLeave 
}) => {
  // Extract color classes more safely
  const getColorClasses = (category: Category): { bg: string, border: string } => {
    const colorString = categoryColors[category];
    const parts = colorString.split(" ");
    return {
      bg: parts[0] || "bg-white",
      border: parts[1] || "border-gray-200"
    };
  };

  const colors = getColorClasses(tech.category);

  return (
    <div
      className={`flex-shrink-0 w-40 h-48 rounded-lg border-2 transition-all duration-300 ${
        isHovered 
          ? `${colors.bg} border-4 ${colors.border} shadow-lg transform -translate-y-1` 
          : "bg-white border-gray-200"
      }`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="p-4 flex flex-col items-center h-full">
        {/* Icon with category-based color */}
        <div className={`${getCategoryIconColor(tech.category)}`}>
          {tech.icon}
        </div>
        
        <h3 className="font-medium text-center mt-2">{tech.name}</h3>
        
        {/* Show proficiency and description on hover */}
        {isHovered && (
          <div className="mt-2 text-center">
            <p className="text-xs">{tech.proficiency}% Proficiency</p>
            {renderProficiencyBar(tech.proficiency)}
            <p className="text-xs mt-2 line-clamp-2">{tech.description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TechStackCard;