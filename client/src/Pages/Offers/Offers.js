import { Button, Divider, IconButton, styled } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {allOffers, flights, trains} from './data.js'
import {hotels} from "./data.js";
import Carousel from "react-multi-carousel";
import {motion} from 'framer-motion';

const StyledButton=styled(Button)({
    background:'blue',
    width:32,
    color:'white',
    cursor:"pointer",
    marginLeft:'auto',
    marginRight:'auto',
    paddingTop:10,
    paddingLeft:10,
    paddingRight:10,
    paddingBottom:10
})

const Offers=()=>{

    const responsive = {
        desktop: {
          breakpoint: { max: 3000, min: 1024 },
          items: 2,
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

    const [activeLink, setActiveLink] = useState('alloffers');

    const handleLinkClick = (link) => {
        setActiveLink(link);
    };


    return(
        <motion.div 
        initial={{
            x:-100,
            y:-10,
            scale:0.5,
            opacity:0
        }}
        whileInView={{ opacity: 1, x:0, y:0, scale:1}}
        exit={{
          x:-100,
            y:-10,
            scale:0.5,
          opacity:0}}
        transition={{
          ease:"easeInOut",
          duration:2,
        }}
        className="flex flex-col w-auto h-auto bg-gradient-to-tr from-[#FA8BFF] via-[#2BD2FF] to-[#2BFF88] drop-shadow-md md:mx-10 mx-2 pb-6 rounded-md overflow-hidden" id="offers">
           {/* <div className="cursor-pointer bg-gradient-to-r from-blue-400 to-blue-800 w-auto py-2 px-6 rounded-3xl uppercase text-white ml-auto mr-auto hover:text-blue-800">Search</div> */}
            <div className="flex flex-row md:p-6 p-2">
                <h1 className="md:text-3xl text-xl text-headingcolor font-bold">Offers</h1>
                <div className="flex flex-col md:block hidden">
                    <div className="flex flex-row space-x-8 ml-10 mt-2">
                        <h1 className={`text-md font-semibold text-gray-600 hover:text-purple-800 cursor-pointer ${activeLink === 'alloffers' ? 'text-purple-800' : 'text-gray-600'}`} onClick={() => handleLinkClick('alloffers')}>All Offers</h1>
                        <h1 className={`text-md font-semibold text-gray-600 hover:text-purple-800 cursor-pointer ${activeLink === 'flights' ? 'text-purple-800' : 'text-gray-600'}`} onClick={() => handleLinkClick('flights')}>Flights</h1>
                        <h1 className={`text-md font-semibold text-gray-600 hover:text-purple-800 cursor-pointer ${activeLink === 'hotels' ? 'text-purple-800' : 'text-gray-600'}`} onClick={() => handleLinkClick('hotels')}>Hotels</h1>
                        <h1 className={`text-md font-semibold text-gray-600 hover:text-purple-800 cursor-pointer ${activeLink === 'trains' ? 'text-purple-800' : 'text-gray-600'}`} onClick={() => handleLinkClick('trains')}>Trains</h1>
                        {/* <h1 className={`text-md font-semibold text-gray-600 hover:text-purple-800 cursor-pointer ${activeLink === 'hospitals' ? 'text-purple-800' : 'text-gray-600'}`} onClick={() => handleLinkClick('hospitals')}>Hospitals</h1> */}
                        {/* <h1 className={`text-md font-semibold text-gray-600 hover:text-purple-800 cursor-pointer ${activeLink === 'holiday' ? 'text-purple-800' : 'text-gray-600'}`} onClick={() => handleLinkClick('holiday')}>Holiday Packages</h1> */}
                    </div>
                    <hr className="w-[20rem] ml-10 my-2 bg-gray-600"/>
                </div>
                {/* <h1 className="text-xl text-headingcolor font-bold ml-auto mt-2 cursor-pointer">View All</h1> */}
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
            { activeLink==='flights' &&
                flights.map((item,index)=>(
                <div className='flex flex-col md:flex-row bg-white drop-shadow-lg w-auto rounded-md mx-6 my-2 pl-6 pt-10 cursor-pointer' >
                <div className="flex flex-col md:flex-row ">
                <img src={item.image1} className="w-36 h-36 rounded-md mb-10"></img>
                <div className="ml-2 md:ml-4 space-y-1">
                    <h1 className="text-start text-gray-600 font-semibold text-md">{item.title}</h1>
                    <h1 className="text-start font-bold text-xl">{item.para}</h1>
                    <hr className="w-16 bg-blue-500"/>
                    <h1 className="text-start text-gray-600 text-md">{item.secondpara}</h1>
                </div>
                </div>
                <h1 className="text-blue-400 hover:text-blue-600 uppercase font-semibold ml-auto mt-8 my-2 mr-2 cursor-pointer">BOOK NOW</h1>
                </div>
            ))}
            { activeLink==='hotels' &&
                hotels.map((item,index)=>(
                <div className='flex flex-col md:flex-row bg-white drop-shadow-lg w-auto rounded-md mx-6 my-2 pl-6 pt-10 cursor-pointer' >
                <div className="flex flex-col md:flex-row ">
                <img src={item.image1} className="w-36 h-36 rounded-md mb-10"></img>
                <div className="ml-4 space-y-1">
                    <h1 className="text-start font-bold text-xl capitalize">{item.title}</h1>
                    {/* <h1 className="text-start font-bold text-xl">{item.para}</h1> */}
                    <hr className="w-16 bg-blue-500"/>
                    <h1 className="text-start text-gray-600 text-md">{item.secondpara}</h1>
                </div>
                </div>
                <h1 className="text-blue-400 hover:text-blue-600 uppercase font-semibold ml-auto mt-8 my-2 mr-2 cursor-pointer">View Details</h1>
                </div>
            ))}
            { activeLink==='trains' &&
                trains.map((item,index)=>(
                <div className='flex flex-col md:flex-row bg-white drop-shadow-lg w-auto rounded-md mx-6 my-2 pl-6 pt-10 cursor-pointer' >
                <div className="flex flex-col md:flex-row ">
                <img src={item.image1} className="w-36 h-36 rounded-md mb-10"></img>
                <div className="ml-4 space-y-1">
                    <h1 className="text-start font-bold text-xl capitalize">{item.title}</h1>
                    {/* <h1 className="text-start font-bold text-xl">{item.para}</h1> */}
                    <hr className="w-16 bg-blue-500"/>
                    <h1 className="text-start text-gray-600 text-md">{item.secondpara}</h1>
                </div>
                </div>
                <h1 className="text-blue-400 hover:text-blue-600 uppercase font-semibold ml-auto mt-8 my-2 mr-2 cursor-pointer">BOOK NOW</h1>
                </div>
            ))}
            { activeLink==='alloffers' &&
                allOffers.map((item,index)=>(
                <div className='flex flex-col md:flex-row bg-white drop-shadow-lg w-auto rounded-md mx-6 my-2 pl-6 pt-10 cursor-pointer' >
                <div className="flex flex-col md:flex-row ">
                <img src={item.image1} className="w-36 h-36 rounded-md mb-10"></img>
                <div className="ml-4 space-y-1">
                    <h1 className="text-start text-gray-600 font-semibold text-md">{item.title}</h1>
                    <h1 className="text-start font-bold text-xl">{item.para}</h1>
                    <hr className="w-16 bg-blue-500"/>
                    <h1 className="text-start text-gray-600 text-md">{item.secondpara}</h1>
                </div>
                </div>
                <h1 className="text-blue-400 hover:text-blue-600 uppercase font-semibold ml-auto mt-8 my-2 mr-2 cursor-pointer">BOOK NOW</h1>
                </div>
            ))}
            </Carousel>
        </motion.div>
    )
}

export default Offers;