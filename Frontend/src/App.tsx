import React from 'react';
import { Route, Routes } from "react-router-dom";

import Home from './ui/features/Home';
import About from './ui/features/About';
import Projects from './ui/features/Projects';
import Contact from './ui/features/Contact';



const App: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
        </Routes>
    );
};

export default App;