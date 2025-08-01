import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { axiosInstance } from '../../ui/utils/axios';
import { X, Save, Plus, Calendar, BookOpen, Trophy, Briefcase } from 'lucide-react';

interface Props {
    onClose: () => void;
    existingItem?: any;
    onSuccess?: () => void;
}

type TimelineType = 'EDUCATION' | 'HACKATHON' | 'WORK';

const TimelineModal: React.FC<Props> = ({ onClose, existingItem, onSuccess }) => {
    const [form, setForm] = useState({
        title: '',
        date: '',
        description: '',
        type: 'EDUCATION' as TimelineType,
        remarks: '',
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (existingItem) {
            setForm({
                title: existingItem.title || '',
                date: existingItem.date || '',
                description: existingItem.description || '',
                type: existingItem.type || 'EDUCATION',
                remarks: existingItem.remarks || '',
            });
        } else {
            // Reset form for new timeline item
            setForm({
                title: '',
                date: '',
                description: '',
                type: 'EDUCATION',
                remarks: '',
            });
        }
        setErrors({});
    }, [existingItem]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        
        if (!form.title.trim()) {
            newErrors.title = 'Title is required';
        }
        
        if (!form.date.trim()) {
            newErrors.date = 'Date is required';
        }
        
        if (!form.description.trim()) {
            newErrors.description = 'Description is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        setForm(prev => ({ ...prev, [name]: value }));
        
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
            date: form.date.trim(),
            description: form.description.trim(),
            type: form.type,
            remarks: form.remarks.trim() || null,
        };

        try {
            if (existingItem && existingItem.id) {
                await axiosInstance.put(`/timeline/${existingItem.id}`, payload);
            } else {
                await axiosInstance.post('/timeline', payload);
            }
            
            // Call success callback to refresh data
            if (onSuccess) {
                onSuccess();
            }
            
            onClose();
        } catch (err: any) {
            console.error('Submit error:', err);
            console.error('Error response:', err.response?.data);
            
            let errorMessage = 'Failed to save timeline item. Please try again.';
            
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

    const getTypeIcon = (type: TimelineType) => {
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

    const getTypeColor = (type: TimelineType) => {
        switch (type) {
            case 'EDUCATION':
                return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
            case 'HACKATHON':
                return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
            case 'WORK':
                return 'text-green-400 bg-green-500/20 border-green-500/30';
            default:
                return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
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
                            {existingItem ? 
                                <Save className="h-5 w-5 text-indigo-400" /> : 
                                <Plus className="h-5 w-5 text-indigo-400" />
                            }
                            <h2 className="text-xl font-semibold text-white">
                                {existingItem ? 'Update Timeline Item' : 'Create Timeline Item'}
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
                                Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="Enter timeline item title"
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                            />
                            {errors.title && (
                                <p className="text-red-400 text-sm mt-1">{errors.title}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Date */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-white mb-2">
                                    <Calendar className="h-4 w-4" />
                                    Date *
                                </label>
                                <input
                                    type="text"
                                    name="date"
                                    value={form.date}
                                    onChange={handleChange}
                                    placeholder="e.g., 2023, Jan 2023, 2022-2023"
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                                />
                                {errors.date && (
                                    <p className="text-red-400 text-sm mt-1">{errors.date}</p>
                                )}
                            </div>

                            {/* Type */}
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">
                                    Type *
                                </label>
                                <div className="relative">
                                    <select
                                        name="type"
                                        value={form.type}
                                        onChange={handleChange}
                                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 appearance-none"
                                    >
                                        <option value="EDUCATION">Education</option>
                                        <option value="HACKATHON">Hackathon</option>
                                        <option value="WORK">Work</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                        <div className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs ${getTypeColor(form.type)}`}>
                                            {getTypeIcon(form.type)}
                                            {form.type}
                                        </div>
                                    </div>
                                </div>
                            </div>
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
                                placeholder="Describe this timeline item"
                                rows={4}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 resize-none"
                            />
                            {errors.description && (
                                <p className="text-red-400 text-sm mt-1">{errors.description}</p>
                            )}
                        </div>

                        {/* Remarks */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Remarks
                            </label>
                            <textarea
                                name="remarks"
                                value={form.remarks}
                                onChange={handleChange}
                                placeholder="Additional notes or remarks (optional)"
                                rows={2}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 resize-none"
                            />
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
                                        {existingItem ? 'Update' : 'Create'}
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

export default TimelineModal;