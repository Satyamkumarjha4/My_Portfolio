import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardHeader from '../components/DashboardHeader';
import FeatureCard from '../components/FeatureCard';
import { Database, Clock, Code, Award, MessageSquare } from 'lucide-react';

const AdminDashboard: React.FC = () => {
    const location = useLocation();
    const { authAccess } = location.state || { authAccess: null };
    const navigate = useNavigate();

    useEffect(() => {
        if (authAccess !== "LetsGoo" || authAccess === null) {
            console.error("Unauthorized access");
            navigate('/admin/login');
        }
    }, [authAccess, navigate]);

    const features = [
        {
            title: "Projects",
            url: "/admin/table/projects",
            icon: Database,
            description: "Manage and showcase your portfolio projects",
            color: "indigo"
        },
        {
            title: "Timeline",
            url: "/admin/table/timeline",
            icon: Clock,
            description: "Update your professional journey timeline",
            color: "purple"
        },
        {
            title: "Tech Stack",
            url: "/admin/table/tech-stack",
            icon: Code,
            description: "Maintain your technical skills and tools",
            color: "blue"
        },
        {
            title: "Achievements",
            url: "/admin/table/achievements",
            icon: Award,
            description: "Highlight your accomplishments and awards",
            color: "emerald"
        },
        {
            title: "Feedback",
            url: "/admin/table/feedback",
            icon: MessageSquare,
            description: "Review and manage user feedback",
            color: "amber"
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.3,
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900 to-indigo-900/10" />
            
            {/* Animated particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-indigo-500/5 animate-pulse"
                        style={{
                            width: Math.random() * 60 + 30,
                            height: Math.random() * 60 + 30,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${Math.random() * 8 + 6}s`,
                        }}
                    />
                ))}
            </div>

            {/* Main Content */}
            <div className="relative z-10">
                <DashboardHeader />
                
                <motion.div
                    className="container mx-auto px-6 py-8"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Dashboard Title */}
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Portfolio <span className="text-indigo-500">Dashboard</span>
                        </h1>
                        <div className="w-16 h-1 bg-indigo-500 mx-auto mb-4" />
                        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                            Manage your portfolio content with ease. Update projects, timeline, skills, and more.
                        </p>
                    </motion.div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {features.map((feature, index) => (
                            <FeatureCard
                                key={feature.title}
                                title={feature.title}
                                url={feature.url}
                                icon={feature.icon}
                                description={feature.description}
                                color={feature.color}
                                index={index}
                            />
                        ))}
                    </div>

                    
                </motion.div>
            </div>

            {/* Ambient glow effect */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        </div>
    );
};

export default AdminDashboard;