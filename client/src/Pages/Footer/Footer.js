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
        <div className='bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 text-white mt-20'>
            <div className='grid md:grid-cols-4 md:mx-16 mx-4 md:mt-12 mt-8 md:pb-12 pb-8 pt-12 gap-8'>
                <div className='text-start space-y-4'>
                    <h1 className='font-bold md:text-3xl text-2xl bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent'>MyJourney<span className='text-white'>.com</span></h1>
                    <p className='text-sm text-gray-300 leading-relaxed max-w-xs'>Experience unforgettable journeys with our premium travel services. Your adventure starts here.</p>
                </div>
                <div className='text-start space-y-4'>
                    <h1 className='font-bold md:text-xl text-lg text-white mb-4'>Menu</h1>
                    <div className='space-y-2'>
                        <h1 className='text-gray-300 hover:text-indigo-400 cursor-pointer transition-colors duration-200' onClick={handleHome}>Home</h1>
                        <h1 className='text-gray-300 hover:text-indigo-400 cursor-pointer transition-colors duration-200' onClick={handleAbout}>About Us</h1>
                    </div>
                </div>
                <div className='text-start space-y-4'>
                    <h1 className='font-bold md:text-xl text-lg text-white mb-4'>Booking Plan</h1>
                    <div className='space-y-2'>
                        <h1 className='text-gray-300 hover:text-indigo-400 cursor-pointer transition-colors duration-200'>Group Trip</h1>
                        <h1 className='text-gray-300 hover:text-indigo-400 cursor-pointer transition-colors duration-200'>Personal Trip</h1>
                    </div>
                </div>
                <div className='text-start space-y-4'>
                    <h1 className='font-bold md:text-xl text-lg text-white mb-4'>Further Information</h1>
                    <div className='space-y-2'>
                        <h1 className='text-gray-300 hover:text-indigo-400 cursor-pointer transition-colors duration-200'>Terms & Conditions</h1>
                        <h1 className='text-gray-300 hover:text-indigo-400 cursor-pointer transition-colors duration-200'>Privacy Policy</h1>
                    </div>
                </div>
            </div>
            <div className='border-t border-gray-700 py-6'>
                <h1 className='text-sm text-gray-400 text-center flex items-center justify-center gap-1'>Copyright <CopyrightIcon className='text-xs'/> 2025 MyJourney. All Rights Reserved.</h1>
            </div>
        </div>
    )
}

export default Footer;