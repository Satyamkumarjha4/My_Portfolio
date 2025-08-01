import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { safeAxiosInstance } from '../../ui/utils/axios';
import { X, Save, Plus, Github, ExternalLink, Image } from 'lucide-react';

interface Props {
    onClose: () => void;
    existingProject?: any;
    onSuccess?: () => void; // Add callback for successful operations
}

const ProjectModal: React.FC<Props> = ({ onClose, existingProject, onSuccess }) => {
    const [form, setForm] = useState({
        title: '',
        description: '',
        techStack: '',
        tags: '',
        imageUrl: '',
        githubUrl: '',
        demoUrl: '',
        imageOnRight: false,
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (existingProject) {
            setForm({
                title: existingProject.title || '',
                description: existingProject.description || '',
                techStack: Array.isArray(existingProject.techStack) 
                    ? existingProject.techStack.join(', ') 
                    : existingProject.techStack || '',
                tags: Array.isArray(existingProject.tags) 
                    ? existingProject.tags.join(', ') 
                    : existingProject.tags || '',
                imageUrl: existingProject.imageUrl || '',
                githubUrl: existingProject.githubUrl || '',
                demoUrl: existingProject.demoUrl || '',
                imageOnRight: existingProject.imageOnRight || false,
            });
        } else {
            // Reset form for new project
            setForm({
                title: '',
                description: '',
                techStack: '',
                tags: '',
                imageUrl: '',
                githubUrl: '',
                demoUrl: '',
                imageOnRight: false,
            });
        }
        setErrors({});
    }, [existingProject]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        
        if (!form.title.trim()) {
            newErrors.title = 'Project title is required';
        }
        
        if (!form.description.trim()) {
            newErrors.description = 'Project description is required';
        }

        // Validate URLs if provided
        if (form.githubUrl && !isValidUrl(form.githubUrl)) {
            newErrors.githubUrl = 'Please enter a valid GitHub URL';
        }
        
        if (form.demoUrl && !isValidUrl(form.demoUrl)) {
            newErrors.demoUrl = 'Please enter a valid demo URL';
        }
        
        if (!form.imageUrl.trim()) {
            newErrors.imageUrl = 'Please enter a valid image URL';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const isValidUrl = (string: string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        
        const newValue = type === 'checkbox' ? checked : value;
        
        setForm(prev => ({ ...prev, [name]: newValue }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setLoading(true);
        setErrors({});

        const payload = {
            title: form.title.trim(),
            description: form.description.trim(),
            techStack: form.techStack.split(',').map(s => s.trim()).filter(s => s),
            tags: form.tags.split(',').map(s => s.trim()).filter(s => s),
            imageUrl: form.imageUrl.trim() || null,
            githubUrl: form.githubUrl.trim() || null,
            demoUrl: form.demoUrl.trim() || null,
            imageOnRight: form.imageOnRight,
        };


        try {
            if (existingProject && existingProject.id) {
                await safeAxiosInstance.put(`/projects/${existingProject.id}`, payload);
            } else {
                await safeAxiosInstance.post('/projects', payload);
            }
            
            // Call success callback to refresh data
            if (onSuccess) {
                onSuccess();
            }
            
            onClose();
        } catch (err: any) {
            console.error('Submit error:', err);
            console.error('Error response:', err.response?.data);
            
            let errorMessage = 'Failed to save project. Please try again.';
            
            if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.response?.data?.error) {
                errorMessage = err.response.data.error;
            } else if (err.response?.data?.errors) {
                // Handle validation errors
                const validationErrors = err.response.data.errors;
                if (Array.isArray(validationErrors)) {
                    errorMessage = validationErrors.map(e => e.message || e).join(', ');
                } else if (typeof validationErrors === 'object') {
                    errorMessage = Object.values(validationErrors).join(', ');
                }
            }
            
            setErrors({ submit: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                {/* Backdrop */}
                <motion.div
                    className="absolute inset-0 bg-black/60"
                    onClick={onClose}
                />

                {/* Modal */}
                <motion.div
                    className="relative w-full max-w-2xl bg-gray-800 rounded-lg shadow-xl"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-700">
                        <div className="flex items-center gap-3">
                            {existingProject ? 
                                <Save className="h-5 w-5 text-indigo-400" /> : 
                                <Plus className="h-5 w-5 text-indigo-400" />
                            }
                            <h2 className="text-xl font-semibold text-white">
                                {existingProject ? 'Update Project' : 'Create Project'}
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Project Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="Enter project title"
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                            />
                            {errors.title && (
                                <p className="text-red-400 text-sm mt-1">{errors.title}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Description *
                            </label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Describe your project"
                                rows={3}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 resize-none"
                            />
                            {errors.description && (
                                <p className="text-red-400 text-sm mt-1">{errors.description}</p>
                            )}
                        </div>

                        {/* Tech Stack */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Technologies
                            </label>
                            <input
                                type="text"
                                name="techStack"
                                value={form.techStack}
                                onChange={handleChange}
                                placeholder="React, Node.js, MongoDB (comma separated)"
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                            />
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Tags
                            </label>
                            <input
                                type="text"
                                name="tags"
                                value={form.tags}
                                onChange={handleChange}
                                placeholder="web app, mobile, ai (comma separated)"
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                            />
                        </div>

                        {/* Image URL */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-white mb-2">
                                <Image className="h-4 w-4" />
                                Image URL
                            </label>
                            <input
                                type="url"
                                name="imageUrl"
                                value={form.imageUrl}
                                onChange={handleChange}
                                placeholder="https://example.com/image.jpg"
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                            />
                            {errors.imageUrl && (
                                <p className="text-red-400 text-sm mt-1">{errors.imageUrl}</p>
                            )}
                        </div>

                        {/* Image Position Toggle */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Image Position
                            </label>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="imageOnRight"
                                    checked={form.imageOnRight}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500 focus:ring-2"
                                />
                                <label className="ml-2 text-sm text-gray-300">
                                    Show image on right side
                                </label>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* GitHub URL */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-white mb-2">
                                    <Github className="h-4 w-4" />
                                    GitHub URL
                                </label>
                                <input
                                    type="url"
                                    name="githubUrl"
                                    value={form.githubUrl}
                                    onChange={handleChange}
                                    placeholder="https://github.com/username/repo"
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                                />
                                {errors.githubUrl && (
                                    <p className="text-red-400 text-sm mt-1">{errors.githubUrl}</p>
                                )}
                            </div>

                            {/* Demo URL */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-white mb-2">
                                    <ExternalLink className="h-4 w-4" />
                                    Demo URL
                                </label>
                                <input
                                    type="url"
                                    name="demoUrl"
                                    value={form.demoUrl}
                                    onChange={handleChange}
                                    placeholder="https://your-demo.com"
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                                />
                                {errors.demoUrl && (
                                    <p className="text-red-400 text-sm mt-1">{errors.demoUrl}</p>
                                )}
                            </div>
                        </div>

                        {/* Submit Error */}
                        {errors.submit && (
                            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                                {errors.submit}
                            </div>
                        )}
                    </form>

                    {/* Footer */}
                    <div className="flex items-center justify-between p-6 border-t border-gray-700">
                        <p className="text-sm text-gray-400">
                            <span className="text-red-400">*</span> Required fields
                        </p>
                        
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            
                            <button
                                type="submit"
                                form="project-form"
                                onClick={handleSubmit}
                                disabled={loading}
                                className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                                    loading
                                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                        : 'bg-indigo-500 text-white hover:bg-indigo-600'
                                }`}
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-gray-400/30 border-t-gray-400 rounded-full animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4" />
                                        {existingProject ? 'Update' : 'Create'}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ProjectModal;