import React, { useState, ChangeEvent } from 'react';
import { Star, Send, CheckCircle } from 'lucide-react';

interface FormData {
  email: string;
  name: string;
  rating: number;
  remark: string;
}

interface FormErrors {
  email?: string;
  name?: string;
  rating?: string;
}

const FeedbackForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    name: '',
    rating: 0,
    remark: ''
  });
  
  const [hoveredStar, setHoveredStar] = useState<number>(0);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleStarClick = (rating: number): void => {
    setFormData({
      ...formData,
      rating
    });
    
    // Clear rating error if present
    if (errors.rating) {
      setErrors({
        ...errors,
        rating: ''
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.name) {
      newErrors.name = 'Name is required';
    }
    
    if (formData.rating === 0) {
      newErrors.rating = 'Please select a rating';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (): void => {
    if (validateForm()) {
      console.log('Form submitted:', formData);
      // Here you would typically send the data to your backend
      
      // Show success message
      setIsSubmitted(true);
      
      // Reset form after submission
      setTimeout(() => {
        setFormData({
          email: '',
          name: '',
          rating: 0,
          remark: ''
        });
        setIsSubmitted(false);
      }, 3000);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-900 flex items-center justify-center px-2 py-16">
      <div className="max-w-md w-full p-8 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
        <h2 className="text-3xl font-bold text-center text-white mb-8">Portfolio Feedback</h2>
        
        {isSubmitted ? (
          <div className="bg-indigo-900/50 border border-indigo-500 text-indigo-200 px-4 py-4 rounded-lg mb-4 flex items-center">
            <CheckCircle className="mr-3 text-indigo-400" size={24} />
            <div>
              <strong className="font-bold text-indigo-300">Thank you!</strong>
              <span className="block text-indigo-200"> Your feedback has been submitted successfully.</span>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-300 text-sm font-medium mb-2">
                Email ID*
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 text-white ${
                  errors.email ? 'border-red-500 focus:ring-red-400' : 'border-gray-600 focus:ring-indigo-500'
                }`}
                placeholder="your.email@example.com"
              />
              {errors.email && <p className="text-red-400 text-xs mt-2">{errors.email}</p>}
            </div>
            
            <div className="mb-6">
              <label htmlFor="name" className="block text-gray-300 text-sm font-medium mb-2">
                Name*
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 text-white ${
                  errors.name ? 'border-red-500 focus:ring-red-400' : 'border-gray-600 focus:ring-indigo-500'
                }`}
                placeholder="Your Name"
              />
              {errors.name && <p className="text-red-400 text-xs mt-2">{errors.name}</p>}
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Rating*
              </label>
              <div className="flex space-x-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={30}
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    fill={(hoveredStar >= star || formData.rating >= star) ? "#6366F1" : "none"}
                    color={(hoveredStar >= star || formData.rating >= star) ? "#6366F1" : "#6B7280"}
                    className="cursor-pointer transition-colors duration-200"
                  />
                ))}
              </div>
              {errors.rating && <p className="text-red-400 text-xs mt-2">{errors.rating}</p>}
            </div>
            
            <div className="mb-8">
              <label htmlFor="remark" className="block text-gray-300 text-sm font-medium mb-2">
                Remarks
              </label>
              <textarea
                id="remark"
                name="remark"
                value={formData.remark}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                placeholder="Share your thoughts about my portfolio..."
              />
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-3 px-8 rounded-full flex items-center transition duration-300"
              >
                <span className="mr-2">Submit Feedback</span>
                <Send size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackForm;