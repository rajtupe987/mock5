const jwt =require('jsonwebtoken')

const {usermodel}=require("../models/users.model")
require("dotenv").config()
const authMiddleWare = async(req,res,next)=>{
    try {
        const token = req.headers.authorization;
        const decodedToken = jwt.verify(token,process.env.key_secret);
        const {userId} = decodedToken;
        const user = await usermodel.findById(userId);
        if(!user){
            return res.status(401).json({message:"user not exist..",ok:false})
        }
        if (user.isBlacklisted) {
            return res.status(401).json({ message: "User is blacklisted", ok: false });
          }

        req.body.user = user._id;
        next()
    } catch (error) {
        console.log("asdfasdfasdfsdaf")
        return res.status(401).json({message:error.message})
    }
}

module.exports = {authMiddleWare}
