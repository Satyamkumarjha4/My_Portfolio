import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { axiosInstance } from '../../ui/utils/axios';
import TechStackModal from './TechStackModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import { Plus, Edit3, Trash2, Search, RefreshCw, Code, Layers } from 'lucide-react';

interface TechStack {
    id: string;
    name: string;
    category: string;
    proficiency: number;
    description: string;
    iconName: string;
}

const TechStackTable: React.FC = () => {
    const [techStacks, setTechStacks] = useState<TechStack[]>([]);
    const [selected, setSelected] = useState<string[]>([]);
    const [showFormModal, setShowFormModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editTechStack, setEditTechStack] = useState<TechStack | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = [
        'All',
        'Languages',
        'Frontend',
        'Python_Frameworks',
        'Databases',
        'Data_Science',
        'Tools'
    ];



    const fetchTechStacks = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get('/tech-stacks');
            setTechStacks(res.data);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const refreshData = async () => {
        setIsRefreshing(true);
        await fetchTechStacks();
        setTimeout(() => setIsRefreshing(false), 500);
    };

    useEffect(() => {
        fetchTechStacks();
    }, []);

    const handleCheckbox = (id: string) => {
        setSelected(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selected.length === filteredTechStacks.length) {
            setSelected([]);
        } else {
            setSelected(filteredTechStacks.map(t => t.id));
        }
    };

    const handleDelete = async () => {
        try {
            await Promise.all(selected.map(id => axiosInstance.delete(`/tech-stacks/${id}`)));
            setSelected([]);
            fetchTechStacks();
        } catch (err) {
            console.error('Delete error:', err);
        }
    };

    const filteredTechStacks = techStacks.filter(techStack => {
        const matchesSearch = techStack.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            techStack.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            techStack.category.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesCategory = selectedCategory === 'All' || techStack.category === selectedCategory;
        
        return matchesSearch && matchesCategory;
    });

    const selectedTechStack = techStacks.find(t => t.id === selected[0]);

    const formatCategoryName = (category: string) => {
        return category.replace(/_/g, ' ');
    };

    const getProficiencyLabel = (proficiency: number) => {
        const ranges = [
            { min: 0, max: 5, label: 'No Experience' },
            { min: 6, max: 15, label: 'Just Started' },
            { min: 16, max: 25, label: 'Basic Understanding' },
            { min: 26, max: 35, label: 'Some Practice' },
            { min: 36, max: 45, label: 'Comfortable' },
            { min: 46, max: 55, label: 'Intermediate' },
            { min: 56, max: 65, label: 'Good Knowledge' },
            { min: 66, max: 75, label: 'Advanced' },
            { min: 76, max: 85, label: 'Very Advanced' },
            { min: 86, max: 95, label: 'Expert Level' },
            { min: 96, max: 100, label: 'Master' }
        ];
        
        const range = ranges.find(r => proficiency >= r.min && proficiency <= r.max);
        return range ? range.label : 'Unknown';
    };

    const getProficiencyColor = (proficiency: number) => {
        if (proficiency === 0) return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
        if (proficiency <= 25) return 'bg-red-500/20 text-red-300 border-red-500/30';
        if (proficiency <= 45) return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
        if (proficiency <= 65) return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
        if (proficiency <= 85) return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
        return 'bg-green-500/20 text-green-300 border-green-500/30';
    };

    const truncateText = (text: string, maxLength: number) => {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    const renderProficiencyBar = (proficiency: number) => {
        return (
            <div className="w-20 bg-gray-600 rounded-full h-2">
                <div 
                    className="bg-indigo-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${proficiency}%` }}
                />
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-300">Loading tech stack...</p>
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
                        Tech Stack <span className="text-indigo-500">Management</span>
                    </h1>
                    <div className="w-16 h-1 bg-indigo-500 mb-4" />
                    <p className="text-gray-300">Manage your technical skills and expertise</p>
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
                            Add Tech
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
                                    setEditTechStack(selectedTechStack || null);
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

                    <div className="flex gap-3">
                        {/* Category Filter */}
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50"
                        >
                            {categories.map(category => (
                                <option key={category} value={category}>
                                    {formatCategoryName(category)}
                                </option>
                            ))}
                        </select>

                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search technologies..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 w-64 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300"
                            />
                        </div>
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
                        <div className="text-2xl font-bold text-indigo-400">{techStacks.length}</div>
                        <div className="text-gray-300 text-sm">Total Technologies</div>
                    </div>
                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
                        <div className="text-2xl font-bold text-emerald-400">{filteredTechStacks.length}</div>
                        <div className="text-gray-300 text-sm">Visible</div>
                    </div>
                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
                        <div className="text-2xl font-bold text-yellow-400">{techStacks.filter(t => t.proficiency >= 70).length}</div>
                        <div className="text-gray-300 text-sm">Advanced+ (70%+)</div>
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
                                            checked={selected.length === filteredTechStacks.length && filteredTechStacks.length > 0}
                                            onChange={handleSelectAll}
                                            className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500 focus:ring-2"
                                        />
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Technology</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Proficiency</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Description</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Icon</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700/50">
                                <AnimatePresence>
                                    {filteredTechStacks.map((techStack, index) => (
                                        <motion.tr
                                            key={techStack.id}
                                            className="hover:bg-gray-700/25 transition-colors duration-200"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                        >
                                            <td className="px-6 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selected.includes(techStack.id)}
                                                    onChange={() => handleCheckbox(techStack.id)}
                                                    className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500 focus:ring-2"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center justify-center w-8 h-8 bg-indigo-500/20 rounded-lg">
                                                        <Code className="h-4 w-4 text-indigo-400" />
                                                    </div>
                                                    <div>
                                                        <div className="text-white font-medium">{techStack.name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Layers className="h-4 w-4 text-gray-400" />
                                                    <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full border border-purple-500/30">
                                                        {formatCategoryName(techStack.category)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-center gap-2">
                                                        {renderProficiencyBar(techStack.proficiency)}
                                                        <span className="text-sm text-gray-300 min-w-[35px]">
                                                            {techStack.proficiency}%
                                                        </span>
                                                    </div>
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                                                        getProficiencyColor(techStack.proficiency)
                                                    }`}>
                                                        {getProficiencyLabel(techStack.proficiency)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-gray-300 text-sm max-w-xs">
                                                    {truncateText(techStack.description, 80)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="px-2 py-1 bg-gray-600/50 text-gray-300 text-xs rounded font-mono">
                                                        {techStack.iconName}
                                                    </div>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>

                        {filteredTechStacks.length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-gray-400 text-lg mb-2">No technologies found</div>
                                <div className="text-gray-500 text-sm">
                                    {searchTerm || selectedCategory !== 'All' 
                                        ? 'Try adjusting your search or filter' 
                                        : 'Start by adding your first technology'
                                    }
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Modals */}
            <AnimatePresence>
                {showFormModal && (
                    <TechStackModal
                        onClose={() => {
                            setShowFormModal(false);
                            setEditTechStack(null);
                            fetchTechStacks();
                        }}
                        existingTechStack={editTechStack}
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

export default TechStackTable;