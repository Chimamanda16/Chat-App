import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getUsersForSidebar } from "../controllers/message.controller.js";
import { getMessages, sendMessages } from "../controllers/message.controller.js";

const messageRoute = express.Router();

messageRoute.get("/users", protectRoute, getUsersForSidebar);
messageRoute.get("/:id", protectRoute, getMessages);
messageRoute.get("/send/:id", protectRoute, sendMessages);

export default messageRoute;