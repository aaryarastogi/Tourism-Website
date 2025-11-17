import React from 'react'
import Carousel from 'react-multi-carousel';
import female from '../../Images/female.jpeg';
import StarIcon from '@mui/icons-material/Star';
import feeddata from './feeddata';

import {motion} from 'framer-motion'

const Feedback=()=>{

    const responsive = {
        desktop: {
          breakpoint: { max: 3000, min: 1024 },
          items: 3,
        },
        tablet: {
          breakpoint: { max: 1024, min: 464 },
          items: 1, 
        },
        mobile: {
          breakpoint: { max: 464, min: 0 },
          items: 1
        }
      }

    return(
        <div className='py-12 px-4 md:px-8'>
            <div className='text-center mb-12'>
                <h1 className='text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4'>Our Customer Feedback</h1>
                <p className='text-lg text-gray-600'>See what our customers told about us</p>
            </div>
            <Carousel
                swipeable={false}
                draggable={false}
                showDots={false}
                arrows={false}
                responsive={responsive}
                infinite={true}
                autoPlay={true}
                autoPlaySpeed={1000}
                keyBoardControl={true}
                customTransition="all .5"
                transitionDuration={500}
                containerClass="carousel-container"
            >
                {
                    feeddata.map(feed=>(
                        <motion.div 
                        initial={{
                            opacity:0,
                            x:-10
                        }}
                        whileInView={{ opacity: 1 , x:0}}
                        exit={{
                          opacity:0}}
                        transition={{
                          ease:"easeInOut",
                          duration:2,
                        }} className='bg-white hover:shadow-2xl w-auto ml-4 p-6 rounded-2xl my-4 border border-gray-200 transition-all duration-300 transform hover:-translate-y-2'>
                            <div className='flex flex-row items-center mb-4'>
                                <img src={feed.image} className='md:w-16 md:h-16 w-12 h-12 rounded-full object-cover border-2 border-indigo-200'/>
                                <div className='flex flex-col ml-4 text-start flex-1'>
                                    <h1 className='text-lg font-bold text-gray-800'>{feed.name}</h1>
                                    <h1 className='text-sm text-gray-500'>{feed.city}</h1>
                                </div>
                                <div className='flex'>
                                    <StarIcon className='text-yellow-400 text-2xl'/>
                                </div>
                            </div>
                            <p className='mt-4 text-justify md:text-base text-sm text-gray-700 leading-relaxed'>{feed.feed}</p>
                        </motion.div>
                    ))
                }
            </Carousel>
        </div>
    )
}

export default Feedback;