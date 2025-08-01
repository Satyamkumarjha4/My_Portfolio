import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { safeAxiosInstance } from '../../ui/utils/axios';
import AchievementModal from './AchievementModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import { Plus, Edit3, Trash2, Search, RefreshCw, Award, Calendar, ExternalLink, FileText } from 'lucide-react';

interface Achievement {
    id: string;
    title: string;
    date: string;
    overview: string;
    certificate: string | null;
}

const AchievementsTable: React.FC = () => {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [selected, setSelected] = useState<string[]>([]);
    const [showFormModal, setShowFormModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editAchievement, setEditAchievement] = useState<Achievement | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchAchievements = async () => {
        try {
            setLoading(true);
            const res = await safeAxiosInstance.get('/achievements');
            setAchievements(res.data);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const refreshData = async () => {
        setIsRefreshing(true);
        await fetchAchievements();
        setTimeout(() => setIsRefreshing(false), 500);
    };

    useEffect(() => {
        fetchAchievements();
    }, []);

    const handleCheckbox = (id: string) => {
        setSelected(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selected.length === filteredAchievements.length) {
            setSelected([]);
        } else {
            setSelected(filteredAchievements.map(a => a.id));
        }
    };

    const handleDelete = async () => {
        try {
            await Promise.all(selected.map(id => safeAxiosInstance.delete(`/achievements/${id}`)));
            setSelected([]);
            fetchAchievements();
        } catch (err) {
            console.error('Delete error:', err);
        }
    };

    const filteredAchievements = achievements.filter(achievement =>
        achievement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        achievement.overview.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedAchievement = achievements.find(a => a.id === selected[0]);

    const truncateText = (text: string, maxLength: number) => {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-300">Loading achievements...</p>
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
                        Achievements <span className="text-indigo-500">Management</span>
                    </h1>
                    <div className="w-16 h-1 bg-indigo-500 mb-4" />
                    <p className="text-gray-300">Manage your professional achievements and certifications</p>
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
                            onClick={() => setShowFormModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all duration-200"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Plus className="h-4 w-4" />
                            Add Achievement
                        </motion.button>

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

                        {selected.length === 1 && (
                            <motion.button
                                onClick={() => {
                                    setEditAchievement(selectedAchievement || null);
                                    setShowFormModal(true);
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all duration-200"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <Edit3 className="h-4 w-4" />
                                Update
                            </motion.button>
                        )}

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
                            placeholder="Search achievements..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 w-64 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300"
                        />
                    </div>
                </motion.div>

                {/* Stats */}
                <motion.div
                    className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
                        <div className="text-2xl font-bold text-indigo-400">{achievements.length}</div>
                        <div className="text-gray-300 text-sm">Total Achievements</div>
                    </div>
                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
                        <div className="text-2xl font-bold text-emerald-400">{filteredAchievements.length}</div>
                        <div className="text-gray-300 text-sm">Visible Achievements</div>
                    </div>
                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
                        <div className="text-2xl font-bold text-purple-400">{achievements.filter(a => a.certificate).length}</div>
                        <div className="text-gray-300 text-sm">With Certificates</div>
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
                                            checked={selected.length === filteredAchievements.length && filteredAchievements.length > 0}
                                            onChange={handleSelectAll}
                                            className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500 focus:ring-2"
                                        />
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Title</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Overview</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Certificate</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700/50">
                                <AnimatePresence>
                                    {filteredAchievements.map((achievement, index) => (
                                        <motion.tr
                                            key={achievement.id}
                                            className="hover:bg-gray-700/25 transition-colors duration-200"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                        >
                                            <td className="px-6 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selected.includes(achievement.id)}
                                                    onChange={() => handleCheckbox(achievement.id)}
                                                    className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500 focus:ring-2"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <Award className="h-5 w-5 text-indigo-400 flex-shrink-0" />
                                                    <div className="text-white font-medium">{achievement.title}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-gray-300">
                                                    <Calendar className="h-4 w-4 text-gray-400" />
                                                    <span className="text-sm">{formatDate(achievement.date)}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-start gap-2">
                                                    <FileText className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                                                    <div className="text-gray-300 text-sm max-w-md">
                                                        {truncateText(achievement.overview, 120)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {achievement.certificate ? (
                                                        <a
                                                            href={achievement.certificate}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 text-sm rounded-full border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors duration-200"
                                                        >
                                                            <ExternalLink className="h-3 w-3" />
                                                            View Certificate
                                                        </a>
                                                    ) : (
                                                        <span className="px-3 py-1 bg-gray-600/50 text-gray-400 text-sm rounded-full">
                                                            No Certificate
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>

                        {filteredAchievements.length === 0 && (
                            <div className="text-center py-12">
                                <Award className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                                <div className="text-gray-400 text-lg mb-2">No achievements found</div>
                                <div className="text-gray-500 text-sm">
                                    {searchTerm ? 'Try adjusting your search terms' : 'Start by adding your first achievement'}
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Modals */}
            <AnimatePresence>
                {showFormModal && (
                    <AchievementModal
                        onClose={() => {
                            setShowFormModal(false);
                            setEditAchievement(null);
                            fetchAchievements();
                        }}
                        existingAchievement={editAchievement}
                    />
                )}

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

export default AchievementsTable;