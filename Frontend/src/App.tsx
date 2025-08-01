import React from 'react';
import { Route, Routes } from "react-router-dom";

import Home from './ui/features/Home';
import About from './ui/features/About';
import Projects from './ui/features/Projects';
import Contact from './ui/features/Contact';
import Info from './ui/features/Info';
import Admin from './admin/Page/Admin';


const App: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/info" element={<Info />} />
            <Route path="/admin/*" element={<Admin />} />
        </Routes>
    );
};

export default App;