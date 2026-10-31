import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

// Visible, dismissible error for admin actions (never fail silently).
const AdminErrorBanner: React.FC<{ message: string | null; onDismiss: () => void }> = ({ message, onDismiss }) => {
    if (!message) return null;
    return (
        <div
            role="alert"
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] flex items-start gap-3 max-w-lg w-[calc(100%-2rem)] rounded-lg border border-red-500/40 bg-red-950/90 px-4 py-3 text-red-100 shadow-lg"
        >
            <AlertTriangle className="h-5 w-5 shrink-0 text-red-400" aria-hidden="true" />
            <p className="text-sm flex-1">{message}</p>
            <button onClick={onDismiss} aria-label="Dismiss error" className="text-red-300 hover:text-white">
                <X className="h-4 w-4" />
            </button>
        </div>
    );
};

export default AdminErrorBanner;
