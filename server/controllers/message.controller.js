import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUsersForSidebar = async(req, res) =>{
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = User.find({_id: {$ne: loggedInUserId}});
        res.status(200).json({filteredUsers});
    } catch (error) {
        console.log("Error in message controller", error.message);
        res.status(500).json({message: "Internal server error"});
    }
}

export const getMessages = async(req, res) =>{
    try {
        const {id: userToChatId} = req.params;
        const loggedInUserId = req.user._id;
        const messages = Message.find({
            $or:[
                {senderId: loggedInUserId, receiverId: userToChatId},
                {senderId: userToChatId, receiverId: loggedInUserId}
            ]
        })
        res.status(200).json({messages});
    } catch (error) {
        console.error("Error in message controller", error.message);
        res.status.send(500).json({message: "Internal server error"});
    }
};

export const sendMessages = async(req, res) =>{
    try {
        const {senderId} = req.user._id;
        const {id: receiverId} = req.params;
        const {text, image} = req.body;
        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });
        await newMessage.save();
        
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error in sendMessage controller", error.message);
        res.status(500).json({message: "Internal server error"});
    }
};