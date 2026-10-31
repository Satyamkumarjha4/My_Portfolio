import React, { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

const AUTO_DISMISS_MS = 8000;

// Non-error counterpart of AdminErrorBanner: confirms a save and dismisses itself.
const AdminNoticeBanner: React.FC<{ message: string | null; onDismiss: () => void }> = ({ message, onDismiss }) => {
    useEffect(() => {
        if (!message) return;
        const timer = setTimeout(onDismiss, AUTO_DISMISS_MS);
        return () => clearTimeout(timer);
    }, [message, onDismiss]);

    if (!message) return null;
    return (
        <div
            role="status"
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] flex items-start gap-3 max-w-lg w-[calc(100%-2rem)] rounded-lg border border-green-500/40 bg-green-950/90 px-4 py-3 text-green-100 shadow-lg"
        >
            <CheckCircle2 className="h-5 w-5 shrink-0 text-green-400" aria-hidden="true" />
            <p className="text-sm flex-1">{message}</p>
            <button onClick={onDismiss} aria-label="Dismiss message" className="text-green-300 hover:text-white">
                <X className="h-4 w-4" />
            </button>
        </div>
    );
};

export default AdminNoticeBanner;
