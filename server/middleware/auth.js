import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.json({
            success: false,
            message: "not authorized"
        });
    }

    try {
        const token = authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : authHeader;

        const userId = jwt.verify(token, process.env.JWT_SECRET);

        if (!userId) {
            return res.json({
                success: false,
                message: "not authorized"
            });
        }

        req.user = await User.findById(userId).select("-password");

        if (!req.user) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        next();

    } catch (error) {
        console.log(error.message);

        return res.json({
            success: false,
            message: "not authorized"
        });
    }
};