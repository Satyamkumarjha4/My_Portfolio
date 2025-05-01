import React from 'react';
import Navbar from '../components/Navbar';
import FeedbackForm from '../components/Feedback';
import Footer from '../components/Footer';


const Contact: React.FC = () => {
    return (
        <>
            <Navbar />
            <div className='w-full h-screen flex flex-wrap '>
                <div className='w-1/2 h-full flex'>

                </div>
                <div className='w-1/2 h-full'>
                    <FeedbackForm />
                </div>

            </div>
            
            Yeh Contact hai

            <Footer />
        </>
    );
};

export default Contact;