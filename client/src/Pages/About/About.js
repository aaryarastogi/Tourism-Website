import React, { useState } from 'react'
import about from '../../Images/about1.png'
import {motion} from 'framer-motion'

const About =()=>{
    const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

    const handleMouseMove = (e) => {
        const { offsetX, offsetY, target } = e.nativeEvent;
        const { clientWidth, clientHeight } = target;

        const rotateX = ((offsetY / clientHeight) - 0.5) * 30;
        const rotateY = ((offsetX / clientWidth) - 0.5) * -30;

        setTilt({ rotateX, rotateY });
    };

    const handleMouseLeave = () => {
        setTilt({ rotateX: 0, rotateY: 0 });
    };

    return (
        <div className='grid md:grid-cols-2 md:pt-20 pt-12 md:pb-32 pb-16 overflow-hidden px-4 md:px-8 items-center' id='about'>
            <motion.div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    perspective: 1000,
                }}
                className='flex justify-center md:justify-end'
            >
                <motion.img
                    src={about}
                    className='md:w-96 w-72 lg:mx-32 md:mx-0 mx-auto md:pb-0 pb-4 rounded-2xl shadow-2xl'
                    style={{
                        rotateX: tilt.rotateX,
                        rotateY: tilt.rotateY,
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                />
            </motion.div>
            <motion.div 
                initial={{
                    x:10,
                    opacity:0
                }}
                whileInView={{ opacity: 1, x:0}}
                exit={{
                    opacity:0}}
                transition={{
                    ease:"easeInOut",
                    duration:1,
                }} className='space-y-6 mx-4 md:mx-8'>
                <h1 className='md:text-4xl text-2xl text-start font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>Why Choose <span className='text-purple-600 italic font-extrabold'>myjourney.com</span> ? </h1>
                <p className='text-base md:text-lg text-gray-700 text-justify leading-relaxed max-w-[36rem]'>MyJourney has cooperated with countries that provide more than 600 beautiful places for you to enjoy and relax your free time from the hustle and bustle of this life. Don't worry, you won't get lost because we provide 100+ professional Tour Guides. Our 5k+ customers were satisfied with the services we provide. So what are you waiting for? Let's plan your holiday with us!</p>
                <div className='flex flex-wrap gap-4 mt-8'>
                    <div className='bg-gradient-to-br from-indigo-50 to-purple-50 px-6 py-4 rounded-xl border border-indigo-100'>
                        <h2 className='text-3xl font-bold text-indigo-600'>600+</h2>
                        <p className='text-sm text-gray-600 mt-1'>Beautiful Places</p>
                    </div>
                    <div className='bg-gradient-to-br from-indigo-50 to-purple-50 px-6 py-4 rounded-xl border border-indigo-100'>
                        <h2 className='text-3xl font-bold text-indigo-600'>100+</h2>
                        <p className='text-sm text-gray-600 mt-1'>Tour Guides</p>
                    </div>
                    <div className='bg-gradient-to-br from-indigo-50 to-purple-50 px-6 py-4 rounded-xl border border-indigo-100'>
                        <h2 className='text-3xl font-bold text-indigo-600'>5k+</h2>
                        <p className='text-sm text-gray-600 mt-1'>Happy Customers</p>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default About;