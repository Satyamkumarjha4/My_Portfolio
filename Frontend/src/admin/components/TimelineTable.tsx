import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { axiosInstance } from '../../ui/utils/axios';
import TimelineModal from './TimelineModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import { Plus, Edit3, Trash2, Search, RefreshCw, Calendar, BookOpen, Trophy, Briefcase, Clock } from 'lucide-react';

interface TimelineItem {
    id: string;
    title: string;
    date: string;
    description: string;
    type: 'EDUCATION' | 'HACKATHON' | 'WORK';
    remarks: string | null;
}

const TimelineTable: React.FC = () => {
    const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
    const [selected, setSelected] = useState<string[]>([]);
    const [showFormModal, setShowFormModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editItem, setEditItem] = useState<TimelineItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [filterType, setFilterType] = useState<'ALL' | 'EDUCATION' | 'HACKATHON' | 'WORK'>('ALL');

    const fetchTimelineItems = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get('/timeline');
            setTimelineItems(res.data);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const refreshData = async () => {
        setIsRefreshing(true);
        await fetchTimelineItems();
        setTimeout(() => setIsRefreshing(false), 500);
    };

    useEffect(() => {
        fetchTimelineItems();
    }, []);

    const handleCheckbox = (id: string) => {
        setSelected(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selected.length === filteredItems.length) {
            setSelected([]);
        } else {
            setSelected(filteredItems.map(item => item.id));
        }
    };

    const handleDelete = async () => {
        try {
            await Promise.all(selected.map(id => axiosInstance.delete(`/timeline/${id}`)));
            setSelected([]);
            fetchTimelineItems();
        } catch (err) {
            console.error('Delete error:', err);
        }
    };

    const filteredItems = timelineItems.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.date.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesType = filterType === 'ALL' || item.type === filterType;
        
        return matchesSearch && matchesType;
    });

    const selectedItem = timelineItems.find(item => item.id === selected[0]);

    const truncateText = (text: string, maxLength: number) => {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    const getTypeIcon = (type: TimelineItem['type']) => {
        switch (type) {
            case 'EDUCATION':
                return <BookOpen className="h-4 w-4" />;
            case 'HACKATHON':
                return <Trophy className="h-4 w-4" />;
            case 'WORK':
                return <Briefcase className="h-4 w-4" />;
            default:
                return <Calendar className="h-4 w-4" />;
        }
    };

    const getTypeColor = (type: TimelineItem['type']) => {
        switch (type) {
            case 'EDUCATION':
                return 'text-blue-300 bg-blue-500/20 border-blue-500/30';
            case 'HACKATHON':
                return 'text-yellow-300 bg-yellow-500/20 border-yellow-500/30';
            case 'WORK':
                return 'text-green-300 bg-green-500/20 border-green-500/30';
            default:
                return 'text-gray-300 bg-gray-500/20 border-gray-500/30';
        }
    };

    const getTypeCounts = () => {
        return {
            total: timelineItems.length,
            education: timelineItems.filter(item => item.type === 'EDUCATION').length,
            hackathon: timelineItems.filter(item => item.type === 'HACKATHON').length,
            work: timelineItems.filter(item => item.type === 'WORK').length,
        };
    };

    const typeCounts = getTypeCounts();

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-300">Loading timeline...</p>
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
                        Timeline <span className="text-indigo-500">Management</span>
                    </h1>
                    <div className="w-16 h-1 bg-indigo-500 mb-4" />
                    <p className="text-gray-300">Manage your professional timeline and milestones</p>
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
                            Add Timeline Item
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
                                    setEditItem(selectedItem || null);
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

                    {/* Search and Filter */}
                    <div className="flex gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search timeline..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 w-48 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300"
                            />
                        </div>
                        
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value as any)}
                            className="px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50"
                        >
                            <option value="ALL">All Types</option>
                            <option value="EDUCATION">Education</option>
                            <option value="HACKATHON">Hackathon</option>
                            <option value="WORK">Work</option>
                        </select>
                    </div>
                </motion.div>

                {/* Stats */}
                <motion.div
                    className="mb-6 grid grid-cols-2 md:grid-cols-5 gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
                        <div className="text-2xl font-bold text-indigo-400">{typeCounts.total}</div>
                        <div className="text-gray-300 text-sm">Total Items</div>
                    </div>
                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
                        <div className="text-2xl font-bold text-blue-400">{typeCounts.education}</div>
                        <div className="text-gray-300 text-sm">Education</div>
                    </div>
                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
                        <div className="text-2xl font-bold text-yellow-400">{typeCounts.hackathon}</div>
                        <div className="text-gray-300 text-sm">Hackathons</div>
                    </div>
                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
                        <div className="text-2xl font-bold text-green-400">{typeCounts.work}</div>
                        <div className="text-gray-300 text-sm">Work</div>
                    </div>
                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
                        <div className="text-2xl font-bold text-purple-400">{selected.length}</div>
                        <div className="text-gray-300 text-sm">Selected</div>
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
                                            checked={selected.length === filteredItems.length && filteredItems.length > 0}
                                            onChange={handleSelectAll}
                                            className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500 focus:ring-2"
                                        />
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Title</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Description</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Remarks</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700/50">
                                <AnimatePresence>
                                    {filteredItems.map((item, index) => (
                                        <motion.tr
                                            key={item.id}
                                            className="hover:bg-gray-700/25 transition-colors duration-200"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                        >
                                            <td className="px-6 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selected.includes(item.id)}
                                                    onChange={() => handleCheckbox(item.id)}
                                                    className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500 focus:ring-2"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-white font-medium">{item.title}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-gray-300">
                                                    <Clock className="h-4 w-4" />
                                                    {item.date}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm border ${getTypeColor(item.type)}`}>
                                                    {getTypeIcon(item.type)}
                                                    {item.type}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-gray-300 text-sm max-w-xs">
                                                    {truncateText(item.description, 100)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-gray-400 text-sm max-w-xs">
                                                    {item.remarks ? truncateText(item.remarks, 80) : '-'}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>

                        {filteredItems.length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-gray-400 text-lg mb-2">No timeline items found</div>
                                <div className="text-gray-500 text-sm">
                                    {searchTerm || filterType !== 'ALL' ? 'Try adjusting your search or filter' : 'Start by adding your first timeline item'}
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Modals */}
            <AnimatePresence>
                {showFormModal && (
                    <TimelineModal
                        onClose={() => {
                            setShowFormModal(false);
                            setEditItem(null);
                        }}
                        existingItem={editItem}
                        onSuccess={fetchTimelineItems}
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

export default TimelineTable;