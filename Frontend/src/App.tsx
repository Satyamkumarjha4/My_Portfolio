import React, { Suspense, lazy, useEffect } from 'react';
import { Route, Routes, useLocation } from "react-router-dom";

import Home from './ui/features/Home';

// Everything except the landing page is split into its own chunk, so the
// admin panel (~3.5k lines) is never downloaded by regular visitors.
const About = lazy(() => import('./ui/features/About'));
const Projects = lazy(() => import('./ui/features/Projects'));
const Contact = lazy(() => import('./ui/features/Contact'));
const Info = lazy(() => import('./ui/features/Info'));
const Status = lazy(() => import('./ui/features/Status'));
const Admin = lazy(() => import('./admin/Page/Admin'));

const ScrollToTop: React.FC = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

const Fallback: React.FC = () => (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center text-gray-400" role="status">
        Loading...
    </div>
);

const App: React.FC = () => {
    return (
        <>
            <ScrollToTop />
            <Suspense fallback={<Fallback />}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/info" element={<Info />} />
                    <Route path="/status" element={<Status />} />
                    <Route path="/admin/*" element={<Admin />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
        </>
    );
};

const NotFound: React.FC = () => (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white gap-4">
        <h1 className="text-5xl font-bold">404</h1>
        <p className="text-gray-400">That page doesn't exist.</p>
        <a href="/" className="bg-indigo-500 hover:bg-indigo-600 px-5 py-2 rounded-full">Back home</a>
    </div>
);

export default App;
