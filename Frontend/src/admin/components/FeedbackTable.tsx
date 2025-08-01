import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { axiosInstance } from '../../ui/utils/axios';
import DeleteConfirmModal from './DeleteConfirmModal';
import { Trash2, Search, RefreshCw, Mail, User, Calendar, Star } from 'lucide-react';

interface Feedback {
    id: string;
    name: string;
    email: string;
    remark: string;
    rating: number;
    createdAt: string;
}

const FeedbackTable: React.FC = () => {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [selected, setSelected] = useState<string[]>([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchFeedbacks = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get('/feedback');
            setFeedbacks(res.data);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const refreshData = async () => {
        setIsRefreshing(true);
        await fetchFeedbacks();
        setTimeout(() => setIsRefreshing(false), 500);
    };

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const handleCheckbox = (id: string) => {
        setSelected(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selected.length === filteredFeedbacks.length) {
            setSelected([]);
        } else {
            setSelected(filteredFeedbacks.map(f => f.id));
        }
    };

    const handleDelete = async () => {
        try {
            await Promise.all(selected.map(id => axiosInstance.delete(`/feedback/${id}`)));
            setSelected([]);
            fetchFeedbacks();
        } catch (err) {
            console.error('Delete error:', err);
        }
    };

    const filteredFeedbacks = feedbacks.filter(feedback =>
        feedback.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.remark.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const truncateText = (text: string, maxLength: number) => {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    const formatDate = (dateString: string) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(dateString));
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`h-4 w-4 ${
                    i < rating ? 'text-yellow-400 fill-current' : 'text-gray-400'
                }`}
            />
        ));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-300">Loading feedback...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900 to-indigo-900/10" />
            
            <div className="relative z-10 container mx-auto px-6 py-8">
                {/* Header */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl font-bold text-white mb-2">
                        Feedback <span className="text-indigo-500">Management</span>
                    </h1>
                    <div className="w-16 h-1 bg-indigo-500 mb-4" />
                    <p className="text-gray-300">View and manage user feedback</p>
                </motion.div>

                {/* Controls */}
                <motion.div
                    className="mb-6 flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <div className="flex flex-wrap gap-3">
                        <motion.button
                            onClick={refreshData}
                            disabled={isRefreshing}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-all duration-200 disabled:opacity-50"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                            Refresh
                        </motion.button>

                        {selected.length > 0 && (
                            <motion.button
                                onClick={() => setShowDeleteModal(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <Trash2 className="h-4 w-4" />
                                Delete {selected.length > 1 ? `(${selected.length})` : ''}
                            </motion.button>
                        )}
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search feedback..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 w-64 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300"
                        />
                    </div>
                </motion.div>

                {/* Stats */}
                <motion.div
                    className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
                        <div className="text-2xl font-bold text-indigo-400">{feedbacks.length}</div>
                        <div className="text-gray-300 text-sm">Total Feedback</div>
                    </div>
                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
                        <div className="text-2xl font-bold text-emerald-400">{filteredFeedbacks.length}</div>
                        <div className="text-gray-300 text-sm">Visible Feedback</div>
                    </div>
                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
                        <div className="text-2xl font-bold text-purple-400">{selected.length}</div>
                        <div className="text-gray-300 text-sm">Selected</div>
                    </div>
                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
                        <div className="text-2xl font-bold text-yellow-400">
                            {feedbacks.length > 0 ? (feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length).toFixed(1) : '0.0'}
                        </div>
                        <div className="text-gray-300 text-sm">Average Rating</div>
                    </div>
                </motion.div>

                {/* Table */}
                <motion.div
                    className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-700/50 border-b border-gray-600/50">
                                <tr>
                                    <th className="px-6 py-4 text-left">
                                        <input
                                            type="checkbox"
                                            checked={selected.length === filteredFeedbacks.length && filteredFeedbacks.length > 0}
                                            onChange={handleSelectAll}
                                            className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500 focus:ring-2"
                                        />
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Message</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Rating</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700/50">
                                <AnimatePresence>
                                    {filteredFeedbacks.map((feedback, index) => (
                                        <motion.tr
                                            key={feedback.id}
                                            className="hover:bg-gray-700/25 transition-colors duration-200"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                        >
                                            <td className="px-6 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selected.includes(feedback.id)}
                                                    onChange={() => handleCheckbox(feedback.id)}
                                                    className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500 focus:ring-2"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4 text-gray-400" />
                                                    <div className="text-white font-medium">{feedback.name}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Mail className="h-4 w-4 text-gray-400" />
                                                    <div className="text-gray-300 text-sm">{feedback.email}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-gray-300 text-sm max-w-xs">
                                                    {truncateText(feedback.remark, 100)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1">
                                                    {renderStars(feedback.rating)}
                                                    <span className="text-gray-300 text-sm ml-2">
                                                        ({feedback.rating}/5)
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-gray-400" />
                                                    <div className="text-gray-300 text-sm">
                                                        {formatDate(feedback.createdAt)}
                                                    </div>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>

                        {filteredFeedbacks.length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-gray-400 text-lg mb-2">No feedback found</div>
                                <div className="text-gray-500 text-sm">
                                    {searchTerm ? 'Try adjusting your search terms' : 'No feedback submissions yet'}
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Delete Modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <DeleteConfirmModal
                        onCancel={() => setShowDeleteModal(false)}
                        onConfirm={() => {
                            handleDelete();
                            setShowDeleteModal(false);
                        }}
                        count={selected.length}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default FeedbackTable;