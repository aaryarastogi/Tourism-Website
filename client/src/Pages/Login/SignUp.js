import React, { useState } from "react";
import login from '../../Images/loginbackground.jpeg'
import { Button, FormControl, IconButton, Input, InputAdornment, InputLabel, TextField, Tooltip, styled }from '@mui/material'
import GoogleIcon from '@mui/icons-material/Google';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PropTypes from 'prop-types'
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import GoogleLogin from "react-google-login";

import {motion} from 'framer-motion'
import { baseUrl } from "../../HelperUrl/Helper";

const EmailStyling=styled(TextField)(({ theme }) => ({
  width: '15rem',
  background: 'transparent',
  [theme.breakpoints.up('sm')]: {
    // marginLeft:'20%'
},
}))

const pageVariants = {
    initial: {
      rotateY: -90,
      opacity: 0,
    },
    in: {
      rotateY: 0,
      opacity: 1,
      transition: {
        duration: 1,
      },
    },
    out: {
      rotateY: 90,
      opacity: 0,
      transition: {
        duration: 1,
      },
    },
  };

const Login=()=>{
    const history=useNavigate()

    const[username,setUsername]=useState('');
    const[email,setEmail]=useState('');
    const[password,setPassword]=useState('');
    const[phoneNumber,setPhoneNumber]=useState();

    const submitSignup=async(e)=>{
        e.preventDefault();
        try{
            await axios.post(`${baseUrl}/signup`,{
                username,email,password,phoneNumber
            })
            .then(res=>{
                if(res.data=="exist"){
                    alert("User already exist")
                }
                else if(res.data=="notexist"){
                    history("/registered",{state:{id:email}})
                    console.log(res.data)
                }

            })
            .catch(e=>{
                alert("wrong details")
                console.log(e.message);
            })
        }
        catch(e){
            console.log(e);
        }
    }

    let login = false;

    const responseSuccessGoogle = (response) => {
        console.log(response);
        const { tokenId } = response;
        fetch(`${baseUrl}/api/authenticate`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${tokenId}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tokenId }),
        })
        .then(res => res.json())
        .then(data => {
            console.log("data", data);
            if (data.success) {
                login = true;
                localStorage.setItem('token', data.token); 
                localStorage.setItem('login',login);
                history("/", { state: { id: data.user.username , login:login } });
                window.location.reload(); 
            } else {
                console.error('Authentication failed:', data.message);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };
    
    const responseFailureGoogle=(response)=>{
        console.log("failed");
    }

    return(
        <motion.div className="w-full md:h-screen h-auto"
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        style={{ perspective: 2000 }}>
            <div className='grid md:grid-cols-2 md:w-7/12 md:h-auto md:ml-auto md:mr-auto md:shadow-xl rounded-xl '>
                <div className="md:my-auto my-16 space-y-6">
                    <h1 className="font-bold capitalize text-white text-3xl">Welcome Back!</h1>
                    <h1 className="text-white text-md ">To keep connected with us please login with your personal info</h1>
                    <div className="bg-transparent border-2 rounded-full w-44 p-2 mx-auto text-xl text-white cursor-pointer"><Link to='/signin'>Sign in</Link></div>
                </div>
                
                <div className="flex flex-col items-center justify-center text-center bg-white rounded-tr-xl rounded-br-xl">
                    <div className="my-16 space-y-4">
                        <h1 className="text-3xl font-bold text-green-600">Create Account</h1>
                        {/* <Tooltip title="Login with Google">
                            <h1 className="text-center border-2 border-gray-200 rounded-full p-2 w-12 cursor-pointer mx-auto"><GoogleIcon/></h1>
                        </Tooltip> */}
                        <GoogleLogin
                            className="border-2 border-gray-200 rounded-full p-2 w-24 cursor-pointer mx-[40%]"
                            clientId="297704508492-ci2ff1dipf6i9sliop0m02k2pqtcdalo.apps.googleusercontent.com"
                            buttonText="Login"
                            onSuccess={responseSuccessGoogle}
                            onFailure={responseFailureGoogle}
                            // cookiePolicy={'single_host_origin'}
                        />
                            <h1 className="text-md text-gray-500">or use your email for registration</h1>
                                <EmailStyling label="Name" required={true} variant="outlined" value={username} onChange={(e) => setUsername(e.target.value)}/>
                                <EmailStyling label="Email" required={true} variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)} />
                                <EmailStyling label="Password" variant="outlined" value={password} type="password" onChange={(e) => setPassword(e.target.value)}/>
                                <EmailStyling label="Phone Number" required={true} variant="outlined" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}/>
                                <div className="uppercase p-2 font-semibold text-white text-xl cursor-pointer bg-gradient-to-br from-[#2AD883] to-[#0575E6] rounded-full px-8 w-36 mx-auto" onClick={submitSignup}>Sign Up</div>
                    </div>
                </div>

            </div>
        </motion.div>
    )
}

Login.propTypes={
    setToken:PropTypes.func.isRequired
}

export default Login;