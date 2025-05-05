import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Github } from 'lucide-react';

const ContactDetails: React.FC = () => {
    return (
        <div className="w-full min-h-screen bg-gray-900 flex flex-col items-start justify-center px-8 md:px-16 py-16">
            <div className="max-w-4xl">
                {/* Heading Section */}
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Let's Build Something Amazing!
                </h2>
                
                <p className="text-lg text-gray-300 mb-12 max-w-2xl">
                    Whether you have a project in mind or just want to connect, I'm always open to discussing new 
                    opportunities and ideas.
                </p>
                
                {/* Contact Information */}
                <div className="space-y-8 mb-12">
                    {/* Email */}
                    <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-blue-900/30 flex items-center justify-center mr-6">
                            <Mail className="text-indigo-400" size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-indigo-400">Email</h3>
                            <p className="text-white">satyamjha4@gmail.com</p>
                        </div>
                    </div>
                    
                    {/* Phone */}
                    <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-blue-900/30 flex items-center justify-center mr-6">
                            <Phone className="text-indigo-400" size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-indigo-400">Phone</h3>
                            <p className="text-white">+91 706-029-8070</p>
                        </div>
                    </div>
                    
                    {/* Location */}
                    <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-blue-900/30 flex items-center justify-center mr-6">
                            <MapPin className="text-indigo-400" size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-indigo-400">Location</h3>
                            <p className="text-white">Delhi, India</p>
                        </div>
                    </div>
                </div>
                
                {/* Social Links */}
                <div>
                    <h3 className="text-xl font-medium text-white mb-4">Follow Me</h3>
                    <div className="flex space-x-4">
                        <a href="www.linkedin.com/in/satyamkumarjha4" className="w-12 h-12 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition duration-300">
                            <Linkedin className="text-indigo-400" size={22} />
                        </a>
                        <a href="https://github.com/Satyamkumarjha4" className="w-12 h-12 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition duration-300">
                            <Github className="text-indigo-400" size={22} />
                        </a>
                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default ContactDetails;