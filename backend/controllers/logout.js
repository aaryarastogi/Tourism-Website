import collection from "../Schema/Login/LoginSchema.js";

export async function handleLogout(req, res){
  try {
    let user = req.user; // set by auth middleware after token verification
    const token = req.token; // get token from middleware

    const userData=await collection.findOne({_id:req.user.user._id});

    userData.tokens = userData.tokens.filter(t => t.token !== token);
    user = userData;

    await user.save();
    console.log("logout successfull...");
    res.status(200).json({ message: 'Logout successful' });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: 'Logout failed' });
  }
}