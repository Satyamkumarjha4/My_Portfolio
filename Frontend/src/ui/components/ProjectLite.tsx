import React from 'react';
import Image from '../../../public/kuchbhi.png';

interface Props {
    item:string;
    
}

const ProjectLite: React.FC<Props> = ({title,description,stack}) => {
    return (
        <>
            <div className='w-1/5 h-[20vw] bg-gray-200 rounded-md overflow-hidden '>
                <div className='w-full h-1/2 bg-gray-300'>
                    <img src={Image} alt="" className='h-full w-full object-cover'/>
                </div>
                <div className='w-full flex flex-col gap-3 px-4 py-2'>
                    <h3 className='text-2xl font-medium'>{title}</h3>
                    <p className='text-lg '> {description} </p>
                    <ul className='flex flex-wrap gap-2'>
                        {stack.map((item, index) => (
                            <li key={index} className='bg-gray-300 px-2 py-1 rounded-md text-sm'>{item}</li>
                        ))}
                    </ul>

                </div>
            </div>
        </>
    );
};

export default ProjectLite;