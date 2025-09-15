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
        <div className='grid md:grid-cols-2 md:pt-16 pt-4 md:pb-32 pb-10 overflow-hidden' id='about'>
            <motion.div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    perspective: 1000,
                }}
            >
                <motion.img
                    src={about}
                    className='md:w-96 w-64 lg:mx-32 md:mx-0 mx-10 md:pb-0 pb-4'
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
                whileInView={{ opacity: 1, x:-10}}
                exit={{
                    opacity:0}}
                transition={{
                    ease:"easeInOut",
                    duration:1,
                }} className='space-y-8 mx-4'>
                <h1 className='md:text-3xl text-xl text-start font-bold text-[#243c5a] font-serif'>Why Choose <span className='text-purple-800 italic font-semibold'>myjourney.com</span> ? </h1>
                <h1 className='text-md text-gray-600 text-justify max-w-[36rem]'>MyJourney has cooperated with country that provide more than 600 beautiful place for you to enjoy and relax your free time from the hustle and bustle of this life. Don't be worry, you won't get loss because Tourink provide 100+ professional Tour Guide also. Our 5.k+ customers were satisfied with the services we provide. So what are you waiting for? Let's plan your holiday with us!</h1>
            </motion.div>
        </div>
    )
}

export default About;