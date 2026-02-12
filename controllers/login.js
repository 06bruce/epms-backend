import { usersStorage } from "../config/storage.js";
import bcrypt from "bcrypt";
import { generateToken } from "../config/generateTiken.js";

export const signup = async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please provide username, email, and password to create an account." });
    }

    // Check if user already exists
    const existingUser = usersStorage.findOne(u => u.username === username || u.email === email);
    if (existingUser) {
      return res.status(409).json({ message: "This username or email is already registered. Please use a different one or try logging in." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = usersStorage.insert({
      username,
      email,
      password: hashedPassword,
      fullName: fullName || null,
      role: 'admin'
    });

    return res.status(201).json({
      message: "Account created successfully. You can now login.",
      userId: newUser.id,
      username: newUser.username,
      email: newUser.email,
      fullName: newUser.fullName
    });

  } catch (error) {
    console.error("Signup error:", error.message);
    res.status(500).json({ message: "An unexpected error occurred. Please try again." });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Please provide username and password to login." });
    }

    const user = usersStorage.findOne(u => u.username === username);
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password. Please check and try again." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password. Please check and try again." });
    }

    const token = generateToken(user.id, user.email);

    return res.status(200).json({
      message: "Login successful. Welcome back!",
      token,
      user: {
        userId: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName
      }
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "An unexpected error occurred during login. Please try again." });
  }
};
