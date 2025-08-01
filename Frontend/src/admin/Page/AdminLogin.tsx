import React, { useState } from 'react';
import { ChevronRight, Shield, User, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminLogin: React.FC = () => {
    const [id, setId] = useState('');
    const [accessKey, setAccessKey] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();

    const adminID = import.meta.env.VITE_ADMIN_ID;
    const adminAccessKey = import.meta.env.VITE_ADMIN_ACCESS_KEY;

    const handleLogin = async () => {
        setIsLoading(true);
        
        // Validation
        if (!id || !accessKey) {
            alert('Please enter both ID and Access Key');
            setIsLoading(false);
            return;
        }

        if (id !== adminID || accessKey !== adminAccessKey) {
            alert('Invalid ID or Access Key');
            setIsLoading(false);
            return;
        }

        // Successful login
        if (id === adminID && accessKey === adminAccessKey) {
            // Simulate API call delay
            setTimeout(() => {
                setIsLoading(false);
                // Navigate to admin dashboard
                navigate('/admin',{state: { authAccess: "LetsGoo" }});
            }, 2000);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-gray-900 overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900 to-indigo-900/10" />

            {/* Animated particles */}
            <div className="absolute inset-0 overflow-hidden">
                {Array.from({ length: 15 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-indigo-500/10 animate-pulse"
                        style={{
                            width: Math.random() * 80 + 40,
                            height: Math.random() * 80 + 40,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${Math.random() * 8 + 6}s`,
                        }}
                    />
                ))}
            </div>

            {/* Floating geometric shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-24 h-24 border border-indigo-500/20 rotate-45 animate-spin" style={{ animationDuration: '20s' }} />
                <div className="absolute bottom-32 right-16 w-16 h-16 bg-indigo-500/5 rounded-full animate-bounce" style={{ animationDelay: '2s' }} />
                <div className="absolute top-1/3 right-8 w-8 h-8 bg-indigo-400/10 rotate-12 animate-pulse" />
            </div>

            <div className="container mx-auto px-6 z-10">
                <div className="max-w-md mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center mb-6">
                            <div className="p-3 bg-indigo-500/10 rounded-full border border-indigo-500/20">
                                <Shield className="h-8 w-8 text-indigo-400" />
                            </div>
                        </div>
                        
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Admin Panel
                        </h1>
                        
                        <div className="w-16 h-1 bg-indigo-500 mx-auto mb-6" />
                        
                        <p className="text-gray-300 text-lg">
                            Secure access to administrative controls
                        </p>
                    </div>

                    {/* Login Form */}
                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
                        <div className="space-y-6">
                            {/* ID Field */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-gray-300 text-sm font-medium">
                                    <User className="h-4 w-4 text-indigo-400" />
                                    Administrator ID
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Enter your admin ID"
                                        className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300"
                                        value={id}
                                        onChange={(e) => setId(e.target.value)}
                                    />
                                    <div className="absolute inset-0 rounded-lg pointer-events-none">
                                        <div className="absolute inset-0 rounded-lg border border-indigo-500/20 opacity-0 focus-within:opacity-100 transition-opacity duration-300" />
                                    </div>
                                </div>
                            </div>

                            {/* Access Key Field */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-gray-300 text-sm font-medium">
                                    <Lock className="h-4 w-4 text-indigo-400" />
                                    Admin Access Key
                                </label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        placeholder="Enter your access key"
                                        className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300"
                                        value={accessKey}
                                        onChange={(e) => setAccessKey(e.target.value)}
                                    />
                                    <div className="absolute inset-0 rounded-lg pointer-events-none">
                                        <div className="absolute inset-0 rounded-lg border border-indigo-500/20 opacity-0 focus-within:opacity-100 transition-opacity duration-300" />
                                    </div>
                                </div>
                            </div>

                            {/* Login Button */}
                            <button
                                className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-indigo-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                                onClick={handleLogin}
                                disabled={isLoading || !id || !accessKey}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Authenticating...
                                    </>
                                ) : (
                                    <>
                                        Access Dashboard
                                        <ChevronRight className="h-5 w-5" />
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Additional Info */}
                        <div className="mt-6 pt-6 border-t border-gray-700/50">
                            <p className="text-gray-400 text-xs text-center">
                                Authorized personnel only. All access attempts are logged.
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center mt-8">
                        <p className="text-gray-500 text-sm">
                            Protected by enterprise-grade security
                        </p>
                    </div>
                </div>
            </div>

            {/* Ambient glow effect */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        </div>
    );
};

export default AdminLogin;
