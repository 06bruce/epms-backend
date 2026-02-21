import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();

const getSecret = () => process.env.JWT_SECRET || "your_jwt_secret_key";

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided. Please login." });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Session expired. Please login again." });
    }

    const decoded = jwt.verify(token, getSecret());
    // Standardizing on userId across the app
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Your session has expired. Please login again." });
    }
    return res.status(401).json({ message: "Invalid session. Please login again." });
  }
};
