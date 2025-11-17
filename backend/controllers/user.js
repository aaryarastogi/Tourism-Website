import collection from "../Schema/Login/LoginSchema.js";

export async function handleUser(req, res){
    console.log('body',req.user);

    try{
        const userData=await collection.findOne({_id:req.user.user._id});
        console.log('data',userData);
        if(userData){
            console.log('Profile image exists:', !!userData.profileImage);
            return res.status(200).json({success:true,user:userData})
        }else{
            console.log('userdata failed');
        }
    }catch(e){
        console.log('/user not working',e.message);
        return res.status(400).json({success:false})
    }
}

export async function updateUser(req, res){
    try{
        const { username, profileImage, displayUsername } = req.body;
        const userId = req.user.user._id;
        
        const updateData = {};
        if(username) updateData.username = username;
        if(profileImage !== undefined && profileImage !== null) {
            updateData.profileImage = profileImage;
        }
        if(displayUsername) updateData.displayUsername = displayUsername;
        
        console.log('Updating user with data:', { username, hasProfileImage: !!profileImage, displayUsername });
        
        const updatedUser = await collection.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true }
        );
        
        if(updatedUser){
            console.log('User updated successfully, profileImage exists:', !!updatedUser.profileImage);
            return res.status(200).json({success:true, user:updatedUser})
        }else{
            return res.status(404).json({success:false, message:'User not found'})
        }
    }catch(e){
        console.log('Update user error',e.message);
        return res.status(400).json({success:false, message:e.message})
    }
}