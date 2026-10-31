import React from 'react';
import { Route, Routes } from "react-router-dom";

import Table from './Table';
import AdminDashboard from './AdminDashboard';
import AdminLogin from './AdminLogin';
import RequireAdmin from '../components/RequireAdmin';


const Admin: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
            <Route path="/login" element={<AdminLogin />} />
            <Route path="/table/*" element={<RequireAdmin><Table /></RequireAdmin>} />
        </Routes>
    );
};

export default Admin;
