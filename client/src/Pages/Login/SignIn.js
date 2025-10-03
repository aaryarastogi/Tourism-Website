import React, { useEffect, useState } from "react";
import { Button, FormControl, IconButton, Input, InputAdornment, InputLabel,TextField, Tooltip, styled }from '@mui/material'
import GoogleIcon from '@mui/icons-material/Google';
import PropTypes from 'prop-types';
import axios from "axios"
import { Link, useNavigate } from "react-router-dom";
import GoogleLogin from 'react-google-login'
import {gapi} from 'gapi-script'

import {motion} from 'framer-motion'
import backend_url from "../../config";

const EmailStyling=styled(TextField)(({ theme }) => ({
  width: '15rem',
  background: 'transparent',
  [theme.breakpoints.up('sm')]: {
    // marginLeft:'20%',
  },
}))

const pageVariants = {
    initial: {
      rotateY: 90,
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
      rotateY: -90,
      opacity: 0,
      transition: {
        duration: 1,
      },
    },
  };
  

const SignIn=()=>{
    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);

    const[username,setUsername]=useState();
    const[email,setEmail]=useState();
    const[password,setPassword]=useState();
    const[phoneNumber,setPhoneNumber]=useState();

    const navigate=useNavigate()
    let name="";
    let login=false;

    const submit=async(e)=>{
        e.preventDefault();
        try{
            await axios.post(`${backend_url}/signin`,{
                username,email,password,phoneNumber
            })
            .then(res=>{
                if(res.data=="notexist"){
                    alert("User is not found")
                }
                else if(res.data){
                    console.log("login....",res.data)
                    name=res.data.username
                    if(email && password){
                        alert("Succesfully login...")
                    }
                    else{
                        alert("Kindly fill all details!")
                    }
                    login=true;
                    localStorage.setItem("token",res.data.tokens[0].token);
                    localStorage.setItem("loginState", login);
                    navigate("/", { state: { id: name , login:login } });
                    window.location.reload();
                }
            })
            .catch(e=>{
                alert("wrong details")
                console.log(e);
            })
        }
        catch(e){
            console.log(e);
        }
    }


    const clientId="297704508492-ci2ff1dipf6i9sliop0m02k2pqtcdalo.apps.googleusercontent.com"

    const responseSuccessGoogle=(response)=>{
        console.log(response);
        const { tokenId } = response;
        fetch(`${backend_url}/api/authenticate`, {
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
                navigate("/", { state: { id: data.user.username , login:login } });
                window.location.reload(); 
            } else {
                console.error('Authentication failed:', data.message);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    const responseFailureGoogle=()=>{
        console.log('failed')
    }

    return(
        <motion.div className="w-full md:h-screen h-auto"
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        style={{ perspective: 2000 }}>
            <div className='grid md:grid-cols-2 md:w-7/12 w-auto md:h-auto md:ml-auto md:mr-auto md:shadow-xl rounded-xl '>
                
                <div className=" flex flex-col text-start bg-white rounded-tl-xl rounded-bl-xl">
                    <div className="my-16 space-y-4 items-center justify-center text-center">
                        <h1 className="text-3xl font-bold text-green-600">Sign in to myjourney</h1>
                        <Tooltip title="Login with Google">
                            <GoogleLogin
                                className="text-center border-2 border-gray-200 rounded-full p-2 w-24 cursor-pointer mx-[40%]"
                                clientId={clientId}
                                buttonText="Login"
                                onSuccess={responseSuccessGoogle}
                                onFailure={responseFailureGoogle}
                            />
                        </Tooltip>
                            <h1 className="text-md text-gray-500">or use your email account</h1>
                            <EmailStyling label="Email" variant="outlined" value={email} onChange={e=> setEmail(e.target.value)} />
                            <EmailStyling  label="Password"  type="password" variant="outlined" value={password} onChange={e=> setPassword(e.target.value)}/>
                            <h1 className="mx-auto text-gray-600 cursor-pointer">Forgot your password</h1>
                            <div className="uppercase p-2 font-semibold text-white text-xl cursor-pointer bg-gradient-to-br from-[#2AD883] to-[#0575E6] rounded-full px-8 w-36 mx-auto" onClick={submit}>Sign in</div>
                    </div>
                </div>
                
                <div className="md:my-auto my-16 space-y-6">
                    <h1 className="font-bold capitalize text-white text-3xl">Hello, Friend!</h1>
                    <h1 className="text-white text-md ">Enter your personal details and start journey with us</h1>
                    <div className="bg-transparent border-2 rounded-full w-44 p-2 mx-auto text-xl text-white cursor-pointer uppercase"><Link to='/signup'>Sign up</Link></div>
                </div>

            </div>
        </motion.div>
    )
}


export default SignIn;