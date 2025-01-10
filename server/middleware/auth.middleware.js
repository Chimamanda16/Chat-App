import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

dotenv.config();

export const protectRoute = async(req, res, next) =>{
    try {
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).send({message: "User not authorized"})
        }
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if(!verified){
            res.status(401).send({message: "User not authorized"});
        }
        const user = await User.findById(verified.userId).select("-passsword")
        if(!user){
            res.status(404).send({message: "User not found"});
        }
        req.user = user;
        next();
    } catch (error) {
        console.error("Error in protectRoute controller", error.message);
        res.status(500).send({message: "Internal server error"});
    }
}