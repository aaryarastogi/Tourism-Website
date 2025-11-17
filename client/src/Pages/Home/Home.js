import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import banner1 from '../../Images/banner1.jpeg'
import banner2 from '../../Images/banner2.jpeg'
import banner3 from '../../Images/banner3.jpeg'
import Options from './Options';
import { useLocation } from 'react-router-dom';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import HotelIcon from '@mui/icons-material/Hotel';
import TrainIcon from '@mui/icons-material/Train';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { useTheme } from '../../context/ThemeContext';

const Home=(props)=>{
    const { isDark } = useTheme();
    const location = useLocation();
    const { id , login } = location.state || {};
    
    const [currentBanner, setCurrentBanner] = React.useState(0);
    const banners = [banner1, banner2, banner3];

    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBanner((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const stats = [
        { icon: <FlightTakeoffIcon className="text-4xl" />, number: "50k+", label: "Flights Booked" },
        { icon: <HotelIcon className="text-4xl" />, number: "30k+", label: "Hotels Reserved" },
        { icon: <TrainIcon className="text-4xl" />, number: "25k+", label: "Train Tickets" },
        { icon: <DirectionsCarIcon className="text-4xl" />, number: "15k+", label: "Cab Rides" },
    ];

    return(
        <div className='w-full overflow-visible relative' id='home'>
           <div className='relative min-h-[500px] h-[calc(100vh-180px)] sm:h-[calc(100vh-160px)] md:h-[calc(100vh-140px)] lg:h-[calc(100vh-120px)] rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden shadow-2xl mt-3 sm:mt-4 md:mt-6 mx-2 sm:mx-3 md:mx-4 lg:mx-0'>
               {/* Background Images with Fade Transition */}
               <div className='absolute inset-0'>
                   {banners.map((banner, index) => (
                       <motion.div
                           key={index}
                           className='absolute inset-0'
                           initial={{ opacity: 0 }}
                           animate={{ opacity: currentBanner === index ? 1 : 0 }}
                           transition={{ duration: 1.5 }}
                       >
                           <img 
                               src={banner} 
                               alt={`Banner ${index + 1}`}
                               className='w-full h-full object-cover'
                           />
                       </motion.div>
                   ))}
               </div>
               
               {/* Gradient Overlay */}
               <div className='absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-purple-900/70 to-pink-900/80'></div>
               <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent'></div>
               
               {/* Content */}
               <div className='relative z-10 h-full flex flex-col justify-center items-center px-3 sm:px-4 md:px-8 text-center py-4 sm:py-6 md:py-8'>
                   <motion.div
                       initial={{ opacity: 0, y: 30 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ duration: 0.8 }}
                       className='max-w-5xl mx-auto flex-1 flex flex-col justify-center w-full'
                   >
                       <motion.h1 
                           className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white mb-3 sm:mb-4 md:mb-5 leading-tight px-2'
                           initial={{ opacity: 0, y: 20 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ duration: 0.8, delay: 0.2 }}
                       >
                           Discover Your Next
                           <span className='block bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent mt-1 sm:mt-2'>
                               Adventure
                           </span>
                       </motion.h1>
                       
                       <motion.p 
                           className='text-sm sm:text-base md:text-lg text-gray-200 mb-4 sm:mb-5 md:mb-6 max-w-2xl mx-auto leading-relaxed px-2 sm:px-0'
                           initial={{ opacity: 0, y: 20 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ duration: 0.8, delay: 0.4 }}
                       >
                           Explore breathtaking destinations, book flights, hotels, and create unforgettable memories with MyJourney
                       </motion.p>
                       
                       <motion.div 
                           className='flex flex-col sm:flex-row gap-2.5 sm:gap-3 justify-center items-center mb-4 sm:mb-5 md:mb-6 w-full px-2 sm:px-0'
                           initial={{ opacity: 0, y: 20 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ duration: 0.8, delay: 0.6 }}
                       >
                           <Link to='/flights' className='w-full sm:w-auto'>
                               <button className='w-full sm:w-auto px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-lg sm:rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-2xl hover:shadow-indigo-500/50 transform hover:-translate-y-1 text-sm sm:text-base md:text-lg'>
                                   Start Your Journey
                               </button>
                           </Link>
                           <button 
                               onClick={() => {
                                   const element = document.getElementById('discover');
                                   if (element) {
                                       element.scrollIntoView({ behavior: 'smooth' });
                                   }
                               }}
                               className='w-full sm:w-auto px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 bg-white/10 backdrop-blur-md text-white font-bold rounded-lg sm:rounded-xl border-2 border-white/30 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1 text-sm sm:text-base md:text-lg'
                           >
                               Explore Destinations
                           </button>
                       </motion.div>
                   </motion.div>
                   
                   {/* Statistics */}
                   <motion.div 
                       className='grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6 w-full max-w-5xl px-2 sm:px-3 md:px-4 mt-3 sm:mt-4 md:mt-5'
                       initial={{ opacity: 0, y: 30 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ duration: 0.8, delay: 0.8 }}
                   >
                       {stats.map((stat, index) => (
                           <motion.div
                               key={index}
                               className='bg-white/10 backdrop-blur-md rounded-lg sm:rounded-xl p-2.5 sm:p-3 md:p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2'
                               initial={{ opacity: 0, scale: 0.8 }}
                               animate={{ opacity: 1, scale: 1 }}
                               transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                           >
                               <div className='text-yellow-300 mb-1 flex justify-center'>
                                   <span className='text-2xl sm:text-3xl md:text-4xl'>{stat.icon}</span>
                               </div>
                               <h3 className='text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white mb-0.5 sm:mb-1'>{stat.number}</h3>
                               <p className='text-[10px] sm:text-xs md:text-sm text-gray-300 leading-tight'>{stat.label}</p>
                           </motion.div>
                       ))}
                   </motion.div>
               </div>
               
               {/* Banner Indicators */}
               <div className='absolute bottom-2 sm:bottom-3 md:bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex gap-1.5 sm:gap-2'>
                   {banners.map((_, index) => (
                       <button
                           key={index}
                           onClick={() => setCurrentBanner(index)}
                           className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                               currentBanner === index 
                                   ? 'w-6 sm:w-8 bg-white' 
                                   : 'w-1.5 sm:w-2 bg-white/50 hover:bg-white/75'
                           }`}
                           aria-label={`Go to banner ${index + 1}`}
                       />
                   ))}
               </div>
           </div>
           <div className="relative z-20 pt-2 sm:pt-3 md:pt-4">
           <Options/>
           </div>
        </div>
    )
}

export default Home;