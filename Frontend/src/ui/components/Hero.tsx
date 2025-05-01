import React, { useState, useEffect, useCallback } from 'react';


// import Profile from '../../../public/DSC_3735 copy.jpg';
import Window from './Window';



const Hero: React.FC = () => {

    const titles = [
        "AI Enthusiast",
        "ML Engineer",
        "Full-Stack Developer",
        "Data Analyst", 
        "Problem Solver",
        "React Developer",
        "Software Engineer",
        "Tech Explorer",
        "Python Developer"
    ];

    const [displayText, setDisplayText] = useState('');
    const [titleIndex, setTitleIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [typingSpeed, setTypingSpeed] = useState(100);

    const handleTyping = useCallback(() => {
        const currentTitle = titles[titleIndex];
        const shouldDelete = isDeleting;
        
        setDisplayText(prev => {
            if (!shouldDelete && prev === currentTitle) {
                // Full word is typed, pause before deleting
                setIsDeleting(true);
                setTypingSpeed(750); // Pause at the end before deleting
                return prev;
            }
            
            if (shouldDelete && prev === '') {
                // Finished deleting, move to next word
                setIsDeleting(false);
                setTypingSpeed(100); // Reset typing speed
                setTitleIndex((titleIndex + 1) % titles.length);
                return '';
            }
            
            if (shouldDelete) {
                // Delete character
                setTypingSpeed(50); // Delete faster than typing
                return prev.substring(0, prev.length - 1);
            }
            
            // Add character
            return currentTitle.substring(0, prev.length + 1);
        });
    }, [titleIndex, isDeleting, titles]);
    
    useEffect(() => {
        const timer = setTimeout(handleTyping, typingSpeed);
        return () => clearTimeout(timer);
    }, [displayText, handleTyping, typingSpeed]);

    return (
        <>
            <div className="w-full min-h-screen flex flex-col md:flex-row bg-gray-900">
                {/* Left Section: Text Content */}
                <div className="md:w-1/2 w-full text-white flex items-center justify-center px-6 py-16">
                    {/* Text Content */}
                    <div className="max-w-3xl">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                        Hi, I'm <br />
                        <span className="text-indigo-500">Satyam Kumar Jha</span>
                    </h1>
                    <h3 className="text-3xl md:text-4xl font-semibold mb-4">
                        I'm not just a{" "}
                        <span className="text-indigo-400 font-bold">{displayText}<span className='animate-pulse'>|</span>
                        </span>
                    </h3>
                    <p className="text-lg md:text-xl text-gray-300">
                    A driven Computer Science & Engineering student specializing in AI/ML and full-stack development. 
                    Skilled in Python, SQL, React, Express, TypeScript and building intelligent systems using Machine Learning and Deep Learning. 
                    Passionate about data-driven problem solving and scalable solutions. Adept at database management and API integration, 
                    with a hands-on approach to learning, experimenting, and innovating with emerging technologies.
                    </p>
                    <div className="flex flex-col md:flex-row gap-4 mt-8">
                        <button className="mt-6 bg-indigo-500 text-white px-6 py-3 rounded-full hover:bg-indigo-600 transition duration-300">
                            Get in Touch
                        </button>
                        <button className="mt-6 bg-indigo-500 text-white px-6 py-3 rounded-full hover:bg-indigo-600 transition duration-300">
                            View Projects
                        </button>
                    </div>
                    </div>
                </div>

            {/* Right Section: Images */}
                <div className="md:w-1/2 w-full text-white flex items-center justify-center px-6 py-16 bg-gray-900">
                    <div className="relative w-full  h-96">
                    {/* Gray rectangle for background image */}
                        <div className="absolute top-0 w-full h-75 bg-gray-900">
                            <Window />
                        </div>
                    
                    {/* Lime green circle for profile photo */}
                        {/* <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full overflow-hidden opacity-100">
                            <img
                            src={Profile}
                            alt="profile"
                            className="w-full h-full object-cover mix-blend-multiply"
                            />
                        </div> */}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Hero;