import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { safeAxiosInstance } from '../../ui/utils/axios';
import ProjectModal from './ProjectModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import { Plus, Edit3, Trash2, ExternalLink, Github, Search, RefreshCw, Eye, EyeOff } from 'lucide-react';

interface Project {
    id: string;
    title: string;
    description: string;
    techStack: string[];
    tags: string[];
    imageUrl: string;
    githubUrl: string;
    demoUrl: string;
    imageOnRight: boolean;
}

const ProjectsTable: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [selected, setSelected] = useState<string[]>([]);
    const [showFormModal, setShowFormModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editProject, setEditProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const res = await safeAxiosInstance.get('/projects');
            setProjects(res.data);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const refreshData = async () => {
        setIsRefreshing(true);
        await fetchProjects();
        setTimeout(() => setIsRefreshing(false), 500);
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleCheckbox = (id: string) => {
        setSelected(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selected.length === filteredProjects.length) {
            setSelected([]);
        } else {
            setSelected(filteredProjects.map(p => p.id));
        }
    };

    const handleDelete = async () => {
        try {
            await Promise.all(selected.map(id => safeAxiosInstance.delete(`/projects/${id}`)));
            setSelected([]);
            fetchProjects();
        } catch (err) {
            console.error('Delete error:', err);
        }
    };

    const filteredProjects = projects.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.techStack.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const selectedProject = projects.find(p => p.id === selected[0]);

    const truncateText = (text: string, maxLength: number) => {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-300">Loading projects...</p>
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
                        Projects <span className="text-indigo-500">Management</span>
                    </h1>
                    <div className="w-16 h-1 bg-indigo-500 mb-4" />
                    <p className="text-gray-300">Manage your portfolio projects with ease</p>
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
                            Add Project
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
                                    setEditProject(selectedProject || null);
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
                            placeholder="Search projects..."
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
                        <div className="text-2xl font-bold text-indigo-400">{projects.length}</div>
                        <div className="text-gray-300 text-sm">Total Projects</div>
                    </div>
                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
                        <div className="text-2xl font-bold text-emerald-400">{filteredProjects.length}</div>
                        <div className="text-gray-300 text-sm">Visible Projects</div>
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
                                            checked={selected.length === filteredProjects.length && filteredProjects.length > 0}
                                            onChange={handleSelectAll}
                                            className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500 focus:ring-2"
                                        />
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Title</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Description</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Tech Stack</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Tags</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Links</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Layout</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700/50">
                                <AnimatePresence>
                                    {filteredProjects.map((project, index) => (
                                        <motion.tr
                                            key={project.id}
                                            className="hover:bg-gray-700/25 transition-colors duration-200"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                        >
                                            <td className="px-6 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selected.includes(project.id)}
                                                    onChange={() => handleCheckbox(project.id)}
                                                    className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500 focus:ring-2"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-white font-medium">{project.title}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-gray-300 text-sm max-w-xs">
                                                    {truncateText(project.description, 100)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {project.techStack.slice(0, 3).map((tech, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="px-2 py-1 bg-indigo-500/20 text-indigo-300 text-xs rounded-full border border-indigo-500/30"
                                                        >
                                                            {tech}
                                                        </span>
                                                    ))}
                                                    {project.techStack.length > 3 && (
                                                        <span className="px-2 py-1 bg-gray-600/50 text-gray-400 text-xs rounded-full">
                                                            +{project.techStack.length - 3}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {project.tags.slice(0, 2).map((tag, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full border border-purple-500/30"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                    {project.tags.length > 2 && (
                                                        <span className="px-2 py-1 bg-gray-600/50 text-gray-400 text-xs rounded-full">
                                                            +{project.tags.length - 2}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    {project.githubUrl && (
                                                        <a
                                                            href={project.githubUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-1 text-gray-400 hover:text-white transition-colors duration-200"
                                                        >
                                                            <Github className="h-4 w-4" />
                                                        </a>
                                                    )}
                                                    {project.demoUrl && (
                                                        <a
                                                            href={project.demoUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-1 text-gray-400 hover:text-white transition-colors duration-200"
                                                        >
                                                            <ExternalLink className="h-4 w-4" />
                                                        </a>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {project.imageOnRight ? (
                                                        <Eye className="h-4 w-4 text-emerald-400" />
                                                    ) : (
                                                        <EyeOff className="h-4 w-4 text-gray-400" />
                                                    )}
                                                    <span className="text-sm text-gray-300">
                                                        {project.imageOnRight ? 'Right' : 'Left'}
                                                    </span>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>

                        {filteredProjects.length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-gray-400 text-lg mb-2">No projects found</div>
                                <div className="text-gray-500 text-sm">
                                    {searchTerm ? 'Try adjusting your search terms' : 'Start by adding your first project'}
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Modals */}
            <AnimatePresence>
                {showFormModal && (
                    <ProjectModal
                        onClose={() => {
                            setShowFormModal(false);
                            setEditProject(null);
                            fetchProjects();
                        }}
                        existingProject={editProject}
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

export default ProjectsTable;