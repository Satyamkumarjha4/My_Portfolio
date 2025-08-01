import React from 'react';
import { Route, Routes } from "react-router-dom";

import Table from './Table';
import AdminDashboard from './AdminDashboard';
import AdminLogin from './AdminLogin';


const Admin: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/login" element={<AdminLogin />} />
            <Route path="/table/*" element={<Table />} />
        </Routes>
    );
};

export default Admin;