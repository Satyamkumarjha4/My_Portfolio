import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { axiosInstance } from '../../ui/utils/axios';
import { X, Save, Plus, Code, Layers } from 'lucide-react';

interface Props {
    onClose: () => void;
    existingTechStack?: any;
    onSuccess?: () => void;
}

const TechStackModal: React.FC<Props> = ({ onClose, existingTechStack, onSuccess }) => {
    const [form, setForm] = useState({
        name: '',
        category: 'Languages',
        proficiency: 0,
        description: '',
        iconName: '',
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const categories = [
        'Languages',
        'Frontend',
        'Python_Frameworks',
        'Databases',
        'Data_Science',
        'Tools'
    ];


    useEffect(() => {
        if (existingTechStack) {
            setForm({
                name: existingTechStack.name || '',
                category: existingTechStack.category || 'Languages',
                proficiency: existingTechStack.proficiency || 0,
                description: existingTechStack.description || '',
                iconName: existingTechStack.iconName || '',
            });
        } else {
            // Reset form for new tech stack
            setForm({
                name: '',
                category: 'Languages',
                proficiency: 0,
                description: '',
                iconName: '',
            });
        }
        setErrors({});
    }, [existingTechStack]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        
        if (!form.name.trim()) {
            newErrors.name = 'Technology name is required';
        }
        
        if (!form.description.trim()) {
            newErrors.description = 'Description is required';
        }

        if (!form.iconName.trim()) {
            newErrors.iconName = 'Icon name is required';
        }

        if (form.proficiency < 0 || form.proficiency > 100) {
            newErrors.proficiency = 'Proficiency must be between 0 and 100';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        const newValue = type === 'number' ? parseInt(value) || 0 : value;
        
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
            name: form.name.trim(),
            category: form.category,
            proficiency: form.proficiency,
            description: form.description.trim(),
            iconName: form.iconName.trim(),
        };

        try {
            if (existingTechStack && existingTechStack.id) {
                await axiosInstance.put(`/tech-stacks/${existingTechStack.id}`, payload);
            } else {
                await axiosInstance.post('/tech-stacks', payload);
            }
            
            // Call success callback to refresh data
            if (onSuccess) {
                onSuccess();
            }
            
            onClose();
        } catch (err: any) {
            console.error('Submit error:', err);
            console.error('Error response:', err.response?.data);
            
            let errorMessage = 'Failed to save tech stack. Please try again.';
            
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
                            {existingTechStack ? 
                                <Save className="h-5 w-5 text-indigo-400" /> : 
                                <Plus className="h-5 w-5 text-indigo-400" />
                            }
                            <h2 className="text-xl font-semibold text-white">
                                {existingTechStack ? 'Update Tech Stack' : 'Add Tech Stack'}
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
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Technology Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="e.g., React, Python, MongoDB"
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                            />
                            {errors.name && (
                                <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                            )}
                        </div>

                        {/* Category and Proficiency Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Category */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-white mb-2">
                                    <Layers className="h-4 w-4" />
                                    Category *
                                </label>
                                <select
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                                >
                                    {categories.map(category => (
                                        <option key={category} value={category}>
                                            {formatCategoryName(category)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Proficiency */}
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">
                                    Proficiency Level * ({form.proficiency}%)
                                </label>
                                <div className="relative">
                                    <input
                                        type="range"
                                        name="proficiency"
                                        min="0"
                                        max="100"
                                        step="5"
                                        value={form.proficiency}
                                        onChange={handleChange}
                                        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                                        style={{
                                            background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${form.proficiency}%, #4b5563 ${form.proficiency}%, #4b5563 100%)`
                                        }}
                                    />
                                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                                        <span>0%</span>
                                        <span>25%</span>
                                        <span>50%</span>
                                        <span>75%</span>
                                        <span>100%</span>
                                    </div>
                                    <div className="text-center mt-2">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                            {form.proficiency}% - {getProficiencyLabel(form.proficiency)}
                                        </span>
                                    </div>
                                </div>
                                {errors.proficiency && (
                                    <p className="text-red-400 text-sm mt-1">{errors.proficiency}</p>
                                )}
                            </div>
                        </div>

                        {/* Icon Name */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-white mb-2">
                                <Code className="h-4 w-4" />
                                Icon Name *
                            </label>
                            <input
                                type="text"
                                name="iconName"
                                value={form.iconName}
                                onChange={handleChange}
                                placeholder="e.g., react, python, mongodb (Lucide icon name)"
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                Use Lucide React icon names without the icon suffix
                            </p>
                            {errors.iconName && (
                                <p className="text-red-400 text-sm mt-1">{errors.iconName}</p>
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
                                placeholder="Describe your experience with this technology"
                                rows={3}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 resize-none"
                            />
                            {errors.description && (
                                <p className="text-red-400 text-sm mt-1">{errors.description}</p>
                            )}
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
                                        {existingTechStack ? 'Update' : 'Add'}
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

export default TechStackModal;