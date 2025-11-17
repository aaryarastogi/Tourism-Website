import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

//assets
import flight from '../../Images/airplane.png'
import bus from '../../Images/train.png'
import cabs from '../../Images/cab.png'
import forex from '../../Images/forex.png'
import hotels from '../../Images/hotels.png'

const Options=()=>{
    const { isDark } = useTheme();
    const services = [
        { 
            to: '/flights', 
            icon: flight, 
            label: 'Flights', 
            gradient: 'from-blue-500 to-indigo-600',
            hoverGradient: 'from-blue-600 to-indigo-700'
        },
        { 
            to: '/trains', 
            icon: bus, 
            label: 'Trains', 
            gradient: 'from-green-500 to-emerald-600',
            hoverGradient: 'from-green-600 to-emerald-700'
        },
        { 
            to: '/hotels', 
            icon: hotels, 
            label: 'Hotels', 
            gradient: 'from-purple-500 to-pink-600',
            hoverGradient: 'from-purple-600 to-pink-700'
        },
        { 
            to: '/cabs', 
            icon: cabs, 
            label: 'Cabs', 
            gradient: 'from-orange-500 to-red-600',
            hoverGradient: 'from-orange-600 to-red-700'
        },
        { 
            to: '/forex', 
            icon: forex, 
            label: 'Forex', 
            gradient: 'from-yellow-500 to-amber-600',
            hoverGradient: 'from-yellow-600 to-amber-700'
        }
    ];

    return(
        <div className={`relative ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200/50'} shadow-2xl md:h-auto h-auto rounded-3xl mt-8 md:mt-12 mx-auto border z-[100] w-[95%] md:w-[88%] lg:w-[82%] xl:w-[75%] 2xl:w-[70%] transition-colors duration-300`}>
            <div className="md:px-8 px-4 md:py-6 py-5 pb-6 md:pb-7 flex flex-row md:space-x-6 space-x-3 lg:space-x-8 justify-around items-center">
                {services.map((service, index) => (
                    <Link 
                        key={index}
                        to={service.to} 
                        className="group flex flex-col items-center justify-center space-y-3 cursor-pointer flex-1 max-w-[120px]"
                    >
                        {/* Icon Container */}
                        <div className={`relative p-3 md:p-4 bg-gradient-to-br ${service.gradient} rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-110 group-hover:-translate-y-2 group-hover:rotate-3`}>
                            <div className={`absolute inset-0 bg-gradient-to-br ${service.hoverGradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                            <img 
                                src={service.icon} 
                                className="relative z-10 md:w-10 w-8 h-auto filter brightness-0 invert drop-shadow-md"
                                alt={service.label}
                            />
                        </div>
                        
                        {/* Label */}
                        <h1 className={`text-sm md:text-base font-bold ${isDark ? 'text-gray-200 group-hover:text-indigo-400' : 'text-gray-800 group-hover:text-indigo-600'} transition-colors duration-300 text-center`}>
                            {service.label}
                        </h1>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default Options;