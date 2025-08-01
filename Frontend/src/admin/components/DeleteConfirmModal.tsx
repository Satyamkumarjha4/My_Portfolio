import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface Props {
    onCancel: () => void;
    onConfirm: () => void;
    count: number;
}

const DeleteConfirmModal: React.FC<Props> = ({ onCancel, onConfirm, count }) => {
    const modalVariants = {
        hidden: { opacity: 0, scale: 0.8, y: 50 },
        visible: { 
            opacity: 1, 
            scale: 1, 
            y: 0,
            transition: { 
                type: "spring",
                damping: 20,
                stiffness: 300
            }
        },
        exit: { 
            opacity: 0, 
            scale: 0.8, 
            y: 50,
            transition: { duration: 0.2 }
        }
    };

    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 }
    };

    const iconVariants = {
        hidden: { scale: 0, rotate: -180 },
        visible: { 
            scale: 1, 
            rotate: 0,
            transition: { 
                type: "spring",
                damping: 15,
                delay: 0.2
            }
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                variants={overlayVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                {/* Backdrop */}
                <motion.div
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onCancel}
                />

                {/* Modal */}
                <motion.div
                    className="relative w-full max-w-md"
                    variants={modalVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
                        {/* Header */}
                        <div className="relative bg-gradient-to-r from-red-500/10 to-red-600/5 p-6 border-b border-gray-700/50">
                            <button
                                onClick={onCancel}
                                className="absolute top-4 right-4 p-1 text-gray-400 hover:text-white transition-colors duration-200"
                            >
                                <X className="h-5 w-5" />
                            </button>
                            
                            <div className="flex flex-col items-center text-center">
                                <motion.div
                                    className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center border border-red-500/30 mb-4"
                                    variants={iconVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    <AlertTriangle className="h-8 w-8 text-red-400" />
                                </motion.div>
                                
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    Confirm Deletion
                                </h2>
                                
                                <div className="w-12 h-0.5 bg-red-500/50" />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <div className="text-center mb-6">
                                <p className="text-gray-300 text-lg mb-2">
                                    Are you sure you want to delete
                                </p>
                                <div className="flex items-center justify-center gap-2 mb-3">
                                    <span className="text-2xl font-bold text-red-400">
                                        {count}
                                    </span>
                                    <span className="text-xl text-white">
                                        {count === 1 ? 'item' : 'items'}?
                                    </span>
                                </div>
                                <p className="text-gray-400 text-sm">
                                    This action cannot be undone. All item data, including images, links, and descriptions will be permanently removed.
                                </p>
                            </div>

                            {/* Warning Box */}
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
                                <div className="flex items-center gap-2 text-red-400 text-sm">
                                    <AlertTriangle className="h-4 w-4" />
                                    <span className="font-medium">Warning: This action is permanent</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <motion.button
                                    onClick={onCancel}
                                    className="flex-1 px-4 py-3 bg-gray-700/50 border border-gray-600/50 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-all duration-200"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Cancel
                                </motion.button>
                                
                                <motion.button
                                    onClick={onConfirm}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Delete {count === 1 ? 'Project' : `${count} Projects`}
                                </motion.button>
                            </div>
                        </div>
                    </div>

                    {/* Glowing effect */}
                    <div className="absolute inset-0 -z-10 bg-red-500/20 rounded-2xl blur-xl opacity-20" />
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default DeleteConfirmModal;