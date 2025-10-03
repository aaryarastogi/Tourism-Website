import React from 'react'
import tour from '../../Images/index.jpeg'
import Options from './Options';
import { useLocation } from 'react-router-dom';
import tourism from '../../Images/tour.mp4'

const Home=(props)=>{
    const location = useLocation();
    const { id , login } = location.state || {};
    return(
        <div className='w-full overflow-x-hidden' id='home'>
           <video src={tourism} autoPlay loop muted className='flex md:w-full mt-6 lg:h-[80vh] rounded-md' />
           <Options/>
        </div>
    )
}

export default Home;