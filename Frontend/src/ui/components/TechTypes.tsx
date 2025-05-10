// Define TypeScript interfaces for our data structures
export interface TechStack {
    name: string
    category: Category
    icon: any
    proficiency: number
    description: string
  }
    
  // Use literal types for categories to ensure type safety
  export type Category = "Languages" | "Frontend" | "Frameworks" | "Databases" | "Data Science" | "Tools"
    
  // Define interface for category colors
  export interface CategoryColorMap {
    [key in Category]: string
  }
    
  // Color schemes for different categories
  export const categoryColors: CategoryColorMap = {
    "Languages": "bg-blue-100 border-blue-500 text-blue-700",
    "Frontend": "bg-purple-100 border-purple-500 text-purple-700",
    "Frameworks": "bg-green-100 border-green-500 text-green-700",
    "Databases": "bg-red-100 border-red-500 text-red-700",
    "Data Science": "bg-yellow-100 border-yellow-500 text-yellow-700",
    "Tools": "bg-indigo-100 border-indigo-500 text-indigo-700",
  }
    
  // Get icon color based on category
  export const getCategoryIconColor = (category: Category): string => {
    switch (category) {
      case "Languages":
        return "text-blue-500"
      case "Frontend":
        return "text-purple-500"
      case "Frameworks":
        return "text-green-500"
      case "Databases":
        return "text-red-500"
      case "Data Science":
        return "text-yellow-500"
      case "Tools":
        return "text-indigo-500"
      default:
        return "text-gray-500"
    }
  }