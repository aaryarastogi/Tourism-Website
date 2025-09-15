import { TextField, styled } from '@mui/material';
import {Link} from 'react-router-dom'
import SearchIcon from '@mui/icons-material/Search';
import 'react-multi-carousel/lib/styles.css';
import './CustomArrow.css';
import Carousel from 'react-multi-carousel';
import React, { useEffect, useRef, useState } from 'react'
import {motion} from 'framer-motion'
import axios from 'axios'

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
        axios.get(`http://localhost:8000/api/places`)
          .then(response => setPlaces(response.data))
          .catch(error => console.error(error));
      }, []);

    const[search,setSearch]=useState('');

    return(
        <div id='discover'>
            <div className='flex flex-row py-6'>
                <h1 className='text-start md:ml-10 ml-2 capitalize md:text-3xl text-xl font-semibold font-serif'>Find Popular Destinations</h1>
                <SearchStyle 
                    onChange={(e)=>setSearch(e.target.value)}
                    id="standard-search" label="Search" type="search" variant="standard"
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
                                 className='ml-4 rounded-md bg-transparent space-y-4 py-4 px-6 drop-shadow-md w-auto h-auto my-8 cursor-pointer'>
                                <img src={place.image} className='w-9/12 h-36 mx-auto rounded-t-full'></img>
                                <h1 className='text-md mx-2 text-center font-bold uppercase'>{place.name}</h1>
                                <p className='text-sm mx-2 text-center font-semibold text-gray-600'>{place.city}</p>
                            </motion.div>
                        </Link>
                    ))
                }
            </Carousel>
        </div>
    )
}

export default Explore;