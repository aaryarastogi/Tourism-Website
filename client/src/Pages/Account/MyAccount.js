import React, { useEffect, useState, useCallback } from "react";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ar from '../../Images/AR.jpeg'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import CardTravelIcon from '@mui/icons-material/CardTravel';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import LinkIcon from '@mui/icons-material/Link';
import CloseIcon from '@mui/icons-material/Close';
import CropIcon from '@mui/icons-material/Crop';
import { Button, Popover, Typography, styled, Dialog, DialogContent } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import backend_url from "../../config";
import Cropper from 'react-easy-crop';
import 'react-easy-crop/react-easy-crop.css';
import { useTheme } from "../../context/ThemeContext";

const MyAccount=()=>{
    const { isDark } = useTheme();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const[username,setUsername]=useState('');
    const[phnNumber,setPhnNumber]=useState();
    const[email,setEmail]=useState('');
    const[logined,setLogined]=useState(false);
    const[token,setToken]=useState('');
    const[profileImage,setProfileImage]=useState(null);
    const[isEditingName,setIsEditingName]=useState(false);
    const[isEditingUsername,setIsEditingUsername]=useState(false);
    const[editName,setEditName]=useState('');
    const[editUsername,setEditUsername]=useState('');
    const[showImageEditor,setShowImageEditor]=useState(false);
    const[imageSrc,setImageSrc]=useState(null);
    const[crop,setCrop]=useState({ x: 0, y: 0 });
    const[zoom,setZoom]=useState(1);
    const[croppedAreaPixels,setCroppedAreaPixels]=useState(null);
    const[imageUrl,setImageUrl]=useState('');
    const[isSavingImage,setIsSavingImage]=useState(false);

    useEffect(()=>{
        const storedToken=localStorage.getItem('token');
        const loginState=localStorage.getItem('loginState');

        if(storedToken){
            setToken(storedToken);
            axios.get(`${backend_url}/user`, {
                headers: {
                Authorization: `Bearer ${storedToken}`,
                    },
                })
            .then(response => {
                if(response.data.success){
                    console.log('res',response.data);
                    setLogined(true);
                    setUsername(response.data.user.username);
                    setEditName(response.data.user.username);
                    // Generate username from firstname_randomnumber format
                    const firstName = response.data.user.username?.split(' ')[0] || '';
                    const randomNum = Math.floor(Math.random() * 10000);
                    setEditUsername(response.data.user.displayUsername || `${firstName}_${randomNum}`);
                    setPhnNumber(response.data.user.phoneNumber);
                    setEmail(response.data.user.email);
                    // Check if profileImage exists and is not empty
                    const profileImg = response.data.user.profileImage;
                    console.log('Profile image from DB:', profileImg ? 'Exists' : 'Not found', profileImg ? profileImg.substring(0, 50) + '...' : '');
                    
                    if(profileImg && profileImg.trim() !== '' && profileImg !== 'null' && profileImg !== 'undefined') {
                        console.log('Loading profile image from database');
                        setProfileImage(profileImg);
                    } else {
                        console.log('No profile image found, showing avatar');
                        setProfileImage(null); // Will show avatar instead
                    }
                }
            })
            .catch(error => {
                console.error('Error fetching user data:', error.message);
            });
        }
        window.scrollTo(1,1);
      },[])


    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const handleProfile=()=>{
        const element=document.getElementById("profile");
        if(element){
          element.scrollIntoView({behavior:"smooth"})
        }
    }

    const handleLogout=async()=>{
        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`${backend_url}/logout`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
            });

            const data = await res.json();
            if (res.ok) {
                console.log("Logout successful:", data.message);
                localStorage.removeItem("token");
                setLogined(false);
                window.location.href = "/signin"; 
            } else {
                console.error("Logout failed:", data.message);
            }
        } catch (err) {
            console.error("Error logging out:", err);
        }
    }

    const handleSaveName = async () => {
        try {
            const response = await axios.put(`${backend_url}/user`, {
                username: editName
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            
            if (response.data.success) {
                setUsername(editName);
                setIsEditingName(false);
            }
        } catch (error) {
            console.error('Error updating name:', error.message);
        }
    }

    // Get first letter of name for avatar
    const getInitials = (name) => {
        if (!name) return 'U';
        const firstLetter = name.trim().charAt(0).toUpperCase();
        return firstLetter;
    }

    // Get color based on first letter for consistent avatar colors
    const getAvatarColor = (letter) => {
        const colors = [
            'bg-gradient-to-br from-indigo-500 to-purple-600',
            'bg-gradient-to-br from-blue-500 to-cyan-600',
            'bg-gradient-to-br from-green-500 to-emerald-600',
            'bg-gradient-to-br from-orange-500 to-red-600',
            'bg-gradient-to-br from-pink-500 to-rose-600',
            'bg-gradient-to-br from-yellow-500 to-orange-600',
            'bg-gradient-to-br from-teal-500 to-blue-600',
            'bg-gradient-to-br from-purple-500 to-indigo-600',
        ];
        const index = letter.charCodeAt(0) % colors.length;
        return colors[index];
    }

    const handleSaveUsername = async () => {
        try {
            const response = await axios.put(`${backend_url}/user`, {
                displayUsername: editUsername
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            
            if (response.data.success) {
                setIsEditingUsername(false);
            }
        } catch (error) {
            console.error('Error updating username:', error.message);
        }
    }

    const handleCancelName = () => {
        setEditName(username);
        setIsEditingName(false);
    }

    const handleCancelUsername = () => {
        const firstName = username?.split(' ')[0] || '';
        const randomNum = Math.floor(Math.random() * 10000);
        setEditUsername(`${firstName}_${randomNum}`);
        setIsEditingUsername(false);
    }

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const createImage = (url) =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener('load', () => resolve(image));
            image.addEventListener('error', (error) => reject(error));
            image.setAttribute('crossOrigin', 'anonymous');
            image.src = url;
        });

    const getCroppedImg = async (imageSrc, pixelCrop) => {
        try {
            const image = await createImage(imageSrc);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                throw new Error('Could not get canvas context');
            }

            const maxSize = Math.max(image.width, image.height);
            const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

            canvas.width = safeArea;
            canvas.height = safeArea;

            ctx.drawImage(
                image,
                safeArea / 2 - image.width * 0.5,
                safeArea / 2 - image.height * 0.5
            );
            const data = ctx.getImageData(0, 0, safeArea, safeArea);

            // Limit maximum dimensions to 800x800 to reduce file size
            const MAX_DIMENSION = 800;
            let outputWidth = pixelCrop.width;
            let outputHeight = pixelCrop.height;
            let scale = 1;

            if (outputWidth > MAX_DIMENSION || outputHeight > MAX_DIMENSION) {
                scale = MAX_DIMENSION / Math.max(outputWidth, outputHeight);
                outputWidth = Math.round(outputWidth * scale);
                outputHeight = Math.round(outputHeight * scale);
            }

            // Create a temporary canvas for the full-size crop
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            tempCanvas.width = pixelCrop.width;
            tempCanvas.height = pixelCrop.height;
            
            tempCtx.putImageData(
                data,
                Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
                Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
            );

            // Set final canvas size and draw scaled version
            canvas.width = outputWidth;
            canvas.height = outputHeight;
            ctx.drawImage(tempCanvas, 0, 0, pixelCrop.width, pixelCrop.height, 0, 0, outputWidth, outputHeight);

            return new Promise((resolve, reject) => {
                canvas.toBlob((blob) => {
                    if (!blob) {
                        reject(new Error('Failed to create blob from canvas'));
                        return;
                    }
                    // Convert blob to base64 for database storage
                    const reader = new FileReader();
                    reader.onerror = () => reject(new Error('Failed to read blob as data URL'));
                    reader.onloadend = () => {
                        if (reader.result) {
                            resolve(reader.result); // This will be a base64 string
                        } else {
                            reject(new Error('Failed to convert blob to base64'));
                        }
                    };
                    reader.readAsDataURL(blob);
                }, 'image/jpeg', 0.75); // Quality 0.75 for good balance between quality and size
            });
        } catch (error) {
            console.error('Error in getCroppedImg:', error);
            throw error;
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageSrc(reader.result);
                setShowImageEditor(true);
                setImageUrl('');
                setCroppedAreaPixels(null); // Reset crop area when new image loads
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageUrlSubmit = () => {
        if (imageUrl) {
            setImageSrc(imageUrl);
            setShowImageEditor(true);
            setCroppedAreaPixels(null); // Reset crop area when new image loads
        }
    };

    const handleCropComplete = async () => {
        // Validate that we have the necessary data
        if (!imageSrc) {
            console.error('No image source available');
            alert('Please select an image first');
            return;
        }

        if (!croppedAreaPixels) {
            console.error('Crop area not initialized. Please adjust the image first.');
            alert('Please adjust the image position or zoom before saving.');
            return;
        }

        if (!token) {
            console.error('No authentication token available');
            alert('Please log in again to save your profile image.');
            return;
        }

        setIsSavingImage(true);
        try {
            console.log('Starting image crop process...');
            const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
            
            if (!croppedImage) {
                throw new Error('Failed to generate cropped image');
            }

            console.log('Cropped image generated, size:', croppedImage.length, 'characters');
            
            // Save to backend as base64
            const response = await axios.put(`${backend_url}/user`, {
                profileImage: croppedImage
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.data && response.data.success) {
                console.log('Profile image updated successfully');
                // Update local state only after successful save
                setProfileImage(croppedImage);
                setShowImageEditor(false);
                setImageSrc(null);
                setImageUrl('');
                setCrop({ x: 0, y: 0 });
                setZoom(1);
                setCroppedAreaPixels(null);
            } else {
                console.error('Failed to save profile image:', response.data);
                const errorMessage = response.data?.message || 'Failed to save profile image. Please try again.';
                alert(errorMessage);
            }
        } catch (error) {
            console.error('Error cropping/saving image:', error);
            
            // Provide more specific error messages
            let errorMessage = 'An error occurred while saving the image. Please try again.';
            
            if (error.response) {
                // Server responded with error status
                console.error('Server error:', error.response.status, error.response.data);
                errorMessage = error.response.data?.message || `Server error: ${error.response.status}. Please try again.`;
            } else if (error.request) {
                // Request was made but no response received
                console.error('No response from server:', error.request);
                errorMessage = 'Could not connect to server. Please check your internet connection and try again.';
            } else if (error.message) {
                // Error in image processing
                console.error('Image processing error:', error.message);
                errorMessage = `Error processing image: ${error.message}. Please try a different image.`;
            }
            
            alert(errorMessage);
        } finally {
            setIsSavingImage(false);
        }
    };

    const handleCloseImageEditor = () => {
        setShowImageEditor(false);
        setImageSrc(null);
        setImageUrl('');
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCroppedAreaPixels(null);
        setIsSavingImage(false);
    };

    return(
        <div className={`w-full min-h-screen transition-colors duration-300 py-8 px-4 ${isDark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'}`}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <button 
                            onClick={handleClick}
                            className={`flex items-center gap-2 px-4 py-2 ${isDark ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' : 'bg-white text-gray-700'} rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-semibold`}
                        >
                            My Account
                            <KeyboardArrowDownIcon/>
                        </button>
                        <Popover
                            id={id}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                        >
                            <Link to='/mytrips' onClick={handleClose}>
                                <div className={`flex flex-row space-x-4 p-4 ${isDark ? 'bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 border-indigo-500' : 'bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 border-indigo-600'} transition-all duration-300 cursor-pointer border-l-4`}>
                                    <CardTravelIcon className={`${isDark ? 'text-indigo-400' : 'text-indigo-600'} my-auto`}/>
                                    <div className="flex flex-col">
                                        <h1 className={`font-bold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>My Trips</h1>
                                        <h4 className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>See booking details, cancel or modify bookings</h4>
                                    </div>
                                </div>
                            </Link>
                        </Popover>
                        <KeyboardArrowRightIcon className={isDark ? 'text-gray-500' : 'text-gray-400'}/>
                        <h1 className={isDark ? 'text-gray-400 font-medium' : 'text-gray-600 font-medium'}>My Profile</h1>
                    </div>
                    <h1 className={`text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent`}>Profile Settings</h1>
                    <p className={isDark ? 'text-gray-400 mt-2' : 'text-gray-600 mt-2'}>Manage your personal information and account details</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Sidebar */}
                    <div className="lg:col-span-1">
                        <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200/50'} rounded-xl shadow-lg border overflow-hidden sticky top-4 transition-colors duration-300`}>
                            {/* Profile Header with Gradient */}
                            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5 text-white">
                                <div className="flex flex-col items-center">
                                    <div className="relative mb-3 group">
                                        <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg">
                                            {profileImage && profileImage.trim() !== '' ? (
                                                <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center overflow-hidden">
                                                    <img 
                                                        src={profileImage} 
                                                        className="w-full h-full object-cover rounded-full" 
                                                        alt="Profile"
                                                        onError={(e) => {
                                                            console.error('Image load error, showing avatar');
                                                            setProfileImage(null);
                                                        }}
                                                    />
                                                </div>
                                            ) : (
                                                <div className={`w-full h-full rounded-full ${getAvatarColor(getInitials(username))} flex items-center justify-center`}>
                                                    <span className="text-3xl font-bold text-white">{getInitials(username)}</span>
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => setShowImageEditor(true)}
                                            className="absolute bottom-0 right-0 w-8 h-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 border-2 border-white"
                                            title="Edit Profile Image"
                                        >
                                            <PhotoCameraIcon className="text-sm"/>
                                        </button>
                                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-md flex items-center justify-center">
                                            <VerifiedUserIcon className="text-white text-xs"/>
                                        </div>
                                    </div>
                                    <h1 className="text-xl font-bold mb-1">{username || 'User'}</h1>
                                    <p className="text-xs text-white/80 uppercase tracking-wide">Verified Account</p>
                                </div>
                            </div>

                            {/* Navigation Menu */}
                            <div className="p-4 space-y-2">
                                <button 
                                    onClick={handleProfile}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 rounded-lg font-semibold hover:from-indigo-100 hover:to-purple-100 transition-all duration-300 border-l-4 border-indigo-600"
                                >
                                    <AccountCircleIcon className="text-lg"/>
                                    <span>Profile</span>
                                </button>
                                <Link to='/mytrips' className="block">
                                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300">
                                        <CardTravelIcon className="text-lg"/>
                                        <span>My Trips</span>
                                    </button>
                                </Link>
                                <button 
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-all duration-300"
                                >
                                    <LogoutIcon className="text-lg"/>
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="lg:col-span-2 space-y-5">
                        {/* Profile Information Card */}
                        <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200/50'} rounded-2xl shadow-2xl border overflow-hidden transform hover:shadow-3xl transition-all duration-300`} id="profile">
                            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-5 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                                <div className="relative z-10">
                                    <h1 className="text-xl font-bold text-white flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                            <PersonIcon className="text-white text-xl"/>
                                        </div>
                                        Profile Information
                                    </h1>
                                    <p className="text-white/90 text-sm mt-2">Basic info for a faster booking experience</p>
                                </div>
                            </div>
                            
                            <div className="p-6 md:p-8">
                                <div className={`${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-indigo-100'} rounded-xl p-6 shadow-inner border-2 transition-colors duration-300`}>
                                    {/* Name Field */}
                                    <div className={`mb-6 pb-6 border-b ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                                        <div className="flex items-center justify-between mb-3">
                                            <label className={`text-sm font-bold ${isDark ? 'text-indigo-400' : 'text-indigo-700'} uppercase tracking-wider flex items-center gap-2`}>
                                                <PersonIcon className="text-base"/>
                                                Name
                                            </label>
                                            {!isEditingName && (
                                                <button
                                                    onClick={() => setIsEditingName(true)}
                                                    className={`group p-2 ${isDark ? 'hover:bg-gray-600' : 'hover:bg-indigo-100'} rounded-lg transition-all duration-300 hover:scale-110`}
                                                    title="Edit Name"
                                                >
                                                    <EditIcon className={`${isDark ? 'text-indigo-400 group-hover:text-indigo-300' : 'text-indigo-600 group-hover:text-indigo-700'} text-lg`}/>
                                                </button>
                                            )}
                                        </div>
                                        {isEditingName ? (
                                            <div className="space-y-3">
                                                <input
                                                    type="text"
                                                    value={editName}
                                                    onChange={(e) => setEditName(e.target.value)}
                                                    className={`w-full px-4 py-3 border-2 ${isDark ? 'border-indigo-500 bg-gray-800 text-gray-200 focus:ring-indigo-400' : 'border-indigo-300 bg-gray-50 text-gray-800 focus:ring-indigo-500'} rounded-xl focus:outline-none focus:ring-2 focus:border-indigo-500 text-base font-semibold transition-all duration-300`}
                                                    autoFocus
                                                />
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={handleSaveName}
                                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                                                        title="Save"
                                                    >
                                                        <SaveIcon className="text-base"/>
                                                        <span className="text-sm font-semibold">Save</span>
                                                    </button>
                                                    <button
                                                        onClick={handleCancelName}
                                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                                                        title="Cancel"
                                                    >
                                                        <CancelIcon className="text-base"/>
                                                        <span className="text-sm font-semibold">Cancel</span>
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className={`${isDark ? 'bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border-indigo-700' : 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200'} rounded-xl p-4 border transition-colors duration-300`}>
                                                <p className={`text-lg font-bold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>{username || 'Not provided'}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Username Field */}
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <label className={`text-sm font-bold ${isDark ? 'text-indigo-400' : 'text-indigo-700'} uppercase tracking-wider flex items-center gap-2`}>
                                                <AccountCircleIcon className="text-base"/>
                                                Username
                                            </label>
                                            {!isEditingUsername && (
                                                <button
                                                    onClick={() => setIsEditingUsername(true)}
                                                    className={`group p-2 ${isDark ? 'hover:bg-gray-600' : 'hover:bg-indigo-100'} rounded-lg transition-all duration-300 hover:scale-110`}
                                                    title="Edit Username"
                                                >
                                                    <EditIcon className={`${isDark ? 'text-indigo-400 group-hover:text-indigo-300' : 'text-indigo-600 group-hover:text-indigo-700'} text-lg`}/>
                                                </button>
                                            )}
                                        </div>
                                        {isEditingUsername ? (
                                            <div className="space-y-3">
                                                <input
                                                    type="text"
                                                    value={editUsername}
                                                    onChange={(e) => setEditUsername(e.target.value)}
                                                    className={`w-full px-4 py-3 border-2 ${isDark ? 'border-indigo-500 bg-gray-800 text-gray-200 focus:ring-indigo-400' : 'border-indigo-300 bg-gray-50 text-gray-800 focus:ring-indigo-500'} rounded-xl focus:outline-none focus:ring-2 focus:border-indigo-500 text-base font-semibold transition-all duration-300`}
                                                    placeholder="firstname_randomnumber"
                                                    autoFocus
                                                />
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={handleSaveUsername}
                                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                                                        title="Save"
                                                    >
                                                        <SaveIcon className="text-base"/>
                                                        <span className="text-sm font-semibold">Save</span>
                                                    </button>
                                                    <button
                                                        onClick={handleCancelUsername}
                                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                                                        title="Cancel"
                                                    >
                                                        <CancelIcon className="text-base"/>
                                                        <span className="text-sm font-semibold">Cancel</span>
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className={`${isDark ? 'bg-gradient-to-r from-blue-900/50 to-cyan-900/50 border-blue-700' : 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200'} rounded-xl p-4 border transition-colors duration-300`}>
                                                <p className={`text-base font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{editUsername || `${username?.split(' ')[0] || 'user'}_${Math.floor(Math.random() * 10000)}`}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Editor Modal */}
            <Dialog 
                open={showImageEditor} 
                onClose={handleCloseImageEditor}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    style: {
                        borderRadius: '16px',
                        padding: '20px',
                        backgroundColor: isDark ? '#1f2937' : '#ffffff'
                    }
                }}
            >
                <DialogContent>
                    <div className="space-y-4">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <h2 className={`text-xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-800'} flex items-center gap-2`}>
                                <CropIcon className="text-indigo-600"/>
                                Edit Profile Image
                            </h2>
                            <button
                                onClick={handleCloseImageEditor}
                                className={`p-2 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-full transition-all duration-300`}
                            >
                                <CloseIcon className={isDark ? 'text-gray-300' : 'text-gray-600'}/>
                            </button>
                        </div>

                        {/* Image Source Options */}
                        {!imageSrc && (
                            <div className="space-y-4">
                                <div className={`${isDark ? 'bg-gradient-to-r from-gray-800 to-gray-700 border-gray-600' : 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200'} rounded-xl p-6 border-2 transition-colors duration-300`}>
                                    <h3 className={`text-sm font-bold ${isDark ? 'text-indigo-400' : 'text-indigo-700'} mb-4 uppercase tracking-wide`}>Choose Image Source</h3>
                                    
                                    {/* Upload from Device */}
                                    <div className="mb-4">
                                        <label className={`text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-2 flex items-center gap-2`}>
                                            <PhotoCameraIcon className="text-sm"/>
                                            Upload from Device
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer"
                                        />
                                    </div>
                                    
                                    {/* Or Enter URL */}
                                    <div className={`border-t ${isDark ? 'border-gray-600' : 'border-indigo-200'} pt-4`}>
                                        <label className={`text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-2 flex items-center gap-2`}>
                                            <LinkIcon className="text-sm"/>
                                            Or Enter Image URL
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={imageUrl}
                                                onChange={(e) => setImageUrl(e.target.value)}
                                                placeholder="https://example.com/image.jpg"
                                                className={`flex-1 px-4 py-2 border-2 ${isDark ? 'border-indigo-500 bg-gray-800 text-gray-200' : 'border-indigo-200 bg-white text-gray-800'} rounded-lg focus:outline-none focus:border-indigo-500 text-sm`}
                                            />
                                            <button
                                                onClick={handleImageUrlSubmit}
                                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
                                            >
                                                Load
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Crop Area */}
                        {imageSrc && (
                            <div className="space-y-4">
                                <div className={`relative w-full h-96 ${isDark ? 'bg-gray-700' : 'bg-gray-100'} rounded-xl overflow-hidden`}>
                                    <Cropper
                                        image={imageSrc}
                                        crop={crop}
                                        zoom={zoom}
                                        aspect={1}
                                        onCropChange={setCrop}
                                        onZoomChange={setZoom}
                                        onCropComplete={onCropComplete}
                                        cropShape="round"
                                    />
                                </div>

                                {/* Zoom Control */}
                                <div className="space-y-2">
                                    <label className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Zoom</label>
                                    <input
                                        type="range"
                                        value={zoom}
                                        min={1}
                                        max={3}
                                        step={0.1}
                                        onChange={(e) => setZoom(parseFloat(e.target.value))}
                                        className="w-full"
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-3 pt-4">
                                    <button
                                        onClick={handleCropComplete}
                                        disabled={isSavingImage || !croppedAreaPixels}
                                        className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                                            isSavingImage || !croppedAreaPixels ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''
                                        }`}
                                    >
                                        {isSavingImage ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                <span>Saving...</span>
                                            </>
                                        ) : (
                                            <>
                                                <SaveIcon className="text-lg"/>
                                                <span>Save & Apply</span>
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={handleCloseImageEditor}
                                        disabled={isSavingImage}
                                        className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                                            isSavingImage ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''
                                        }`}
                                    >
                                        <CancelIcon className="text-lg"/>
                                        <span>Cancel</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default MyAccount;