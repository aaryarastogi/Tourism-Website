import collection from "../Schema/Login/LoginSchema.js"
import bcrypt from 'bcrypt'
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client("297704508492-ci2ff1dipf6i9sliop0m02k2pqtcdalo.apps.googleusercontent.com");

export async function handleSignIn(req, res) {
  const { email, password } = req.body;

  try {
    const user = await collection.findOne({ email });
    if (!user) {
      return res.send("notexist");
    }

    const isPwdMatch = await bcrypt.compare(password, user.password);
    if (!isPwdMatch) {
      return res.send("pwdnotmatch");
    }

    const token = await user.generateAuthToken();  
    res.json({
      message: "success",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      token: token
    });

  } catch (error) {
    console.log("Login Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function handleSignUp(req, res) {
  try {
    const { username, email, password, phoneNumber } = req.body;
    if (!username || !email || !password || !phoneNumber) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (!email.includes("@")) {
      return res.status(400).json({ error: "Invalid email" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password too short" });
    }
    if (phoneNumber.length !== 10) {
      return res.status(400).json({ error: "Phone number must be 10 digits" });
    }
    const existingUser = await collection.findOne({ email });

    if (existingUser) {
      return res.json("exist");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new collection({
      username,
      email,
      password: hashedPassword,
      phoneNumber,
    });
    await newUser.save();
    return res.json("success");

  } catch (error) {
    console.log("Signup Error:", error);
    return res.status(500).json({ error: "Server error" });
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