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
        <div>
            <Home/>
        <div className='mt-24'> 
            <h1 className='mb-6 text-white cursor-pointer'><KeyboardDoubleArrowDownIcon/>Explore More<KeyboardDoubleArrowDownIcon/></h1>
            {/* <Offers/> */}
            <Explore/>
            <Feedback/>
        </div> 
        <About/>
        <Footer/>
      </div>
    )
}

export default Main;