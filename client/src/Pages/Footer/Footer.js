import React from 'react'
import CopyrightIcon from '@mui/icons-material/Copyright';
import { Link } from 'react-router-dom';

const Footer=()=>{
    const handleHome=()=>{
        const element=document.getElementById("home");
        if(element){
        element.scrollIntoView({behavior:"smooth"})
        }
    }

    const handleAbout=()=>{
        const element=document.getElementById("about");
        if(element){
        element.scrollIntoView({behavior:"smooth"})
        }
    }

    return(
        <div>
            <div className='grid md:grid-cols-4 md:mx-16 md:mt-0 mt-6 pb-6'>
                <div className='ml-6 text-start space-y-2'>
                    <h1 className='font-semibold md:text-2xl text-xl text-headingcolor'>MyJourney<span className='text-gray-800'>.com</span></h1>
                    <h1 className='text-md text-gray-800 w-64'>Enjoy the tourism with myjourney.com</h1>
                </div>
                <div className='md:ml-0 ml-6 text-start'>
                    <h1 className='font-semibold md:text-2xl text-xl'>Menu</h1>
                    <h1 className='cursor-pointer' onClick={handleHome}>Home</h1>
                    <h1 className='cursor-pointer' onClick={handleAbout}>About Us</h1>
                </div>
                <div className='md:ml-0 ml-6 text-start'>
                    <h1 className='font-semibold md:text-2xl text-xl'>Booking Plan</h1>
                    <h1>Group Trip</h1>
                    <h1>Personal Trip</h1>
                </div>
                <div className='md:ml-0 ml-6 text-start'>
                    <h1 className='font-semibold md:text-2xl text-xl'>Further Information</h1>
                    <h1>Terms & Conditions</h1>
                    <h1>Privacy Policy</h1>
                </div>
            </div>
            <h1 className='text-md text-slate-700 py-6'>Copyright <CopyrightIcon/> 2021 MyJourney. All Rights Reserved.</h1>
        </div>
    )
}

export default Footer;