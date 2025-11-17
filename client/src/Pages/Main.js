import React from "react";
import Home from "./Home/Home";
import Offers from "./Offers/Offers";
import Explore from "./Explore/Explore";
import Feedback from "./Feedback/Feedback";
import About from "./About/About";
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import Footer from "./Footer/Footer";

const Main=()=>{
    return(
        <div className='overflow-x-hidden overflow-y-visible'>
            <Home/>
        <div className='mt-20 md:mt-24 px-4 md:px-8'> 
            <div className='flex items-center justify-center mb-12'>
                <h1 className='text-gray-400 text-sm font-medium flex items-center gap-2 animate-bounce cursor-pointer hover:text-indigo-600 transition-colors duration-300'>
                    <KeyboardDoubleArrowDownIcon className='text-lg'/>Explore More<KeyboardDoubleArrowDownIcon className='text-lg'/>
                </h1>
            </div>
            {/* <Offers/> */}
            <Explore/>
            <div className='my-20'>
                <Feedback/>
            </div>
        </div> 
        <About/>
        <Footer/>
      </div>
    )
}

export default Main;