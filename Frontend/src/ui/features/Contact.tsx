import React from 'react';
import Navbar from '../components/Navbar';
import FeedbackForm from '../components/Feedback';
import Footer from '../components/Footer';
import ContactDetails from '../components/ContactDetails';


const Contact: React.FC = () => {
    return (
        <>
            <Navbar />
            <div className='w-full h-screen flex flex-wrap '>
                <div className='w-1/2 h-full flex'>
                    <ContactDetails />
                </div>
                <div className='w-1/2 h-full'>
                    <FeedbackForm />
                </div>

            </div>
            <Footer />
        </>
    );
};

export default Contact;