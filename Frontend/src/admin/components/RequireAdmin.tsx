import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { adminApi } from '../../ui/utils/http';
import { getToken } from '../../ui/utils/auth';

// Server-verified gate: the UI only renders once /auth/me accepts the token.
// This is a UX convenience; the API enforces authorization on every write.
const RequireAdmin: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [status, setStatus] = useState<'checking' | 'ok' | 'denied'>(
        getToken() ? 'checking' : 'denied'
    );

    useEffect(() => {
        if (status !== 'checking') return;
        let cancelled = false;
        adminApi
            .get('/auth/me')
            .then(() => !cancelled && setStatus('ok'))
            .catch(() => !cancelled && setStatus('denied'));
        return () => {
            cancelled = true;
        };
    }, [status]);

    if (status === 'denied') return <Navigate to="/admin/login" replace />;
    if (status === 'checking') {
        return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-gray-300">Verifying session…</div>;
    }
    return <>{children}</>;
};

export default RequireAdmin;
