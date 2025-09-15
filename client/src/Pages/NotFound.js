import React from "react";

//assets
import notfound from '../Images/notfound.png'

const NotFound=()=>{
    return(
        <div className="flex flex-col items-center justify-center min-h-screen overflow-hidden">
            <img src={notfound} className="w-96"></img>
            <h1 className="md:text-3xl text-xl font-serif font-semibold text-headingcolor">Oops! Page Not Found!!!</h1>
        </div>
    )
}

export default NotFound;