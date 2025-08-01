import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, LucideIcon } from 'lucide-react';

interface FeatureCardProps {
    title: string;
    url: string;
    icon: LucideIcon;
    description: string;
    color: string;
    index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
    title, 
    url, 
    icon: Icon, 
    description, 
    color, 
    index 
}) => {
    const navigate = useNavigate();

    const colorClasses = {
        indigo: {
            bg: 'from-indigo-500/10 to-indigo-600/5',
            border: 'border-indigo-500/20',
            icon: 'text-indigo-400',
            hover: 'hover:border-indigo-500/40',
            glow: 'hover:shadow-indigo-500/10'
        },
        purple: {
            bg: 'from-purple-500/10 to-purple-600/5',
            border: 'border-purple-500/20',
            icon: 'text-purple-400',
            hover: 'hover:border-purple-500/40',
            glow: 'hover:shadow-purple-500/10'
        },
        blue: {
            bg: 'from-blue-500/10 to-blue-600/5',
            border: 'border-blue-500/20',
            icon: 'text-blue-400',
            hover: 'hover:border-blue-500/40',
            glow: 'hover:shadow-blue-500/10'
        },
        emerald: {
            bg: 'from-emerald-500/10 to-emerald-600/5',
            border: 'border-emerald-500/20',
            icon: 'text-emerald-400',
            hover: 'hover:border-emerald-500/40',
            glow: 'hover:shadow-emerald-500/10'
        },
        amber: {
            bg: 'from-amber-500/10 to-amber-600/5',
            border: 'border-amber-500/20',
            icon: 'text-amber-400',
            hover: 'hover:border-amber-500/40',
            glow: 'hover:shadow-amber-500/10'
        }
    };

    const cardColors = colorClasses[color as keyof typeof colorClasses] || colorClasses.indigo;

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                delay: index * 0.1
            }
        }
    };

    const handleClick = () => {
        navigate(url, { state: { authAccess: "LetsGoo" } });
    };

    return (
        <motion.div
            variants={cardVariants}
            whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
            className="group relative"
        >
            <div
                className={`
                    relative overflow-hidden rounded-xl p-6 cursor-pointer
                    bg-gradient-to-br ${cardColors.bg}
                    backdrop-blur-sm border ${cardColors.border}
                    ${cardColors.hover} ${cardColors.glow}
                    hover:shadow-2xl
                    transition-all duration-300 ease-out
                    h-full min-h-[200px]
                `}
                onClick={handleClick}
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8">
                        <Icon className="w-full h-full" />
                    </div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full">
                    {/* Icon */}
                    <div className={`inline-flex p-3 rounded-lg bg-gray-800/50 border border-gray-700/50 w-fit mb-4`}>
                        <Icon className={`h-6 w-6 ${cardColors.icon}`} />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-white transition-colors">
                        {title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-300 text-sm leading-relaxed mb-4 flex-grow">
                        {description}
                    </p>

                    {/* Action Indicator */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-700/30">
                        <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">
                            Manage
                        </span>
                        <ChevronRight 
                            className={`h-5 w-5 ${cardColors.icon} transform group-hover:translate-x-1 transition-transform duration-200`} 
                        />
                    </div>
                </div>

                {/* Hover Glow Effect */}
                <div className={`
                    absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 
                    transition-opacity duration-300 pointer-events-none
                    bg-gradient-to-r ${cardColors.bg}
                `} />
            </div>
        </motion.div>
    );
};

export default FeatureCard;