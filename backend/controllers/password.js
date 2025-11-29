import crypto from "crypto";
import collection from "../Schema/Login/LoginSchema.js";
import sendEmail from "../utils/sendEmail.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from 'nodemailer';

export const forgetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    if(email){
      const user = await collection.findOne({ email });
      console.log("user", user);

      if (!user) {
        return res.status(400).json({ success: false, message: "Invalid user." });
      }
      //generate token
      const secretKey = user._id + "tourismwebsite";

      const token = jwt.sign({userId: user._id}, secretKey,{
        expiresIn: "5m"
      });

      const link = `http://localhost:3000/user/reset/${user._id}/${token}`;
      const transport = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth:{
          user: process.env.USER_MAIL,
          pass: process.env.USER_PWD
        },
      });

      const mailOptions = {
        from : process.env. USER_MAIL,
        to: email,
        subject: `Password Reset Request`,
        text: `<!doctype html>
              <html lang="en-US">

              <head>
                  <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
                  <title>Reset Password Email Template</title>
                  <meta name="description" content="Reset Password Email Template.">
                  <style type="text/css">
                      a:hover {text-decoration: underline !important;}
                  </style>
              </head>

              <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
                  <!--100% body table-->
                  <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
                      style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
                      <tr>
                          <td>
                              <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                                  align="center" cellpadding="0" cellspacing="0">
                                  
                                  <tr>
                                      <td>
                                          <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                              style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                              <tr>
                                                  <td style="height:40px;">&nbsp;</td>
                                              </tr>
                                              <tr>
                                                  <td style="padding:0 35px;">
                                                      <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You have
                                                          requested to reset your password</h1>
                                                      <span
                                                          style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                                      <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                                          Click below Link and Verify your EMail.
                                                      </p>
                                                      <a href=${link}
                                                          style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Verify Email</a>
                                                  </td>
                                              </tr>
                                              <tr>
                                                  <td style="height:40px;">&nbsp;</td>
                                              </tr>
                                          </table>
                                      </td>
                                
                              </table>
                          </td>
                      </tr>
                  </table>
                  <!--/100% body table-->
              </body>

              </html>`,
        html: `<!doctype html>
        <html lang="en-US">
        <head>
            <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
            <title>Reset Password Email Template</title>
            <meta name="description" content="Reset Password Email Template.">
            <style type="text/css">
                a:hover {text-decoration: underline !important;}
            </style>
        </head>
        <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
            <!--100% body table-->
            <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
                style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
                <tr>
                    <td>
                        <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                            align="center" cellpadding="0" cellspacing="0">
                          
                            <tr>
                                <td>
                                    <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                        style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                        <tr>
                                            <td style="height:40px;">&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td style="padding:0 35px;">
                                                <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You have
                                                    requested to reset your password</h1>
                                                <span
                                                    style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                                <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                                    Click below Link and Verify your EMail..
                                                </p>
                                                <a href="${link}"
                                                    style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Verify Email</a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="height:40px;">&nbsp;</td>
                                        </tr>
                                    </table>
                                </td>
                          
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>`,
      };

      transport.sendMail(mailOptions, (error, info)=>{
        console.log(error);
        if(error){
          return res.status(400).json({message: "ye wali Error"});
        }
        return res.status(200).json({message: "Email sent"});
      });
      }
    else{
      return res.status(400).json({ success: false, message: "Email is required" });
    }
  } catch (err) {
    console.error("ye hua", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


export const forgetPasswordEmail = async(req,res)=>{
  const {newPassword, confirmPassword} = req.body;
  const {id,token} = req.params;

  try{
    if(newPassword && confirmPassword && id && token){
      if(newPassword === confirmPassword){
        const user = await collection.findById(id);
        //token verify (expire to nhi hogya)
        const secretKey = user._id + "tourismwebsite";
        const isValid = await jwt.verify(token,secretKey);
        if(isValid){
          //password hashing
          const genSalt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(newPassword, genSalt);

          const isSuccess = await collection.findByIdAndUpdate(user._id , {
            $set : {
              password: hashedPassword,
            }
          });

          if(isSuccess){
            return res.status(200).json({message: "Password changes successfully."});
          }
          else{
            return res.status(400).json({message: "User's new password is not updated."});
          }
        }
        else{
          return res.status(400).json({message: "Link has been expired."});
        }

      }
      else{
        return res.status(400).json({message: "Password & confirm password are not matching."});
      }
    }
    else{
      return res.status(400).json({message: "All fields are required."});
    }
  }catch(error){
    console.log(error);
    return res.status(400).json({message: "ye wali hori"});
  }
}