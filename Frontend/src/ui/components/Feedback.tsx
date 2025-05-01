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
    <div className="max-w-md mx-auto mt-24 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Portfolio Feedback</h2>
      
      {isSubmitted ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 flex items-center">
          <CheckCircle className="mr-2" size={20} />
          <div>
            <strong className="font-bold">Thank you!</strong>
            <span className="block"> Your feedback has been submitted successfully.</span>
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Email ID*
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-gray-200'
              }`}
              placeholder="your.email@example.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
              Name*
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-gray-200'
              }`}
              placeholder="Your Name"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Rating*
            </label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={28}
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  fill={(hoveredStar >= star || formData.rating >= star) ? "#FFD700" : "none"}
                  color={(hoveredStar >= star || formData.rating >= star) ? "#FFD700" : "#CBD5E0"}
                  className="cursor-pointer transition-colors duration-200"
                />
              ))}
            </div>
            {errors.rating && <p className="text-red-500 text-xs mt-1">{errors.rating}</p>}
          </div>
          
          <div className="mb-6">
            <label htmlFor="remark" className="block text-gray-700 text-sm font-bold mb-2">
              Remarks
            </label>
            <textarea
              id="remark"
              name="remark"
              value={formData.remark}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
              placeholder="Share your thoughts about my portfolio..."
            />
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-full flex items-center transition duration-300"
            >
              <span className="mr-2">Submit Feedback</span>
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackForm;