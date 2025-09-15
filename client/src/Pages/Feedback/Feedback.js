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
        <div>
            <h1 className='text-2xl font-serif font-semibold italic'>Our Customer Feedback</h1>
            <h1 className='text-md py-2 text-gray-700'>See what our customers told about us</h1>
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
                        }} className='bg-transparent hover:shadow-xl w-auto w-auto ml-4 p-4 rounded-md my-4 border-2 border-cyan-400'>
                            <div className='flex flex-row'>
                                <img src={feed.image} className='md:w-16 md:h-16 w-12 h-12 mt-2 rounded-full'/>
                                <div className='flex flex-col ml-4 text-start mt-2'>
                                    <h1 className='text-xl font-semibold'>{feed.name}</h1>
                                    <h1>{feed.city}</h1>
                                </div>
                                <StarIcon className='ml-auto mt-2 text-yellow-300 text-2xl'/>
                            </div>
                            <h1 className='mt-4 text-justify md:text-md text-normal'>{feed.feed}</h1>
                        </motion.div>
                    ))
                }
            </Carousel>
        </div>
    )
}

export default Feedback;