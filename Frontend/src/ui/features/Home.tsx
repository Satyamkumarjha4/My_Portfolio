import React from 'react';
import { usePageMeta } from "../hooks/usePageMeta"

import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Techrow from '../components/Techrow';
import Footer from '../components/Footer';
import ProjectsShowcase from '../components/ProjectGrid';


const Home: React.FC = () => {
  usePageMeta("", 'Satyam Kumar Jha - full-stack developer and AI/ML engineer. Projects built with React, Express, PostgreSQL and Python.')
    return (
        <>
            <Navbar />
            <Hero />
            <div className='bg-gray-900 w-full'>
                <Techrow />
            </div>

            <ProjectsShowcase />

            <Footer />
        </>
    );
};

export default Home;