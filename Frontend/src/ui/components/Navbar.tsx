import React, {useEffect, useState} from 'react';
import Image from '../../../public/S.png';


const navigateTo = (path:string) => {
    window.location.href = path;
  };



const Navbar: React.FC = () => {

    const [visible, setVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
        const currentScrollY = window.scrollY;
        
        // Show navbar when at the top or scrolling up
        if (currentScrollY <= 0) {
            setVisible(true);
        } 
        // Hide when scrolling down
        else if (currentScrollY > lastScrollY) {
            setVisible(false);
        } 
        // Show when scrolling up
        else {
            setVisible(true);
        }
        
        setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        
        return () => {
        window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollY]);
    

    return (
        <>
            <nav className='fixed top-0 left-0 w-full flex justify-between items-center p-4 h-20 z-10'>
                <div className='w-16 p-2'><img src={Image} alt="logo" className='rounded-full mt-4 transition-transform duration-300 hover:scale-110 hover:shadow-md hover:bg-gray-300' onClick={() => navigateTo('/') }/></div>
                <div className={`bg-gray-800 w-1/4 h-full rounded-full px-4 gap-10 transition-transform duration-300 ${visible ? '' : 'hidden'}`}>
                <ul className={'flex space-x-4 justify-center items-center justify-between h-full'}>
                    <li onClick={() => navigateTo('/')} className='text-white hover:bg-gray-600 rounded-full cursor-pointer text-lg p-2'>Home</li>
                    <li onClick={() => navigateTo('/about')} className='text-white hover:bg-gray-600 rounded-full cursor-pointer text-lg p-2'>About</li>
                    <li onClick={() => navigateTo('/projects')} className='text-white hover:bg-gray-600 rounded-full cursor-pointer text-lg p-2'>Projects</li>
                    <li onClick={() => navigateTo('/contact')} className='text-white hover:bg-gray-600 rounded-full cursor-pointer text-lg p-2'>Contact</li>
                </ul>
                </div>
                <div>
                    <button className='bg-gray-800 text-white px-4 py-2 rounded-full hover:bg-gray-700'>Admin</button>
                </div>
            </nav>
        </>
    );
};

export default Navbar;