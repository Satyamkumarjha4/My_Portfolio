import React from 'react';

import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Techrow from '../components/Techrow';
import Footer from '../components/Footer';
import ProjectsShowcase from '../components/ProjectGrid';


const Home: React.FC = () => {
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