import React from 'react';

import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Techrow from '../components/Techrow';
import Footer from '../components/Footer';


const Home: React.FC = () => {
    return (
        <>
            <Navbar />
            <Hero />
            <div className='bg-gray-900 w-full'>
                <Techrow />
            </div>
            

            <Footer />
        </>
    );
};

export default Home;