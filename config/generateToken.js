import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

export const generateToken = (userId, email) => {
    const token = jwt.sign(
        { userId: userId.toString(), email: email },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
    return token;
}