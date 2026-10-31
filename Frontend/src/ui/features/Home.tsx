import React from 'react';
import { usePageMeta } from "../hooks/usePageMeta"

import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Techrow from '../components/Techrow';
import Footer from '../components/Footer';
import ProjectsShowcase from '../components/ProjectGrid';


const Home: React.FC = () => {
  usePageMeta("/")
    return (
        <>
            <Navbar />
            <main id="main-content" tabIndex={-1} className="focus:outline-none">
            <Hero />
            <div className='bg-gray-900 w-full'>
                <Techrow />
            </div>

            <ProjectsShowcase />
            </main>

            <Footer />
        </>
    );
};

export default Home;