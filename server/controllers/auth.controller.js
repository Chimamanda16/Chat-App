import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';

//Signup controller
export const signup = async(req, res) => {

    //Get the user details from the request body
    const {fullName, email, password} = req.body;
    try{

        //Check if any field is empty
        if(!fullName || !email || !password){
            return res.status(400).send('Please fill in all fields');
        }

        //Check if password is at least 6 characters long
        if(password.length < 6){
            return res.status(400).send('Password must be at least 6 characters long');
        }

        //Check if user with the email already exists
        const user = await User.findOne({email});
        if(user){
            return res.status(400).send('User already exists');
        }

        //Generate salt and hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // Create a new user
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        });
        await newUser.save();
        //Check if user has been created
        if(newUser){
            generateToken(newUser._id, res);
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email
            });
        }

    }
    catch(err){
        console.error("Error in signup controller", err);
        res.status(500).send('Internal server error');
    }
}

export const login = async(req, res) => {
    try {
        //Get the user details from the request body
        const {email, password} = req.body;
        //Check if any field is empty
        if(!email || !password){
            return res.status(400).send('Please fill in all fields');
        }
        //Check if user exists
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).send('User does not exist');
        }
        //Check if password is correct
        const isMatch = bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).send('Invalid credentials');
        }
        //Generate token
        generateToken(user._id, res);
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email
        });
    } catch (error) {
        console.error("Error in login controller", error.message);
    }
}

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", {
            maxAge: 0
        })
    } catch (error) {
        console.error("Error in logout controller", error.message);
        return res.status(500).send({message: "Internal server error"})
    }
}

export const updateProfile = async(req, res) => {
    try {
        const { profilePic } = req.body;
        const { userId } = req.user._id;
        if(!profilePic){
            return res.status(400).send("Please upload a profile picture")
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const newUser = await User.findByIdAndUpdate(userId, {profilePic: uploadResponse.secure_url}, {new: true});
        res.status(200).json({newUser});
    } catch (error) {
        console.error("Error in updateProfile controller", error.message);
        res.status(500).send("internal Server Error")
    }
}

export const checkAuth = async(req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.error("Error in checkAuth controller", error.message);
        res.status(500).send("Internal Server Error")
    }
}