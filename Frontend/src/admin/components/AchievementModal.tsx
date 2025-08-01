import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { axiosInstance } from '../../ui/utils/axios';
import { X, Save, Plus, Award, Calendar, FileText } from 'lucide-react';

interface Props {
    onClose: () => void;
    existingAchievement?: any;
    onSuccess?: () => void; // Add callback for successful operations
}

const AchievementModal: React.FC<Props> = ({ onClose, existingAchievement, onSuccess }) => {
    const [form, setForm] = useState({
        title: '',
        date: '',
        overview: '',
        certificate: '',
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (existingAchievement) {
            setForm({
                title: existingAchievement.title || '',
                date: existingAchievement.date ? new Date(existingAchievement.date).toISOString().split('T')[0] : '',
                overview: existingAchievement.overview || '',
                certificate: existingAchievement.certificate || '',
            });
        } else {
            // Reset form for new achievement
            setForm({
                title: '',
                date: '',
                overview: '',
                certificate: '',
            });
        }
        setErrors({});
    }, [existingAchievement]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        
        if (!form.title.trim()) {
            newErrors.title = 'Achievement title is required';
        }
        
        if (!form.date) {
            newErrors.date = 'Achievement date is required';
        }
        
        if (!form.overview.trim()) {
            newErrors.overview = 'Achievement overview is required';
        }

        // Validate certificate URL if provided
        if (form.certificate && !isValidUrl(form.certificate)) {
            newErrors.certificate = 'Please enter a valid certificate URL';
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
            date: new Date(form.date).toISOString(),
            overview: form.overview.trim(),
            certificate: form.certificate.trim() || null,
        };

        try {
            if (existingAchievement && existingAchievement.id) {
                await axiosInstance.put(`/achievements/${existingAchievement.id}`, payload);
            } else {
                await axiosInstance.post('/achievements', payload);
            }
            
            // Call success callback to refresh data
            if (onSuccess) {
                onSuccess();
            }
            
            onClose();
        } catch (err: any) {
            console.error('Submit error:', err);
            console.error('Error response:', err.response?.data);
            
            let errorMessage = 'Failed to save achievement. Please try again.';
            
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
                            {existingAchievement ? 
                                <Save className="h-5 w-5 text-indigo-400" /> : 
                                <Plus className="h-5 w-5 text-indigo-400" />
                            }
                            <h2 className="text-xl font-semibold text-white">
                                {existingAchievement ? 'Update Achievement' : 'Create Achievement'}
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
                            <label className="flex items-center gap-2 text-sm font-medium text-white mb-2">
                                <Award className="h-4 w-4" />
                                Achievement Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="Enter achievement title"
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                            />
                            {errors.title && (
                                <p className="text-red-400 text-sm mt-1">{errors.title}</p>
                            )}
                        </div>

                        {/* Date */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-white mb-2">
                                <Calendar className="h-4 w-4" />
                                Achievement Date *
                            </label>
                            <input
                                type="date"
                                name="date"
                                value={form.date}
                                onChange={handleChange}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                            />
                            {errors.date && (
                                <p className="text-red-400 text-sm mt-1">{errors.date}</p>
                            )}
                        </div>

                        {/* Overview */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-white mb-2">
                                <FileText className="h-4 w-4" />
                                Overview *
                            </label>
                            <textarea
                                name="overview"
                                value={form.overview}
                                onChange={handleChange}
                                placeholder="Describe your achievement"
                                rows={4}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 resize-none"
                            />
                            {errors.overview && (
                                <p className="text-red-400 text-sm mt-1">{errors.overview}</p>
                            )}
                        </div>

                        {/* Certificate URL */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Certificate URL (Optional)
                            </label>
                            <input
                                type="url"
                                name="certificate"
                                value={form.certificate}
                                onChange={handleChange}
                                placeholder="https://example.com/certificate.pdf"
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                            />
                            {errors.certificate && (
                                <p className="text-red-400 text-sm mt-1">{errors.certificate}</p>
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
                                        {existingAchievement ? 'Update' : 'Create'}
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

export default AchievementModal;