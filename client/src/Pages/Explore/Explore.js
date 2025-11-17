import { TextField, styled } from '@mui/material';
import {Link} from 'react-router-dom'
import SearchIcon from '@mui/icons-material/Search';
import 'react-multi-carousel/lib/styles.css';
import './CustomArrow.css';
import Carousel from 'react-multi-carousel';
import React, { useEffect, useRef, useState } from 'react'
import {motion} from 'framer-motion'
import axios from 'axios'
import backend_url from '../../config';
import { useTheme } from '../../context/ThemeContext';

const SearchStyle=styled(TextField)(({ theme }) => ({
    marginLeft:'auto',
    marginRight:'10rem',
    fontWeight:'normal',
    fontSize:'86px',
    width:'25rem',
    [theme.breakpoints.down('md')]: {
        marginRight:'0rem',
        width:'22rem'
    },
}))

const Explore =()=>{
    const { isDark } = useTheme();
    const responsive = {
        desktop: {
          breakpoint: { max: 3000, min: 1024 },
          items: 5,
        },
        tablet: {
          breakpoint: { max: 1024, min: 464 },
          items: 2,
          slidesToSlide: 2 // optional, default to 1.
        },
        mobile: {
          breakpoint: { max: 464, min: 0 },
          items: 1,
          slidesToSlide: 1 // optional, default to 1.
        }
    }

    const[places,setPlaces]=useState([]);
    useEffect(() => {
        axios.get(`${backend_url}/api/places`)
          .then(response => setPlaces(response.data))
          .catch(error => console.error(error));
      }, []);

    const[search,setSearch]=useState('');

    return(
        <div id='discover' className='py-12 px-4 md:px-8'>
            <div className='flex flex-col md:flex-row md:items-center md:justify-between py-6 mb-8'>
                <h1 className='text-start md:ml-10 ml-2 capitalize md:text-4xl text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 md:mb-0'>Find Popular Destinations</h1>
                <SearchStyle 
                    onChange={(e)=>setSearch(e.target.value)}
                    id="standard-search" label="Search destinations..." type="search" variant="standard"
                />
            </div>
            <Carousel
                    swipeable={false}
                    draggable={false}
                    showDots={false}
                    responsive={responsive}
                    ssr={true} 
                    infinite={true}
                    autoPlay={false}
                    autoPlaySpeed={1000}
                    keyBoardControl={true}
                    customTransition="all .5"
                    transitionDuration={500}
                    containerClass="carousel-container"
                    arrows={<div className="react-multiple-carousel__arrow" />}
                    dotListClass="custom-dot-list-style"
                    itemClass="carousel-item-padding-40-px"
            >
                {
                    places.filter((item)=>{
                        return search.toLowerCase() === '' 
                        ? item 
                        : item.name.toLowerCase().includes(search);
                    }).map((place,index)=>(
                        <Link to={`/place/${place._id}`}>
                            <motion.div 
                                initial={{
                                    y:-10,
                                    scale:0.5,
                                    opacity:0
                                }}
                                whileInView={{ opacity: 1, x:0, y:0, scale:1}}
                                exit={{
                                    y:-10,
                                    scale:0.5,
                                opacity:0}}
                                transition={{
                                ease:"easeInOut",
                                duration:1,
                                }}
                                 className={`ml-4 rounded-2xl ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} shadow-lg hover:shadow-2xl space-y-4 py-6 px-6 w-auto h-auto my-8 cursor-pointer group transition-all duration-300 transform hover:-translate-y-2 border overflow-hidden`}>
                                <div className='relative overflow-hidden rounded-xl'>
                                    <img src={place.image} className='w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500'></img>
                                    <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                                </div>
                                <div className='space-y-1'>
                                    <h1 className={`text-lg mx-2 text-center font-bold ${isDark ? 'text-gray-200 group-hover:text-indigo-400' : 'text-gray-800 group-hover:text-indigo-600'} transition-colors duration-300`}>{place.name}</h1>
                                    <p className={`text-sm mx-2 text-center font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{place.city}</p>
                                </div>
                            </motion.div>
                        </Link>
                    ))
                }
            </Carousel>
        </div>
    )
}

export default Explore;