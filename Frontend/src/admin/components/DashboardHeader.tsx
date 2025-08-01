import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, User, LogOut } from 'lucide-react';

const DashboardHeader: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear any auth state if needed
        navigate('/admin/login');
    };

    const navigateHome = () => {
        navigate('/');
    };

    return (
        <motion.header
            className="relative z-20 bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo/Brand */}
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center border border-indigo-500/30">
                            <User className="h-5 w-5 text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Admin Panel</h2>
                            <p className="text-sm text-gray-400">Portfolio Management</p>
                        </div>
                    </div>

                    {/* Navigation Actions */}
                    <div className="flex items-center space-x-4">
                        {/* Home Button */}
                        <motion.button
                            onClick={navigateHome}
                            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600/50 text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-200"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Home className="h-4 w-4" />
                            <span className="hidden sm:inline">Portfolio</span>
                        </motion.button>

                        {/* Logout Button */}
                        <motion.button
                            onClick={handleLogout}
                            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-all duration-200"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <LogOut className="h-4 w-4" />
                            <span className="hidden sm:inline">Logout</span>
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.header>
    );
};

export default DashboardHeader;