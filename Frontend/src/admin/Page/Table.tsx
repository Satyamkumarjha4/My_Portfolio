import React , {useEffect} from 'react';
import { useLocation, useNavigate, Routes, Route } from 'react-router-dom';
import ProjectsTable from '../components/ProjectsTable';
import TimelineTable from '../components/TimelineTable';
import TechStackTable from '../components/TechStackTable';
import AchievementsTable from '../components/AchievementsTable'
import FeedbackTable from '../components/FeedbackTable'

const Table: React.FC = () => {
    const location = useLocation();
    const { authAccess } = location.state || {authAccess: null};
    const navigate = useNavigate();
    useEffect(() => {
        if (authAccess !== "LetsGoo" || authAccess === null) {
            // Redirect to login or show an error
            console.error("Unauthorized access");
            navigate('/admin/login');
        }
    }, []);


    return (
        <>
            <Routes>
                <Route path="/projects" element={<ProjectsTable />} />
                <Route path="/timeline" element={<TimelineTable />} />
                <Route path="/tech-stack" element={<TechStackTable />} />
                <Route path="/achievements" element={<AchievementsTable />} />
                <Route path="/feedback" element={<FeedbackTable />} />
            </Routes>
        </>
    );
};

export default Table;