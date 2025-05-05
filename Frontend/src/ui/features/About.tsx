import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Timeline from '../components/Timeline';
import AchievementGrid from '../components/AcheivementGrid';




const About: React.FC = () => {
    return (
        <>
            <Navbar />
            <Timeline />
            <AchievementGrid />

            <Footer />
        </>
    );
};

export default About;