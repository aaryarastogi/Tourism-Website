import collection from "../Schema/Login/LoginSchema.js"
import bcrypt from 'bcrypt'
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client("297704508492-ci2ff1dipf6i9sliop0m02k2pqtcdalo.apps.googleusercontent.com");

export async function handleSignIn(req,res){
    const {username,email,password,phoneNumber}=req.body;
    try{
        const check=await collection.findOne({email:email}) 
        if(check){
            const isPwdMatch = bcrypt.compare(password,check.password)
            if(isPwdMatch){ 
              req.session.user=check
              req.session.loggedIn=true

              const token= await check.generateAuthToken();
              res.send(req.session.user);
            }
            else{
              console.log("pwd not match")
            }
        }
        else{
          res.json("notexist")
        }
    }
    catch(e){
        console.log("tokenerror",e);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function handleSignUp(req,res){
    console.log(req.body)
    const { username,email , password ,phoneNumber}=req.body
    try{
        const hashedPassword=await bcrypt.hash(password,10);
        const data={
            username:username,
            email:email,
            password:hashedPassword,
            phoneNumber:phoneNumber
        }
        const check=await collection.findOne({email:email})

        if(check){
            res.json("exist")
        }
        else{
            res.json("notexist")
            await collection.insertMany([data])
        }
    }
    catch(e){
        console.log(e);
    }
}

export async function googleAuthenticateUser(req, res) {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, message: "Token missing" });
    }
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: "297704508492-ci2ff1dipf6i9sliop0m02k2pqtcdalo.apps.googleusercontent.com",
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;
    console.log("Verified user:", email, name);
    let user = await collection.findOne({ email });

    if (!user) {
      user = new collection({
        username: name,
        email,
      });
      await user.save();
    }
    const appToken = await user.generateAuthToken();

    return res.status(200).json({
      success: true,
      token: appToken, 
      user: {
        username: user.username,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("Error during Google authentication:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}